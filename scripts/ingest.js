/**
 * Ingest + scoring engine.
 *
 * Reads the Google-Form CSV export and `data/answer-key.json`, scores every
 * prediction, and writes the site's static data:
 *   - src/data/predictions.json  (per-question, per-player, with computed points)
 *   - src/data/summary.json      (standings + highlights)
 *
 * Inputs live in data/ (git-ignored: the raw CSV contains emails). Outputs are
 * the derived, email-free JSON the site imports, committed under src/data/.
 *
 * Scoring (confirmed with the group, mirrors the 2024/25 tradition):
 *   - single answers: 1 pt if correct
 *   - multi / order:  1 pt per correct item / correct position
 *   - numeric:        exact match only
 *   - crazy:          +3 to the nominated winner
 *
 * Run with: npm run ingest
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CSV_FILE = 'Prem predictions 2025_26 (Responses) - Form responses 1.csv';

/* ----------------------------------------------------------------
   CSV parsing (RFC-4180-ish: quoted fields, embedded commas/newlines)
   ---------------------------------------------------------------- */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\r') {
      /* skip */
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/* ----------------------------------------------------------------
   Normalisation: map spelling variants / short names to canonical ids
   ---------------------------------------------------------------- */
const norm = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// Canonical id -> list of aliases (all matched via normalised form)
const TEAM_ALIASES = {
  arsenal: ['arsenal', 'ars'],
  mancity: ['manchester city', 'man city', 'mcity', 'mcit', 'city'],
  manutd: ['manchester united', 'man united', 'man utd', 'man u', 'united', 'utd'],
  chelsea: ['chelsea', 'chels', 'chel', 'che', 'cheslea'],
  liverpool: ['liverpool', 'liv'],
  villa: ['aston villa', 'villa'],
  spurs: ['tottenham hotspur', 'tottenham', 'spurs'],
  newcastle: ['newcastle'],
  westham: ['west ham', 'westham'],
  brighton: ['brighton'],
  brentford: ['brentford'],
  bournemouth: ['bournemouth'],
  everton: ['everton'],
  fulham: ['fulham'],
  palace: ['crystal palace', 'palace'],
  forest: ['nottingham forest', 'nottm forest', 'forest'],
  wolves: ['wolves', 'wolverhampton'],
  burnley: ['burnley'],
  leeds: ['leeds'],
  sunderland: ['sunderland'],
  leicester: ['leicester city', 'leicester'],
  ipswich: ['ipswich'],
  southampton: ['southampton'],
};

const PLAYER_ALIASES = {
  haaland: ['erling haaland', 'haaland', 'halland'],
  salah: ['mohamed salah', 'mo salah', 'salah'],
  wirtz: ['florian wirtz', 'wirtz', 'writz', 'wrtiz'],
  brunof: ['bruno fernandes', 'bruno f', 'bruno'],
  joaopedro: ['joao pedro', 'pedro'],
  raya: ['david raya', 'raya'],
  sanchez: ['sanchez'],
  alisson: ['alisson', 'alison'],
  ederson: ['ederson'],
  onana: ['onana'],
  sels: ['sels'],
  madueke: ['madueke'],
  gabriel: ['gabriel'],
  welbeck: ['welbeck', 'wellbeck'],
  gvardiol: ['gvardiol', 'gvadiol'],
  isak: ['alexander isak', 'aleksander isak', 'isak'],
  sesko: ['benjamin sesko', 'sesko'],
  ekitike: ['ekitike'],
  gyokeres: ['gyokeres', 'gyokores', 'gyokoros'],
  kudus: ['kudus'],
  mbeumo: ['mbeumo', 'mbuemo'],
  reijnders: ['reijnders'],
  palmer: ['cole palmer', 'palmer'],
  saka: ['saka'],
  son: ['son'],
  watkins: ['watkins'],
  maguire: ['maguire'],
  benwhite: ['ben white'],
  gusto: ['gusto'],
  taa: ['taa', 'trent', 'alexander arnold'],
  cucurella: ['cucurella', 'cucerella'],
  munoz: ['munoz'],
  kerkez: ['kerkez'],
  pedroporro: ['pedro porro', 'porro'],
  aitnouri: ['ait nouri', 'aitnouri'],
  milenkovic: ['milenkovic'],
  ndiaye: ['ndiaye'],
  grealish: ['grealish'],
  yoro: ['yoro'],
  szoboszlai: ['szoboszlai', 'szobo'],
  // managers
  nuno: ['nuno espirito santo', 'nuno'],
  pereira: ['vito pereira', 'pereira'],
  farke: ['daniel farke', 'farke'],
  potter: ['graham potter', 'potter'],
  iraola: ['iraola'],
  lebris: ['le bris', 'lebris'],
  slot: ['slot'],
};

