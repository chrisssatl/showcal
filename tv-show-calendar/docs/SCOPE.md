# TV Show Calendar — Scope

**Purpose:** Identify all technologies, services, and connections for the app.  
**Updated:** February 2, 2025  

---

## 1. What the app does (in scope)

| Capability | Description |
|------------|-------------|
| **Search / add shows** | User searches for TV shows by name and adds them to “My Shows” |
| **My Shows** | Persistent list of selected shows (v1: e.g. browser `localStorage`) |
| **Calendar feed** | A URL that returns an **iCal (.ics)** feed of upcoming episode air dates for “My Shows” |
| **Subscribe** | User pastes the feed URL into Apple Calendar, Google Calendar, Outlook, etc. |

---

## 2. Technologies & connections

### 2.1 Frontend (what you see in the browser)

| Item | Choice | Notes |
|------|--------|--------|
| **Stack** | **React + Vite** | Single-page app; npm-based; deploy to Vercel. |
| **State** | “My Shows” list in **localStorage** | Key e.g. `tv-calendar-my-shows`; array of `{ id, name }`. |
| **Routing** | Single page, 2 views | (1) My Shows + calendar URL, (2) Add show (search + results). No router library for v1. |

### 2.2 TV show / episode data (air dates)

| Item | Option | Notes |
|------|--------|--------|
| **API** | **TVMaze** (free, no API key) or **TMDB** (free with key) | TVMaze: good for schedule/episodes; TMDB: richer metadata |
| **What we need** | Show ID, name, episode air dates (and optionally S/E numbers, title) | Drive calendar events from this |
| **Rate limits** | Check API docs | Cache or batch to avoid hitting limits |

**TVMaze (chosen for v1):**

- Base: `https://api.tvmaze.com`
- Search shows (multiple results): `GET /search/shows?q={name}` → returns `[{ show: { id, name, ... } }, ...]`
- Single show by ID: `GET /shows/{id}` → `{ id, name, ... }`
- Episodes: `GET /shows/{id}/episodes` → `[{ airdate, name, season, number, ... }, ...]`
- No API key required. Rate limit: avoid excessive requests; cache episode data in serverless if needed.

### 2.3 Calendar feed (subscribe in calendar apps)

| Item | Choice | Notes |
|------|--------|--------|
| **Format** | **iCalendar (.ics)** | Standard; Apple/Google/Outlook subscribe to a URL. |
| **Content** | One event per episode: title = show name + episode name, date = airdate; optional description (e.g. S1E3). |
| **Where it lives** | **Serverless endpoint** | `GET /api/feed?shows=1,2,3` → fetches TVMaze episodes, builds `.ics`, returns `Content-Type: text/calendar`. |

**Challenge:** Calendar apps subscribe to a **URL**. The URL must be stable and include “which shows” (e.g. encoded in a token or user id). So we need:

- Either: **Backend** that stores “My Shows” and exposes `/feed/{userOrToken}.ics`
- Or: **Client-only** app that generates a **one-time or shareable .ics file** for current “My Shows”; user re-generates when list changes (simpler for v1, no server DB)

**v1 approach (locked):**  
We use a **serverless function** that accepts show IDs in the URL and returns `.ics` (e.g. `/api/feed?shows=1,2,3`). The app shows the user this URL; they subscribe to it in their calendar app. When they add/remove shows, the URL changes and they can update their subscription (re-subscribe to the new URL).

### 2.4 Backend / hosting (to serve the calendar URL)

| Item | Choice | Notes |
|------|--------|--------|
| **Hosting** | **Vercel** | One repo: static frontend + serverless function; free tier. |
| **Serverless** | **One function** (e.g. `api/feed.js` or `api/feed.ts`) | Query: `shows=1,2,3`. Fetches TVMaze episodes, builds `.ics`, returns `Content-Type: text/calendar`. |
| **Frontend** | Same Vercel project | Vite build output + function under `/api/*`. |

### 2.5 Data flow (connections)

```
[ User browser ]
    → Search: GET TVMaze API (search shows)
    → My Shows: read/write localStorage (or later: your backend)
    → “Get calendar URL”: build URL with show IDs (e.g. /api/feed?shows=1,2,3)
[ Calendar app (Apple/Google/Outlook) ]
    → Subscribe to URL
[ Your serverless endpoint ]
    → GET /api/feed?shows=1,2,3
    → For each show ID: GET TVMaze (episodes)
    → Build .ics
    → Return 200 + .ics body
```

---

## 3. Out of scope (v1)

- User accounts / login
- Storing “My Shows” on a server (v1: localStorage only, or encoded in feed URL)
- Public discovery / social features
- Payments
- Native mobile app (web only)

---

## 4. Decisions (locked for v1)

| # | Decision | Choice | Notes |
|---|----------|--------|--------|
| 1 | Frontend | **React + Vite** | Single-page app; fast to build and deploy; easy to extend later. |
| 2 | “My Shows” persistence | **localStorage only** | No backend DB for v1; list lives in the browser. |
| 3 | Calendar feed | **Serverless endpoint with show IDs in URL** | e.g. `GET /api/feed?shows=1,2,3` → returns `.ics`. User subscribes to this URL. |
| 4 | Hosting | **Vercel** | Free tier; runs React (Vite) + serverless function in one repo; simple deploy. |

---

## 5. v1 scope summary (deliverable)

| Piece | Delivered as |
|-------|----------------|
| **App** | React (Vite) app: My Shows list, Add show (TVMaze search), “Subscribe” = copy calendar URL. |
| **Data** | TVMaze API for search + episodes; localStorage for My Shows. |
| **Calendar** | Vercel serverless `GET /api/feed?shows=id1,id2,...` → iCal response. |
| **Hosting** | Vercel: app + API on one URL (e.g. `yourapp.vercel.app`). |

---

## 6. Links

- [TVMaze API](https://www.tvmaze.com/api)
- [iCalendar RFC (summary)](https://en.wikipedia.org/wiki/ICalendar) — for building `.ics`
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) — where these pieces live in the repo

---

## Changelog

| Date | Change |
|------|--------|
| Feb 2, 2025 | Initial scope: TVMaze, iCal feed, serverless, data flow |
| Feb 2, 2025 | Locked decisions: React+Vite, localStorage, serverless feed URL, Vercel; added v1 summary and TVMaze endpoints |
