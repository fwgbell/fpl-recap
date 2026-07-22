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

---

## 🔜 Near-term polish
- [ ] **Copy review** — read every line in `src/content.js` and tweak anything
      that doesn't sound like Fred. (You're the voice.)
- [ ] **Leaderboard sanity check** — confirm the computed table (Lucas 14; Eoin /
      Fred / Oscar tied on 13) matches your own tally. Edit `data/answer-key.json`
      and re-run `npm run ingest` if any ruling should change.
- [ ] **De-dupe awards vs breakdown** — Klopp / Iheanacho / +3 appear both in the
      breakdown and the Awards section. Fine as-is, but could hide them from the
      breakdown so Awards is the sole home.
- [ ] **Hero orbs overflow** — the blurred background orbs report a few px of
      horizontal overflow (clipped, harmless). Constrain if it ever bothers you.
- [ ] **Social share image** — add an Open Graph `og:image` + meta tags so the
      link unfurls nicely when shared in the group chat.
- [ ] **Favicon** — currently none; add an FPL-style favicon.

## 📊 More visualisations (optional)
- [ ] **Points-by-category** per player (small multiples, single hue — avoids the
      5-way categorical palette that failed validation).
- [ ] **Accuracy vs boldness** scatter (how many lone-correct calls each person made).
- [ ] **"Hardest / easiest questions"** — rank questions by how many got them right.
- [ ] Animate The Grid cells filling in on scroll (staggered).

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
