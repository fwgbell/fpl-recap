/** Small DOM + animation helpers (no dependencies). */

/** Reveal elements as they scroll into view. */
export function setupReveal(root = document) {
  const els = root.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
  );
  els.forEach((el) => io.observe(el));
}

/** Count a number up from 0 when it scrolls into view. */
export function setupCountUps(root = document) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = [...root.querySelectorAll('[data-count]')];
  const run = (el) => {
    const target = parseFloat(el.dataset.count);
    const dur = 1000;
    if (reduce) {
      el.textContent = fmt(target, el.dataset.decimals);
      return;
    }
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased, el.dataset.decimals);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          run(e.target);
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.6 },
  );
  els.forEach((el) => io.observe(el));
}

const fmt = (n, decimals) =>
  decimals ? n.toFixed(Number(decimals)) : Math.round(n).toString();

/** Fill scoreboard bars (width set from data-fill) when the board is visible. */
export function setupBars(root = document) {
  const boards = root.querySelectorAll('[data-bars]');
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.querySelectorAll('.row__fill').forEach((f, i) => {
          setTimeout(() => (f.style.width = f.dataset.fill), 90 * i);
        });
        io.unobserve(e.target);
      }
    },
    { threshold: 0.25 },
  );
  boards.forEach((b) => io.observe(b));
}

/** Top progress bar tied to scroll position. */
export function setupProgress() {
  const bar = document.querySelector('.progress');
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = `${pct}%`;
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/** Scrollspy dots - highlight the active section. */
export function setupScrollspy() {
  const links = [...document.querySelectorAll('.nav a')];
  if (!links.length) return;
  const byId = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          byId.get(e.target.id)?.classList.add('active');
        }
      }
    },
    { threshold: 0.5 },
  );
  byId.forEach((_, id) => {
    const sec = document.getElementById(id);
    if (sec) io.observe(sec);
  });
}

/**
 * Floating tooltip for the results matrix.
 *  - Mouse / fine pointer: hover a cell to preview; the tip follows the cursor.
 *  - Touch / pen: tap a cell to pin the tip above it (so a finger doesn't cover
 *    it); tap it again, tap outside, or scroll to dismiss. This avoids the
 *    classic "stuck tooltip" when swiping the horizontally-scrollable grid.
 */
export function setupMatrixTooltip(root = document) {
  const wrap = root.querySelector('[data-matrix]');
  if (!wrap) return;
  const tip = document.createElement('div');
  tip.className = 'mtip';
  tip.setAttribute('role', 'status');
  document.body.appendChild(tip);

  let activeCell = null;

  const render = (cell) => {
    const { q, pick, pts, state } = cell.dataset;
    const label = { hit: 'Correct', partial: 'Partial', miss: 'Missed' }[state] ?? '';
    tip.innerHTML = `<strong>${esc(cell.dataset.who)}</strong> · ${esc(q)}<br><span class="mtip__pick">${esc(pick || '-')}</span><span class="mtip__tag mtip__tag--${state}">${label} · +${pts}</span>`;
    tip.classList.add('is-on');
  };

  const hide = () => {
    tip.classList.remove('is-on');
    if (activeCell) activeCell.classList.remove('is-active');
    activeCell = null;
  };

  // Follow-the-cursor placement (mouse).
  const positionAt = (px, py) => {
    const pad = 14;
    const r = tip.getBoundingClientRect();
    let x = px + pad;
    let y = py + pad;
    if (x + r.width > window.innerWidth - 8) x = px - r.width - pad;
    if (y + r.height > window.innerHeight - 8) y = py - r.height - pad;
    tip.style.transform = `translate(${Math.max(8, x)}px, ${Math.max(8, y)}px)`;
  };

  // Pinned-above-the-cell placement (touch), flips below if there's no room.
  const positionAboveCell = (cell) => {
    const cr = cell.getBoundingClientRect();
    const tr = tip.getBoundingClientRect();
    let x = cr.left + cr.width / 2 - tr.width / 2;
    let y = cr.top - tr.height - 10;
    if (y < 8) y = cr.bottom + 10;
    x = Math.max(8, Math.min(x, window.innerWidth - tr.width - 8));
    tip.style.transform = `translate(${x}px, ${y}px)`;
  };

  /* Mouse: hover preview. */
  wrap.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const cell = e.target.closest('.cell[data-q]');
    if (cell) {
      render(cell);
      positionAt(e.clientX, e.clientY);
    } else if (!activeCell) {
      tip.classList.remove('is-on');
    }
  });
  wrap.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse' && !activeCell) tip.classList.remove('is-on');
  });

  /* Touch / pen: tap to toggle. Detect a genuine tap vs a scroll swipe. */
  let downX = 0;
  let downY = 0;
  let downCell = null;
  let downType = 'mouse';
  wrap.addEventListener('pointerdown', (e) => {
    downType = e.pointerType;
    downX = e.clientX;
    downY = e.clientY;
    downCell = e.target.closest('.cell[data-q]');
  });
  wrap.addEventListener('pointerup', (e) => {
    if (downType === 'mouse') return;
    const cell = e.target.closest('.cell[data-q]');
    const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
    if (!cell || cell !== downCell || moved > 10) return;
    if (activeCell === cell) {
      hide();
    } else {
      hide();
      activeCell = cell;
      cell.classList.add('is-active');
      render(cell);
      positionAboveCell(cell);
    }
  });

  /* Dismiss a pinned tip on outside tap or any scroll. */
  document.addEventListener('pointerdown', (e) => {
    if (activeCell && !e.target.closest('[data-matrix]')) hide();
  });
  window.addEventListener('scroll', () => activeCell && hide(), { passive: true });
  wrap.addEventListener('scroll', () => activeCell && hide(), { passive: true });
}

/** Tiny HTML escaper for interpolating data into templates. */
export const esc = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