// League members (people)
const PERSON_ALIASES = {
  Dymond: ['hugo dymond', 'dymond'],
  Spink: ['hugo spink', 'spink'],
  Harry: ['harry stow', 'harry'],
  Joe: ['joe aylward', 'joe'],
  Tom: ['tom pugh', 'pugh', 'tom'],
  Mark: ['mark'],
  Toby: ['toby hanscomb', 'toby'],
  Oscar: ['oscar'],
  Eoin: ['eoin kelly', 'eoin'],
  Fred: ['fred'],
  Lucas: ['lucas fabbri', 'fabbri', 'lucas'],
  Ben: ['ben'],
};

function buildLookup(aliasMap) {
  const map = new Map();
  for (const [id, aliases] of Object.entries(aliasMap)) {
    for (const a of aliases) map.set(norm(a), id);
  }
  return map;
}
const TEAM_LOOKUP = buildLookup(TEAM_ALIASES);
const PLAYER_LOOKUP = buildLookup(PLAYER_ALIASES);
const PERSON_LOOKUP = buildLookup(PERSON_ALIASES);

const canonName = (raw) => {
  const n = norm(raw);
  return PERSON_LOOKUP.get(n) || null;
};

// Resolve a single free-text answer to a canonical id for the given domain.
function resolve(text, domain) {
  const n = norm(text);
  const lookup =
    domain === 'team' ? TEAM_LOOKUP : domain === 'player' ? PLAYER_LOOKUP : PERSON_LOOKUP;
  if (lookup.has(n)) return lookup.get(n);
  // try token containment for messier answers (e.g. "Tempted to just put Chelsea...")
  for (const [alias, id] of lookup) {
    if (alias.length >= 3 && n.includes(alias)) return id;
  }
  return `?${n}`; // unknown -> unique-ish token so it never accidentally matches
}

