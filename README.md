# FPL Recap

A single-page, statically-hosted site that recaps our fantasy football season and **scores the
predictions we made a year ago** against what actually happened. Built with Vite + vanilla JS,
themed after the Premier League / FPL identity, and deployed to GitHub Pages.

## How it works

GitHub Pages is static, and the source data (a private Google Sheet + a tone-of-voice Google Doc)
can't be read from the browser at runtime. So the pipeline bakes data into the repo at authoring
time:

```
Google Sheet  ──(Google MCP)──►  data/predictions.raw.json
                                        │  npm run ingest
                                        ▼
                          data/predictions.json + data/summary.json
                                        │  vite build
                                        ▼
                                     dist/  ──►  GitHub Pages
```

Refresh each season by re-running the ingest step and redeploying.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Static production build → `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run ingest` | Transform raw Sheet rows → `data/predictions.json` + `summary.json` |
| `npm run fetch:fpl` | (Stretch) Pull mini-league data from the public FPL API |

## Project layout

```
index.html          # App shell
src/                # main.js, style.css, content, charts
src/data/           # Derived, email-free JSON the site imports (predictions, summary)
src/assets/         # Award screenshots used on the page
scripts/            # ingest.js, fetch-fpl.js
data/               # RAW source (CSV with emails, write-up, answer key) — git-ignored, local only
public/             # Static assets copied as-is
```

### Privacy

The raw Google Form export contains **email addresses**, so the entire `data/`
folder is git-ignored and never leaves your machine. `npm run ingest` reads it
locally and writes only the derived, email-free JSON to `src/data/`, which is
what gets committed and published.

## Data setup (one-time)

The predictions data comes from a Google Sheet and the writing voice from a Google Doc, both read
via a **Google Drive MCP server** during authoring. See the build plan for the Google Cloud OAuth
setup steps. Never commit credentials — `.gitignore` already excludes them and the private voice
reference (`data/voice-reference.md`).
