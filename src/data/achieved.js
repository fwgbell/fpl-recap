/**
 * Real-world stats each *submitted* answer actually achieved, shown as a small
 * low-hierarchy note next to the pick (e.g. "West Ham (18th)", "Salah (7 goals)").
 *
 * Source of truth: data/achieved-stats.md (filled in by hand). Keyed by the
 * canonical `key` that ingest assigns each answer, so these survive re-ingest
 * without touching the generated predictions.json.
 *
 * To add/adjust: edit the relevant map below. To extend to more questions,
 * add the slug to one of the SLUG_* sets and provide the numbers.
 */

// Canonical team id -> final league position (2025/26).
const FINAL_POS = {
  arsenal: 1, mancity: 2, manutd: 3, villa: 4, liverpool: 5, bournemouth: 6,
  sunderland: 7, brighton: 8, brentford: 9, chelsea: 10, fulham: 11,
  newcastle: 12, everton: 13, leeds: 14, palace: 15, forest: 16, spurs: 17,
  westham: 18, burnley: 19, wolves: 20,
};

// Canonical player id -> total FPL points.
const FPL_POINTS = {
  haaland: 239, brunof: 235, gabriel: 209, wirtz: 125, welbeck: 126, salah: 123,
  palmer: 114, saka: 157, isak: 41, sesko: 111, joaopedro: 177, munoz: 136,
  kerkez: 85, gvardiol: 79, maguire: 90, cucurella: 104, pedroporro: 117,
  milenkovic: 119, aitnouri: 60, yoro: 56, grealish: 79, ndiaye: 128, reijnders: 92,
};

// Golden Boot: canonical player id -> PL goals.
const GOALS = { haaland: 27, salah: 7, sesko: 11, joaopedro: 15 };

// Golden Glove: canonical player id -> PL clean sheets. (Maguire, a defender, omitted.)
const CLEAN_SHEETS = { raya: 19, sanchez: 9, sels: 7, alisson: 8 };

// Transfer questions (biggest flop / biggest success): PL starts + G+A
// (goals + assists). Fill in by hand. A pick shows its stat only once BOTH
// numbers are set (leave as null to hide). Keys are every player submitted
// across both questions.
const SIGNING_STATS = {
  gyokeres: { starts: 26, ga: 15 },
  mbeumo: { starts: 31, ga: 14 },
  kudus: { starts: 19, ga: 8 },
  sesko: { starts: 17, ga: 13 },
  madueke: { starts: 16, ga: 4 },
  ekitike: { starts: 21, ga: 15 },
  wirtz: { starts: 27, ga: 9 },
  joaopedro: { starts: 31, ga: 24 },
  isak: { starts: 8, ga: 4 },
  reijnders: { starts: 19, ga: 8 },
};

// Top at Christmas: canonical team id -> league position on ~25 Dec 2025
// (distinct from the final table).
const XMAS_POS = { arsenal: 1, mancity: 2, liverpool: 4, chelsea: 5, manutd: 6 };

// Mini-league final standings: person -> final position in their division.
// Prita (top) and Segunda (second) each run 1-6; names are unique across both.
const PERSON_POS = {
  // Prita
  Ben: 1, Harry: 2, Fred: 3, Oscar: 4, Dymond: 5, Tom: 6,
  // Segunda
  Joe: 1, Eoin: 2, Toby: 3, Lucas: 4, Spink: 5, Mark: 6,
};

// Which questions get which stat.
const SLUG_POS = new Set(['title-winner', 'dark-horse-high', 'surprisingly-low', 'tenth']);
const SLUG_FPL = new Set([
  'most-fpl-points', 'best-first-pick', 'worst-first-pick',
  'highest-forward', 'highest-mid', 'highest-defender', 'dark-horse-player',
]);
// Single-person mini-league questions (the pick is one person).
const SLUG_PERSON = new Set(['prita-winner', 'segunda-winner', 'segunda-promoted', 'segunda-last']);
// Transfer questions annotated with appearances + goals.
const SLUG_SIGNING = new Set(['biggest-flop', 'biggest-success']);

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/**
 * The stat string for a submitted answer, or null if none applies.
 * @param {string} slug  question slug
 * @param {string} key   canonical answer key from ingest
 */
export function statFor(slug, key) {
  if (!slug || !key) return null;
  if (SLUG_POS.has(slug)) {
    const p = FINAL_POS[key];
    return p ? ordinal(p) : null;
  }
  if (slug === 'top-xmas') {
    const p = XMAS_POS[key];
    return p ? ordinal(p) + " at xmas" : null;
  }
  if (SLUG_FPL.has(slug)) {
    const p = FPL_POINTS[key];
    return p == null ? null : `${p} pts`;
  }
  if (slug === 'golden-boot') {
    const g = GOALS[key];
    return g == null ? null : `${g} goals`;
  }
  if (slug === 'golden-glove') {
    const c = CLEAN_SHEETS[key];
    return c == null ? null : `${c} clean sheets`;
  }
  if (SLUG_PERSON.has(slug)) {
    const p = PERSON_POS[key];
    return p ? ordinal(p) : null;
  }
  if (SLUG_SIGNING.has(slug)) {
    const s = SIGNING_STATS[key];
    if (!s || s.starts == null || s.ga == null) return null;
    return `${s.starts} starts · ${s.ga} G+A`;
  }
  return null;
}

/** A person's mini-league finishing position (ordinal), or null. Used to
 *  annotate each name in the multi-person `players-relegated` answer. */
export function leaguePos(name) {
  const p = PERSON_POS[(name || '').trim()];
  return p ? ordinal(p) : null;
}
