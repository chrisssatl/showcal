# TV Show Calendar — Project Structure

**Purpose:** Map of the project’s folders and key files. **Update this doc whenever we add or remove important files or directories.**  
**Updated:** February 2, 2025  

---

## Current structure

```
tv-show-calendar/
├── .gitignore              # Ignore node_modules, dist, .env, .DS_Store, etc.
├── docs/
│   ├── BRAINSTORM.md       # Ideas, Q&A, one-liner
│   ├── SCOPE.md            # Technologies, APIs, connections
│   ├── DESIGN.md           # Colors, layout, UI
│   ├── FUTURE_PLANNING.md  # Backlog, ideas for later
│   ├── GITHUB_SETUP.md     # How to connect this project to a GitHub repo
│   └── PROJECT_STRUCTURE.md # This file
├── index.html              # Entry HTML (Vite)
├── package.json            # Dependencies + scripts (React, Vite)
├── vite.config.js          # Vite config (React plugin)
├── src/
│   ├── main.jsx            # React entry
│   ├── App.jsx             # Main app: My Shows, Add show, Subscribe block
│   ├── App.css             # Component styles
│   └── index.css           # Global styles + design tokens
├── api/
│   └── feed.js             # Vercel serverless: GET /api/feed?shows=id1,id2 → iCal
└── README.md               # Project overview + doc index
```

---

## Planned additions (as we build)

| Step | What we’ll add | Where |
|------|----------------|--------|
| ~~1~~ | ~~Frontend app (Vite/React)~~ | Done: `src/`, `index.html`, `vite.config.js` |
| ~~2~~ | ~~“My Shows” + search UI~~ | Done: `src/App.jsx` (TVMaze search, localStorage) |
| ~~3~~ | ~~Serverless calendar endpoint~~ | Done: `api/feed.js` (TVMaze → iCal) |
| 4 | README with run/deploy instructions | Done: run locally + deploy (Vercel) |

---

## Key files

| File / folder | Purpose |
|---------------|---------|
| `docs/*` | All planning and design |
| `index.html` | Entry HTML; loads `/src/main.jsx` |
| `src/main.jsx` | React root; mounts `App` |
| `src/App.jsx` | My Shows list, Add show (TVMaze search), Subscribe URL + copy |
| `src/index.css` | Design tokens (DESIGN.md palette) |
| `src/App.css` | Layout and component styles |
| `package.json` | React 18, Vite 6; scripts: `dev`, `build`, `preview` |
| `api/feed.js` | GET `/api/feed?shows=id1,id2,...` → fetches TVMaze episodes, returns `text/calendar` (.ics) |

---

## Changelog

| Date | Change |
|------|--------|
| Feb 2, 2025 | Initial structure: docs only; placeholder for frontend and API |
| Feb 2, 2025 | Added React + Vite frontend: src/, index.html, package.json; My Shows + TVMaze search + Subscribe block |
| Feb 2, 2025 | Added api/feed.js: serverless iCal feed from TVMaze; updated README (run + deploy) |
