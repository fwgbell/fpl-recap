import '@fontsource/archivo/600.css';
import '@fontsource/archivo/800.css';
import '@fontsource/archivo/900.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './style.css';
import summary from './data/summary.json';
import predictions from './data/predictions.json';
import * as C from './content.js';
import { statFor, leaguePos } from './data/achieved.js';
import lucasImg from './assets/lucas-excuses.jpeg';
import tobyImg from './assets/toby-blocking-trades.jpeg';
import {
  setupReveal,
  setupCountUps,
  setupBars,
  setupProgress,
  setupScrollspy,
  setupMatrixTooltip,
  setupFills,
  setupGridReveal,
  esc,
} from './lib/ui.js';

const IMAGES = { lucas: lucasImg, toby: tobyImg };
const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };

/* ------------------------------------------------------------------ hero */
function hero() {
  const totalCorrect = predictions.questions.reduce(
    (s, q) => s + q.answers.filter((a) => a.correct).length,
    0,
  );
  return `
  <header class="hero" id="top">
    <div class="hero__orbs"><span></span><span></span><span></span></div>
    <div class="hero__inner reveal is-visible">
      <div class="hero__badge"><span class="dot"></span>${esc(C.hero.badge)}</div>
      <h1>${C.hero.titleLines
        .map((l, i) => `<span class="hl${i % 2 ? ' accent' : ''}">${esc(l)}</span>`)
        .join('')}</h1>
      <p class="hero__sub">${esc(C.hero.sub)}</p>
      <div class="hero__stats">
        <div class="hero__stat"><span class="num accent" data-count="${predictions.players.length}">0</span><span class="lbl">Predictors</span></div>
        <div class="hero__stat"><span class="num" data-count="${predictions.questions.length}">0</span><span class="lbl">Predictions</span></div>
        <div class="hero__stat"><span class="num" data-count="${totalCorrect}">0</span><span class="lbl">Correct calls</span></div>
        <div class="hero__stat"><span class="num accent-gold" data-count="${summary.totalPointsAvailable}">0</span><span class="lbl">Points on offer</span></div>
      </div>
    </div>
    <div class="hero__scroll">Scroll ↓</div>
  </header>`;
}

