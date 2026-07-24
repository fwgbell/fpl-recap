# FPL Recap — TODO / ideas

Live site: https://fwgbell.github.io/fpl-recap/ · auto-deploys on push to `main`.

Status: the 2025/26 predictions recap is **built, deployed, and live**. This file
tracks remaining polish and future ideas. Nothing here is blocking.

---

## ✅ Done
- Vite + vanilla-JS single-page site, FPL/Premier League theme, self-hosted fonts.
- Scoring engine (`scripts/ingest.js` + `data/answer-key.json`) → `src/data/*.json`.
- Sections: hero, animated scoreboard, The Grid heatmap, full question breakdown,
  awards (with Klopp screenshots), long-form narrative in Fred's voice.
- Animations (count-ups, bar fills, scroll reveals), scrollspy, progress bar.
- Responsive (mobile + desktop), `prefers-reduced-motion` respected.
- GitHub Pages deploy via Actions.
- Privacy: entire `data/` folder git-ignored (raw CSV has emails); only
  derived, email-free JSON committed under `src/data/`.
- Copy review — read every line in `src/content.js` for Fred's voice.
- Leaderboard sanity check — computed table (Lucas 14; Eoin / Fred / Oscar
  tied on 13) confirmed against the manual tally.
- De-dupe awards vs breakdown — reviewed; Klopp / Iheanacho / +3 kept in both
  the breakdown and Awards (intentional, Awards cross-references the breakdown).
- Hero orbs overflow — `overflow: clip` on `.hero__orbs` so the negatively
  offset orbs add no horizontal scroll width.
- Social share image — `public/og-image.png` (1200×630) + Open Graph & Twitter
  meta tags in `index.html`; links now unfurl in the group chat.
- Favicon — `public/favicon.svg`, an FPL-purple tile with a green→cyan tick.

---

## 🔜 Near-term polish
_(All near-term polish done — see ✅ above.)_

## 📊 More visualisations (optional)
All three below now live in a **More Data** section at the bottom of the page
(after The Story), rendered by `moreData()` in `src/main.js`.
- [x] **Points-by-category** per player (small multiples, single hue — avoids the
      5-way categorical palette that failed validation).
- [x] **Accuracy vs boldness** scatter (how many lone-correct calls each person made).
- [x] **"Hardest / easiest questions"** — rank questions by how many got them right.
- [x] Animate The Grid cells filling in on scroll (staggered) — diagonal wave
      via `setupGridReveal()` in `src/lib/ui.js`; motion-only, reduced-motion safe.


- [x] Hardest & easiest questions now ranked by **% of points banked** (awarded ÷
      available) instead of a hit count, so partial-credit questions like Top 4
      read ~52% rather than a misleading 0. (`questionDifficulty()` in `main.js`.)
- [ ] **Biggest flop / success appearance + goal data** — table scaffolded in
      `src/data/achieved.js` (`SIGNING_STATS`, all picks keyed, values `null`).
      Fill in `apps`/`goals` by hand; each pick shows its stat once both are set.
- [x] Fade-in stutter on iOS Safari — reveals promoted to their own compositor
      layer (`translate3d` + `will-change`); hero orbs de-blurred and their float
      stopped under 680px so off-screen orbs stop thrashing the mobile compositor.
- [x] Over-long answers (crazy-prediction sentences) now flow inline with the
      tick and points and wrap in place (`.answer-line__val` is `flex:1` with
      `overflow-wrap:anywhere`).
- [x] Crazy-predictions: the two United calls that came true are ticked (green ✓)
      and sorted to the top, below Lucas's +3, with a "came true, no points" note
      on its own line under the answer. Presentational only — `cameTrue` override
      in `content.js`, scoring untouched.

## 🏆 Stretch goal — live FPL mini-league report
Parked. When ready:
- [ ] Get the classic-league ID.
- [ ] `scripts/fetch-fpl.js` → pull `bootstrap-static`,
      `leagues-classic/{id}/standings`, per-manager history from the public FPL
      API → `src/data/league.json` (no auth needed).
- [ ] New section: final table, biggest riser/faller, best gameweek, captaincy,
      chip usage, transfers, luck vs skill.
- [ ] Standings-over-time line chart.

## 🔁 Yearly refresh (how to run it again next season)
- [ ] Export the new season's Google Form responses to `data/*.csv` (stays local).
- [ ] Update `data/answer-key.json` with the new questions + correct answers.
- [ ] `npm run ingest` → regenerates `src/data/predictions.json` + `summary.json`.
- [ ] Refresh `src/content.js` copy for the new season.
- [ ] Commit + push → auto-deploys.

## 🧹 Housekeeping
- [ ] Add ESLint + Prettier config (referenced in the plan, not yet added).
- [ ] Consider a custom domain (optional) — Vite `base` is relative so it'll just work.
- [ ] Lighthouse pass (perf/a11y) once content is final.
