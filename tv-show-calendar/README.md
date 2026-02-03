# TV Show Calendar

Web app to select your favorite TV shows and subscribe to a calendar of new episode air dates.

- **Docs:** See `docs/` for brainstorm, scope, design, future planning, and project structure.
- **Stack:** React (Vite), TVMaze API, iCal feed, Vercel (frontend + serverless).

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (e.g. http://localhost:5173). You can search for shows, add/remove them, and copy the calendar URL. The **calendar feed** (`/api/feed?shows=...`) is served by a serverless function; to test it locally, run [Vercel CLI](https://vercel.com/docs/cli) from the project root:

```bash
npx vercel dev
```

Then open the URL Vercel prints; the same app will use the local API.

## Deploy (Vercel)

1. Push this repo to GitHub and connect it to [Vercel](https://vercel.com).
2. **If the project lives in a subfolder** (e.g. `tv-show-calendar/`): In Vercel → Project **Settings** → **General** → **Root Directory**, set it to `tv-show-calendar` (or the folder that contains `package.json`). Save and redeploy. This fixes "No Next.js version detected" when the repo root has no `package.json`.
3. `vercel.json` in this project sets `framework: "vite"`, so Vercel uses Vite: build `npm run build`, output `dist`, and deploys the `api/` folder as serverless functions.
4. Your app and calendar feed will be live at `https://your-project.vercel.app` and `https://your-project.vercel.app/api/feed?shows=1,2,3`.

## Doc index

| Doc | Purpose |
|-----|---------|
| [docs/BRAINSTORM.md](docs/BRAINSTORM.md) | Ideas, Q&A, one-liner |
| [docs/SCOPE.md](docs/SCOPE.md) | Technologies, APIs, connections |
| [docs/DESIGN.md](docs/DESIGN.md) | Colors, layout, UI |
| [docs/FUTURE_PLANNING.md](docs/FUTURE_PLANNING.md) | Backlog, ideas for later |
| [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) | Project map (updated as we build) |
| [docs/GITHUB_SETUP.md](docs/GITHUB_SETUP.md) | **Connecting this project to a GitHub repo** |