/* ----------------------------------------------------------------- intro */
function intro() {
  const paras = C.intro.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('');
  return `
  <section class="section section--intro" id="intro">
    <div class="container container--narrow">
      <div class="reveal">
        <div class="eyebrow">${esc(C.intro.eyebrow)}</div>
        <div class="prose intro-prose">${paras}</div>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------ scoreboard */
function scoreboard() {
  const max = summary.standings[0].points;
  const rows = summary.standings
    .map((s) => {
      const cls = s.rank <= 3 ? ` row--${s.rank}` : '';
      const medal = medals[s.rank] ? `<span class="row__medal">${medals[s.rank]}</span>` : '';
      return `
      <div class="row${cls}">
        <div class="row__rank">${s.rank}</div>
        <div class="row__name">${medal}${esc(s.predictor)}</div>
        <div class="row__bar"><div class="row__fill" data-fill="${(s.points / max) * 100}%"></div></div>
        <div class="row__pts">${s.points}<small>${s.hits} correct</small></div>
      </div>`;
    })
    .join('');

  // Cards run worst → best so the winner is the last thing you reach as you
  // scroll - a slow reveal that builds to the champion, then the ranked table.
  const lines = [...summary.standings]
    .reverse()
    .filter((s) => C.scoreboard.lines[s.predictor])
    .map(
      (s, i) => `
      <div class="card reveal" data-delay="${(i % 3) + 1}">
        <div class="card__q"><span>${medals[s.rank] ?? ''} ${esc(s.predictor)}</span>
          <span class="card__group" style="margin-left:auto">${s.points} pts · #${s.rank}</span></div>
        <p style="color:var(--ink-3);margin:0">${esc(C.scoreboard.lines[s.predictor])}</p>
      </div>`,
    )
    .join('');

  return `
  <section class="section" id="table">
    <div class="container">
      <div class="reveal">
        <div class="eyebrow">${esc(C.scoreboard.eyebrow)}</div>
        <h2 class="section-title">The <span class="accent-gold">Predictions</span> Table</h2>
        <p class="section-lead">${esc(C.scoreboard.lead)}</p>
      </div>
      <div class="grid grid--reveal">${lines}</div>
      <div class="board reveal" data-bars>${rows}</div>
    </div>
  </section>`;
}

/* ------------------------------------------------------ results matrix */
const GROUP_COLOR = {
  'Premier League': 'var(--pl-green)',
  Players: 'var(--pl-cyan)',
  Fantasy: 'var(--pl-gold)',
  'The League': 'var(--pl-pink)',
  Wildcard: '#b57bff',
};

function resultsGrid() {
  const qs = predictions.questions;
  const byName = Object.fromEntries(
    predictions.players.map((p) => [p, {}]),
  );
  qs.forEach((q, qi) => {
    q.answers.forEach((a) => {
      byName[a.predictor][qi] = a;
    });
  });
  const orderedPlayers = summary.standings.map((s) => s.predictor);

  const header = `
    <div class="cell cell--corner">Q →</div>
    ${qs
      .map(
        (q, i) =>
          `<div class="cell cell--head" style="--gc:${GROUP_COLOR[q.group] ?? 'var(--ink-4)'}" title="${esc(q.title)}">${i + 1}</div>`,
      )
      .join('')}`;

  const rows = orderedPlayers
    .map((name, ri) => {
      const cells = qs
        .map((q, qi) => {
          const a = byName[name][qi];
          const state = a?.correct ? 'hit' : a?.partial ? 'partial' : 'miss';
          // --i drives a diagonal, staggered fill-in (top-left → bottom-right).
          return `<div class="cell cell--fx cell--${state}" style="--i:${qi + ri}" data-q="${esc(q.title)}" data-who="${esc(name)}" data-pick="${esc(a?.display ?? a?.raw ?? '')}" data-pts="${a?.points ?? 0}" data-state="${state}"></div>`;
        })
        .join('');
      return `<div class="cell cell--name">${esc(name)}</div>${cells}`;
    })
    .join('');

  return `
  <section class="section" id="grid">
    <div class="container">
      <div class="reveal">
        <div class="eyebrow">Every Pick, Visualised</div>
        <h2 class="section-title">The <span class="accent">Grid</span></h2>
        <p class="section-lead">Eleven predictors down, thirty-one questions across, ranked best to worst. Green is a hit, amber a partial, empty a miss. Hover or tap any square for the pick.</p>
        <div class="legend">
          <span><i class="sw sw--hit"></i>Correct</span>
          <span><i class="sw sw--partial"></i>Partial</span>
          <span><i class="sw sw--miss"></i>Missed</span>
        </div>
      </div>
      <div class="matrix-wrap reveal" data-matrix>
        <div class="matrix" style="--cols:${qs.length}">${header}${rows}</div>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------- category grid */
// Collapse identical picks into one grouped line. Grouping is by the
// canonical `key` from ingest, so name variants ("Erling Haaland" ==
// "Haaland") and reordered/messy answers merge; the clean `display` is shown.
function groupAnswers(answers, slug) {
  const groups = new Map();
  for (const a of answers) {
    const k = a.key ?? (a.raw || '-').trim().toLowerCase();
    if (!groups.has(k)) {
      groups.set(k, {
        key: k,
        display: a.display ?? ((a.raw || '').trim() || '-'),
        names: [],
        points: a.points,
        correct: a.correct,
        partial: a.partial,
        max: a.max,
        // "Came true" but scored nothing (only the best wildcard earns points).
        // Purely presentational — sorted up with the hits, ticked, still +0.
        cameTrue: !a.correct && !!C.cameTrue?.[slug]?.includes(k),
      });
    }
    groups.get(k).names.push(a.predictor);
  }
  const rank = (g) => (g.correct || g.cameTrue ? 0 : g.partial ? 1 : 2);
  return [...groups.values()].sort(
    (a, b) => rank(a) - rank(b) || b.points - a.points || b.names.length - a.names.length,
  );
}

const statSpan = (s) => ` <span class="answer-line__stat">(${esc(s)})</span>`;

function answerLine(g, slug) {
  // A came-true wildcard shows as a hit (green ✓) but banked no points.
  const state = g.correct || g.cameTrue ? 'hit' : g.partial ? 'partial' : 'miss';
  const icon = state === 'hit' ? '✓' : state === 'partial' ? `${g.points}/${g.max}` : '✕';
  let val;
  if (slug === 'players-relegated') {
    // Multi-person: annotate each named person with their mini-league finish.
    val = g.display
      .split(',')
      .map((part) => {
        const name = part.trim();
        const lp = leaguePos(name);
        return esc(name) + (lp ? statSpan(lp) : '');
      })
      .join(', ');
  } else {
    const stat = statFor(slug, g.key);
    val = esc(g.display) + (stat ? statSpan(stat) : '');
  }
  // "Came true" wildcards get a full-width note on its own line under the answer.
  const note = g.cameTrue ? `<span class="answer-line__note">came true, no points</span>` : '';
  return `
    <div class="answer-line answer-line--${state}">
      <span class="answer-line__icon ic-${state}">${icon}</span>
      <span class="answer-line__val">${val}</span>
      <span class="answer-line__pts">+${g.points}</span>
      ${note}
      <span class="answer-line__who">${esc(g.names.join(', '))}</span>
    </div>`;
}

function questionCard(q, i) {
  const quip = C.quips[q.slug];
  const shown = groupAnswers(q.answers, q.slug).map((g) => answerLine(g, q.slug)).join('');
  return `
    <div class="card reveal" data-delay="${(i % 3) + 1}">
      <div class="card__q"><span>${esc(q.title)}</span></div>
      ${quip ? `<p style="color:var(--ink-3);font-size:.92rem;margin:-.3rem 0 .9rem">${esc(quip)}</p>` : ''}
      ${shown}
      <div class="card__correct">Correct answer: <b>${esc(q.correctDisplay)}</b></div>
    </div>`;
}

function breakdown() {
  const order = ['Premier League', 'Players', 'Fantasy', 'The League', 'Wildcard'];
  // These live in the Awards section - don't repeat them in the breakdown.
  const awardSlugs = new Set(C.awards.map((a) => a.slug));
  const byGroup = {};
  predictions.questions
    .filter((q) => !awardSlugs.has(q.slug))
    .forEach((q) => (byGroup[q.group] ??= []).push(q));

  let idx = 0;
  const blocks = order
    .filter((g) => byGroup[g] && byGroup[g].length)
    .map((g) => {
      const cards = byGroup[g].map((q) => questionCard(q, idx++)).join('');
      return `
      <div class="reveal" style="margin-top:2.6rem">
        <h3 style="font-size:clamp(1.4rem,3.5vw,2rem)"><span class="accent">${esc(g)}</span></h3>
        <p class="section-lead" style="margin-bottom:.4rem">${esc(C.groups[g]?.blurb ?? '')}</p>
      </div>
      <div class="grid" style="margin-top:1rem">${cards}</div>`;
    })
    .join('');

  return `
  <section class="section section--alt" id="breakdown">
    <div class="container">
      <div class="reveal">
        <div class="eyebrow">Question by Question</div>
        <h2 class="section-title">The <span class="accent">Full Breakdown</span></h2>
        <p class="section-lead">All thirty-one predictions, what actually happened, and who - if anyone - saw it coming.</p>
      </div>
      ${blocks}
    </div>
  </section>`;
}

/* ------------------------------------------------------------- awards */
function awards() {
  const bySlug = Object.fromEntries(predictions.questions.map((q) => [q.slug, q]));
  const cards = C.awards
    .map(
      (a, i) => {
        const q = bySlug[a.slug];
        const picks = q ? groupAnswers(q.answers, q.slug).map((g) => answerLine(g, q.slug)).join('') : '';
        return `
      <div class="award reveal" data-delay="${(i % 3) + 1}">
        <div class="award__crown">${a.crown}</div>
        <div class="award__title">${esc(a.title)}</div>
        <div class="award__winner">${esc(a.winner)} · <span style="color:var(--ink-3);font-weight:500">${esc(a.sub)}</span></div>
        <p class="award__body">${esc(a.body)}</p>
        ${picks ? `<div class="award__picks">${picks}</div>` : ''}
        ${(a.images ?? [])
          .map(
            (img) => `
          <figure class="chat" style="margin:1rem 0 0">
            <img src="${IMAGES[img.src]}" alt="${esc(img.cap)}" loading="lazy" />
            <figcaption class="chat__cap">${esc(img.cap)}</figcaption>
          </figure>`,
          )
          .join('')}
      </div>`;
      },
    )
    .join('');

  return `
  <section class="section" id="awards">
    <div class="container">
      <div class="reveal">
        <div class="eyebrow">The Honours</div>
        <h2 class="section-title">Individual <span class="accent-gold">Awards</span></h2>
        <p class="section-lead">Not every prize is for getting things right. Some are for getting things spectacularly, memorably wrong.</p>
      </div>
      <div class="awards">${cards}</div>
    </div>
  </section>`;
}

/* ---------------------------------------------------------- more data */
const CAT_ORDER = ['Premier League', 'Players', 'Fantasy', 'The League'];
const CAT_SHORT = {
  'Premier League': 'Prem',
  Players: 'Players',
  Fantasy: 'Fantasy',
  'The League': 'Prita',
};
// The single Wildcard question folds into Premier League — it's one free swing,
// not a category of its own, and only Lucas ever scored on it (+3).
const CAT_MERGE = { Wildcard: 'Premier League' };

// Points each predictor banked in each category. Ordered best → worst so it
// lines up with the scoreboard and The Grid.
function pointsByCategory() {
  const ranked = summary.standings.map((s) => s.predictor);
  const totals = Object.fromEntries(
    ranked.map((n) => [n, Object.fromEntries(CAT_ORDER.map((g) => [g, 0]))]),
  );
  predictions.questions.forEach((q) => {
    const g = CAT_MERGE[q.group] ?? q.group;
    q.answers.forEach((a) => {
      totals[a.predictor][g] += a.points ?? 0;
    });
  });
  // Shared scale across every panel and category, so a bar means the same
  // length everywhere.
  const cap = Math.max(
    1,
    ...ranked.flatMap((n) => CAT_ORDER.map((g) => totals[n][g])),
  );

  const panels = summary.standings
    .map((s, i) => {
      const name = s.predictor;
      const rows = CAT_ORDER.map((g) => {
        const v = totals[name][g];
        return `
        <div class="mini__row">
          <span class="mini__cat">${esc(CAT_SHORT[g])}</span>
          <span class="mini__track"><span class="mini__fill${v === 0 ? ' is-zero' : ''}" data-w="${(v / cap) * 100}%"></span></span>
          <span class="mini__val${v === 0 ? ' is-zero' : ''}">${v}</span>
        </div>`;
      }).join('');
      return `
      <div class="mini reveal" data-delay="${(i % 3) + 1}" data-fills>
        <div class="mini__head">
          <span class="mini__name">${medals[s.rank] ?? ''} ${esc(name)}</span>
          <span class="mini__tot">${s.points} pts</span>
        </div>
        <div class="mini__rows">${rows}</div>
      </div>`;
    })
    .join('');

  return `
    <div class="reveal" style="margin-top:2.8rem">
      <h3 class="data-sub">${esc(C.moreData.categories.title)}</h3>
      <p class="section-lead">${esc(C.moreData.categories.lead)}</p>
    </div>
    <div class="multiples">${panels}</div>`;
}

// Scatter: total points (accuracy) vs lone calls (boldness). A lone call is
// a question where this person's answer was unique — nobody else in the room
// gave it — regardless of whether it turned out right.
function accuracyVsBoldness() {
  const lone = Object.fromEntries(predictions.players.map((n) => [n, 0]));
  predictions.questions.forEach((q) => {
    const counts = {};
    const keyOf = (a) => a.key ?? (a.raw || '').trim().toLowerCase();
    q.answers.forEach((a) => {
      const k = keyOf(a);
      if (!k || k === '-') return;
      counts[k] = (counts[k] ?? 0) + 1;
    });
    q.answers.forEach((a) => {
      const k = keyOf(a);
      if (k && k !== '-' && counts[k] === 1) lone[a.predictor] += 1;
    });
  });
  const pts = Object.fromEntries(summary.standings.map((s) => [s.predictor, s.points]));

  // Geometry.
  const W = 760;
  const H = 470;
  const m = { l: 52, r: 26, t: 26, b: 54 };
  const px0 = m.l;
  const px1 = W - m.r;
  const py0 = m.t;
  const py1 = H - m.b;
  const maxLone = Math.max(...Object.values(lone));
  const xDom = [3, Math.max(21, maxLone + 1)];
  const maxPts = Math.max(...Object.values(pts));
  const yDom = [4, Math.max(15, maxPts + 1)];
  const sx = (v) => px0 + ((v - xDom[0]) / (xDom[1] - xDom[0])) * (px1 - px0);
  const sy = (v) => py1 - ((v - yDom[0]) / (yDom[1] - yDom[0])) * (py1 - py0);

  // Labels sit right of the dot, except: Joe (near the right edge) and Tom
  // (whose right label would collide with Dymond, tied with him on points).
  const leftLabel = new Set(['Joe', 'Tom']);

  const xTicks = [5, 10, 15, 20]
    .map((t) => {
      const x = sx(t);
      return `
      <line x1="${x}" y1="${py0}" x2="${x}" y2="${py1}" class="sc-grid" />
      <text x="${x}" y="${py1 + 26}" class="sc-axtxt" text-anchor="middle">${t}</text>`;
    })
    .join('');
  const yTicks = [5, 7, 9, 11, 13]
    .map((t) => {
      const y = sy(t);
      return `
      <line x1="${px0}" y1="${y}" x2="${px1}" y2="${y}" class="sc-grid" />
      <text x="${px0 - 12}" y="${y + 4}" class="sc-axtxt" text-anchor="end">${t}</text>`;
    })
    .join('');

  const dots = summary.standings
    .map((s) => {
      const name = s.predictor;
      const x = sx(lone[name]);
      const y = sy(pts[name]);
      const champ = s.rank === 1;
      const left = leftLabel.has(name);
      const lx = left ? x - 12 : x + 12;
      return `
      <g class="sc-pt${champ ? ' is-champ' : ''}">
        <title>${esc(name)} — ${pts[name]} pts, ${lone[name]} lone call${lone[name] === 1 ? '' : 's'}</title>
        <circle cx="${x}" cy="${y}" r="${champ ? 8 : 6}" />
        <text x="${lx}" y="${y + 4}" class="sc-lbl" text-anchor="${left ? 'end' : 'start'}">${esc(name)}</text>
      </g>`;
    })
    .join('');

  return `
    <div class="reveal" style="margin-top:3.4rem">
      <h3 class="data-sub">${esc(C.moreData.scatter.title)}</h3>
      <p class="section-lead">${esc(C.moreData.scatter.lead)}</p>
    </div>
    <div class="scatter reveal">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Scatter plot of total points (accuracy) against lone calls (boldness), one dot per predictor" preserveAspectRatio="xMidYMid meet">
        ${yTicks}${xTicks}
        <text x="${(px0 + px1) / 2}" y="${H - 8}" class="sc-axttl" text-anchor="middle">Lone calls — boldness  →</text>
        <text transform="translate(14 ${(py0 + py1) / 2}) rotate(-90)" class="sc-axttl" text-anchor="middle">Total points — accuracy  →</text>
        ${dots}
      </svg>
    </div>`;
}

// Every question ranked by the share of its points the room actually banked -
// points awarded ÷ points available. Using points (not a hit count) means
// partial-credit questions like Top 4 read as "hard but not a whitewash"
// rather than a misleading zero.
function questionDifficulty() {
  const stats = predictions.questions.map((q) => {
    const got = q.answers.reduce((s, a) => s + (a.points ?? 0), 0);
    const avail = q.answers.reduce((s, a) => s + (a.max ?? 0), 0);
    return { title: q.title, got, avail, pct: avail ? got / avail : 0 };
  });
  stats.sort((a, b) => b.pct - a.pct || a.title.localeCompare(b.title));

  const rows = stats
    .map(
      (s) => `
      <div class="qr">
        <span class="qr__title" title="${esc(s.title)}">${esc(s.title)}</span>
        <span class="qr__track"><span class="qr__fill${s.got === 0 ? ' is-zero' : ''}" data-w="${s.pct * 100}%"></span></span>
        <span class="qr__n${s.got === 0 ? ' is-zero' : ''}">${Math.round(s.pct * 100)}%<small>${s.got}/${s.avail} pts</small></span>
      </div>`,
    )
    .join('');

  return `
    <div class="reveal" style="margin-top:3.4rem">
      <h3 class="data-sub">${esc(C.moreData.questions.title)}</h3>
      <p class="section-lead">${esc(C.moreData.questions.lead)}</p>
    </div>
    <div class="qrank reveal" data-fills>${rows}</div>`;
}

function moreData() {
  return `
  <section class="section" id="data">
    <div class="container">
      <div class="reveal">
        <div class="eyebrow">${esc(C.moreData.eyebrow)}</div>
        <h2 class="section-title">${esc(C.moreData.title)}</h2>
        <p class="section-lead">${esc(C.moreData.lead)}</p>
      </div>
      ${pointsByCategory()}
      ${accuracyVsBoldness()}
      ${questionDifficulty()}
    </div>
  </section>`;
}

/* ---------------------------------------------------------- narrative */
function narrative() {
  const paras = C.narrative.paragraphs
    .map((p, i) => `<p class="${i === 0 ? 'drop' : ''}">${esc(p)}</p>`)
    .join('');
  return `
  <section class="section section--alt" id="story">
    <div class="container container--narrow">
      <div class="reveal">
        <div class="eyebrow">${esc(C.narrative.eyebrow)}</div>
        <h2 class="section-title">${esc(C.narrative.title)}</h2>
      </div>
      <div class="prose reveal">${paras}</div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------- footer */
function footer() {
  return `
  <footer class="footer">
    <p><strong>${esc(C.footer.line1)}</strong></p>
    <p>${esc(C.footer.line2)}</p>
    <p style="margin-top:1.2rem;opacity:.6">Champion: <strong>${esc(summary.winner)}</strong> · ${summary.winnerPoints} points</p>
  </footer>`;
}

/* --------------------------------------------------------------- nav */
function nav() {
  const items = [
    ['top', 'Top'],
    ['breakdown', 'Breakdown'],
    ['awards', 'Awards'],
    ['table', 'The Table'],
    ['grid', 'The Grid'],
    ['story', 'The Story'],
    ['data', 'More Data'],
  ];
  return `<nav class="nav">${items
    .map(([id, label]) => `<a href="#${id}" data-label="${label}"></a>`)
    .join('')}</nav>`;
}

/* --------------------------------------------------------------- boot */
function render() {
  document.querySelector('#app').innerHTML = [
    '<div class="progress"></div>',
    nav(),
    hero(),
    intro(),
    breakdown(),
    awards(),
    scoreboard(),
    resultsGrid(),
    narrative(),
    moreData(),
    footer(),
  ].join('');

  // Wait for one painted frame before wiring the observers up. A transition only
  // runs if its start style was actually rendered, and IntersectionObserver
  // reports anything already on screen on its first callback — so setting these
  // up in the same task as the innerHTML above meant the blocks in the opening
  // viewport were flipped to .is-visible before the browser had ever painted
  // their opacity:0 state, and they appeared with no animation at all.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setupReveal();
      setupCountUps();
      setupBars();
      setupFills();
      setupGridReveal();
      setupProgress();
      setupScrollspy();
      setupMatrixTooltip();
    });
  });
}

render();
