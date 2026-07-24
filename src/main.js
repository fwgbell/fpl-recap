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
import lucasImg from './assets/lucas-excuses.jpeg';
import tobyImg from './assets/toby-blocking-trades.jpeg';
import {
  setupReveal,
  setupCountUps,
  setupBars,
  setupProgress,
  setupScrollspy,
  setupMatrixTooltip,
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
    .map((name) => {
      const cells = qs
        .map((q, qi) => {
          const a = byName[name][qi];
          const state = a?.correct ? 'hit' : a?.partial ? 'partial' : 'miss';
          return `<div class="cell cell--${state}" data-q="${esc(q.title)}" data-who="${esc(name)}" data-pick="${esc(a?.display ?? a?.raw ?? '')}" data-pts="${a?.points ?? 0}" data-state="${state}"></div>`;
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
function groupAnswers(answers) {
  const groups = new Map();
  for (const a of answers) {
    const k = a.key ?? (a.raw || '-').trim().toLowerCase();
    if (!groups.has(k)) {
      groups.set(k, {
        display: a.display ?? ((a.raw || '').trim() || '-'),
        names: [],
        points: a.points,
        correct: a.correct,
        partial: a.partial,
        max: a.max,
      });
    }
    groups.get(k).names.push(a.predictor);
  }
  const rank = (g) => (g.correct ? 0 : g.partial ? 1 : 2);
  return [...groups.values()].sort(
    (a, b) => rank(a) - rank(b) || b.points - a.points || b.names.length - a.names.length,
  );
}

function answerLine(g) {
  const state = g.correct ? 'hit' : g.partial ? 'partial' : 'miss';
  const icon = state === 'hit' ? '✓' : state === 'partial' ? `${g.points}/${g.max}` : '✕';
  return `
    <div class="answer-line answer-line--${state}">
      <span class="answer-line__icon ic-${state}">${icon}</span>
      <span class="answer-line__val">${esc(g.display)}</span>
      <span class="answer-line__pts">+${g.points}</span>
      <span class="answer-line__who">${esc(g.names.join(', '))}</span>
    </div>`;
}

function questionCard(q, i) {
  const quip = C.quips[q.slug];
  const shown = groupAnswers(q.answers).map(answerLine).join('');
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
        const picks = q ? groupAnswers(q.answers).map(answerLine).join('') : '';
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
    footer(),
  ].join('');

  setupReveal();
  setupCountUps();
  setupBars();
  setupProgress();
  setupScrollspy();
  setupMatrixTooltip();
}

render();