// Split a multi-answer cell into parts.
function splitMulti(text) {
  return (text || '')
    .split(/[,\n/]| and /i)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Greedy left-to-right tokeniser for order answers (handles "LivCheMCitArs").
function tokeniseTeams(text) {
  const aliasesByLen = [...TEAM_LOOKUP.keys()].sort((a, b) => b.length - a.length);
  const compact = norm(text);
  const out = [];
  let i = 0;
  while (i < compact.length) {
    if (compact[i] === ' ') {
      i++;
      continue;
    }
    let matched = null;
    for (const alias of aliasesByLen) {
      if (compact.startsWith(alias, i)) {
        matched = alias;
        break;
      }
    }
    if (matched) {
      out.push(TEAM_LOOKUP.get(matched));
      i += matched.length;
    } else i++;
  }
  return out;
}

const domainFor = (type) =>
  type.endsWith('-team') ? 'team' : type.endsWith('-player') || type.endsWith('-manager') ? 'player' : 'person';

/* ----------------------------------------------------------------
   Display labels: a clean, canonical name per answer so the site can
   group name variants ("Erling Haaland" == "Haaland") and render tidy
   one-row order answers. Falls back to the raw text when unresolved.
   ---------------------------------------------------------------- */
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

// canonical id -> nice display name (fallback = capitalised id)
const NAME = {
  manutd: 'Man U',
  mancity: 'Man City',
  westham: 'West Ham',
  forest: 'Forest',
  palace: 'Palace',
  spurs: 'Spurs',
  leicester: 'Leicester',
  southampton: 'Southampton',
  brunof: 'Bruno F',
  joaopedro: 'Joao Pedro',
  pedroporro: 'Pedro Porro',
  aitnouri: 'Ait Nouri',
  benwhite: 'Ben White',
  taa: 'Alexander-Arnold',
  lebris: 'Le Bris',
  nuno: 'Nuno',
};
// canonical team id -> short code for order answers (fallback = nice name)
const ABBR = {
  arsenal: 'Ars',
  mancity: 'City',
  manutd: 'Man U',
  chelsea: 'Che',
  liverpool: 'Liv',
  villa: 'Villa',
  spurs: 'Spurs',
  newcastle: 'New',
  westham: 'West Ham',
};

const niceName = (id) => (!id || id.startsWith('?') ? null : NAME[id] ?? cap(id));
const abbr = (id) => (!id || id.startsWith('?') ? null : ABBR[id] ?? niceName(id));

// Returns { key, display } for grouping + rendering a single answer.
function displayAnswer(q, raw) {
  const type = q.type;
  const domain = domainFor(type);
  const trimmed = (raw || '').trim();
  if (!trimmed) return { key: '—', display: '—' };

  if (type === 'crazy') return { key: trimmed.toLowerCase(), display: trimmed };

  if (type === 'numeric') {
    const n = String(raw).match(/\d+/)?.[0];
    return n ? { key: n, display: n } : { key: trimmed.toLowerCase(), display: trimmed };
  }

  if (type.startsWith('single')) {
    const id = resolve(trimmed, domain);
    return { key: id, display: niceName(id) ?? trimmed };
  }

  if (type.startsWith('multi')) {
    const parts = splitMulti(trimmed);
    const ids = parts.map((p) => resolve(p, domain));
    const names = parts.map((p, i) => niceName(ids[i]) ?? p.trim());
    return { key: [...ids].sort().join('|'), display: names.join(', ') };
  }

  if (type.startsWith('order')) {
    const ids = tokeniseTeams(trimmed);
    if (!ids.length) return { key: trimmed.toLowerCase(), display: trimmed };
    return { key: ids.join('>'), display: ids.map((id) => abbr(id) ?? id).join(' · ') };
  }

  return { key: trimmed.toLowerCase(), display: trimmed };
}

/* ----------------------------------------------------------------
   Scoring
   ---------------------------------------------------------------- */
function scoreAnswer(q, rawAnswer, canonPlayer, crazyBonus) {
  const type = q.type;
  const domain = domainFor(type);

  if (type === 'crazy') {
    const win = q.winner && canonName(q.winner) === canonPlayer;
    return { points: win ? crazyBonus : 0, correct: win, max: crazyBonus };
  }

  if (type === 'numeric') {
    const guess = parseInt(String(rawAnswer).match(/\d+/)?.[0] ?? '', 10);
    const correct = Number(q.correct);
    const hit = Number.isFinite(guess) && guess === correct;
    return { points: hit ? 1 : 0, correct: hit, max: 1 };
  }

  if (type.startsWith('single')) {
    const want = resolve(q.correct[0], domain);
    const got = resolve(rawAnswer, domain);
    const hit = got === want;
    return { points: hit ? 1 : 0, correct: hit, max: 1 };
  }

  if (type.startsWith('multi')) {
    const want = new Set(q.correct.map((c) => resolve(c, domain)));
    const picks = splitMulti(rawAnswer).map((p) => resolve(p, domain));
    let pts = 0;
    const used = new Set();
    for (const p of picks) {
      if (want.has(p) && !used.has(p)) {
        pts++;
        used.add(p);
      }
    }
    return { points: pts, correct: pts === want.size, partial: pts > 0, max: want.size };
  }

  if (type.startsWith('order')) {
    const want = q.correct.map((c) => resolve(c, domain));
    const got = tokeniseTeams(rawAnswer);
    let pts = 0;
    for (let i = 0; i < want.length; i++) if (got[i] && got[i] === want[i]) pts++;
    return { points: pts, correct: pts === want.length, partial: pts > 0, max: want.length };
  }

  throw new Error(`Unknown question type: ${type}`);
}

/* ----------------------------------------------------------------
   Main
   ---------------------------------------------------------------- */
async function main() {
  const csv = parseCSV(await readFile(join(root, 'data', CSV_FILE), 'utf8'));
  const key = JSON.parse(await readFile(join(root, 'data', 'answer-key.json'), 'utf8'));

  // Rows 1..N are players, until the "Correct answer" row.
  const correctIdx = csv.findIndex((r) => norm(r[2]) === 'correct answer');
  const playerRows = csv.slice(1, correctIdx);
  const correctRow = csv[correctIdx];

  const players = playerRows.map((r) => canonName(r[2]) || r[2].trim());

  const questions = key.questions.map((q) => {
    const answers = playerRows.map((row, i) => {
      const raw = (row[q.col] || '').trim();
      const res = scoreAnswer(q, raw, players[i], key.crazyBonus);
      const { key: gkey, display } = displayAnswer(q, raw);
      return { predictor: players[i], raw, display, key: gkey, ...res };
    });
    const maxPoints = Math.max(...answers.map((a) => a.max), 0);
    return {
      slug: q.slug,
      title: q.title,
      group: q.group,
      type: q.type,
      correctText: (correctRow[q.col] || '').trim(),
      correctDisplay: q.type === 'crazy' ? q.winner : Array.isArray(q.correct) ? q.correct.join(', ') : String(q.correct ?? ''),
      note: q.note ?? '',
      maxPoints,
      answers,
    };
  });

  // Standings
  const totals = {};
  for (const name of players) totals[name] = { predictor: name, points: 0, hits: 0, partials: 0, questions: 0 };
  for (const q of questions) {
    for (const a of q.answers) {
      const t = totals[a.predictor];
      t.points += a.points;
      t.questions += 1;
      if (a.correct) t.hits += 1;
      else if (a.partial) t.partials += 1;
    }
  }
  const standings = Object.values(totals).sort(
    (a, b) => b.points - a.points || b.hits - a.hits || a.predictor.localeCompare(b.predictor),
  );
  let rank = 0;
  let prevPts = null;
  standings.forEach((s, i) => {
    if (s.points !== prevPts) {
      rank = i + 1;
      prevPts = s.points;
    }
    s.rank = rank;
  });

  const predictions = {
    season: key.season,
    priorSeason: key.priorSeason,
    players,
    questions,
  };

  // Highlights for the site
  const perfectQuestions = questions
    .flatMap((q) => q.answers.filter((a) => a.correct && a.max >= 2).map((a) => ({ ...a, q: q.title })))
    .sort((a, b) => b.max - a.max);
  const contrarianHits = questions
    .filter((q) => q.answers.filter((a) => a.correct).length === 1)
    .map((q) => {
      const a = q.answers.find((x) => x.correct);
      return { q: q.title, predictor: a.predictor, raw: a.raw };
    });

  const summary = {
    season: key.season,
    priorSeason: key.priorSeason,
    winner: standings[0].predictor,
    winnerPoints: standings[0].points,
    totalPointsAvailable: questions.reduce((s, q) => s + q.maxPoints, 0),
    standings,
    highlights: {
      loneCorrectCalls: contrarianHits,
      bigMultiHits: perfectQuestions.slice(0, 6),
    },
  };

  await writeFile(join(root, 'src', 'data', 'predictions.json'), JSON.stringify(predictions, null, 2));
  await writeFile(join(root, 'src', 'data', 'summary.json'), JSON.stringify(summary, null, 2));

  // Console report
  console.log(`\nScored ${questions.length} questions for ${players.length} players.\n`);
  console.log('FINAL STANDINGS');
  console.log('───────────────');
  for (const s of standings) {
    console.log(
      `${String(s.rank).padStart(2)}. ${s.predictor.padEnd(8)} ${String(s.points).padStart(3)} pts   (${s.hits} correct, ${s.partials} partial)`,
    );
  }
  console.log(`\nTotal points available: ${summary.totalPointsAvailable}`);

  // Flag any unresolved answers so we can spot normalisation gaps
  const unresolved = new Set();
  for (const q of questions)
    for (const a of q.answers) {
      if (!['numeric', 'crazy'].includes(q.type) && a.points === 0) {
        const domain = domainFor(q.type);
        if (a.raw && resolve(a.raw, domain).startsWith('?') && q.type.startsWith('single'))
          unresolved.add(`${q.slug}: "${a.raw}"`);
      }
    }
  if (unresolved.size) {
    console.log('\n(unmatched single answers — expected for genuinely wrong guesses)');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
