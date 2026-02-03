# TV Show Calendar — Design

**Purpose:** Colors, typography, and app layout.  
**Updated:** February 2, 2025  

---

## 1. Layout (screens / views)

### 1.1 Structure (locked for v1)

| View | Purpose |
|------|---------|
| **Home / My Shows** | List of selected shows; “Add show” button; “Subscribe to calendar” block (URL + copy). Default view. |
| **Add show** | Search input → list of results from TVMaze → click to add to My Shows. Shown as same-page panel or simple toggle (no separate route). |
| **Upcoming** | Not in v1 — see FUTURE_PLANNING.md. |

**Navigation:** Header only: title + “Add show”. No nav bar; “Add show” reveals search, then back to list.

### 1.2 Wireframe (text)

```
+------------------------------------------+
|  TV Show Calendar          [ Add show ]  |
+------------------------------------------+
|                                          |
|  My Shows                                |
|  --------------------------------        |
|  • Show A                    [ Remove ]  |
|  • Show B                    [ Remove ]  |
|  • Show C                    [ Remove ]  |
|                                          |
|  Subscribe to calendar                   |
|  [ https://.../api/feed?shows=1,2,3  ] [ Copy ] |
|  Add this URL in Apple Calendar, Google  |
|  Calendar, or Outlook.                   |
|                                          |
+------------------------------------------+
```

**Add show view (same page, or overlay):**  
Search input at top → results list below (show name, optional year). Click result = add + return to list (or stay in search to add more).

---

## 2. Colors & theme (locked for v1)

**Theme:** Dark. Easy on the eyes, fits a “watch list” / entertainment app.

### 2.1 Palette

| Role | Hex | Usage |
|------|-----|--------|
| **Background** | `#0d1117` | Page background |
| **Surface** | `#161b22` | Cards, list rows, search input, modal/panel |
| **Surface hover** | `#21262d` | Row hover, button hover |
| **Primary (accent)** | `#58a6ff` | Buttons, links, “Add show”, “Subscribe”, focus ring |
| **Text primary** | `#e6edf3` | Headings, body, list items |
| **Text secondary** | `#8b949e` | Hints, “Copy link”, empty-state subtext |
| **Border** | `#30363d` | Dividers, input outline, card edges |
| **Success** | `#3fb950` | “Copied!” feedback |
| **Error / remove** | `#f85149` | Remove button, errors |

### 2.2 Mood

- **Dark** with one clear **blue accent** — minimal, readable, not flashy. (Palette is GitHub-dark inspired; works well for tools.)

---

## 3. Typography (locked for v1)

| Use | Font | Notes |
|-----|------|--------|
| **Headings** | System font stack (same as body) | No extra font requests; fast load. |
| **Body & UI** | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif` | Native look on Mac/Windows. |
| **Calendar URL / copy area** | Same as body, or `ui-monospace, monospace` | Slightly smaller size for URL block. |

**Sizes (suggested):**  
- App title: 1.25–1.5rem, semibold.  
- Section labels (“My Shows”): 1rem, semibold.  
- Body / list: 1rem.  
- Hints / secondary: 0.875rem.

---

## 4. Components (locked for v1)

| Component | Spec |
|-----------|------|
| **App header** | “TV Show Calendar” (title) left; “Add show” button right. Same background as page; bottom border. |
| **My Shows list** | One row per show: show name (text primary), “Remove” link/button (text secondary or red on hover). Surface background; border between rows. Empty state below if 0 shows. |
| **Add show button** | Primary color background, white text; or outline (border primary, text primary). Opens search view or reveals search. |
| **Search** | Full-width input (surface bg, border); placeholder “Search for a show…”. Results: list of cards/rows with show name + optional year/network (secondary text). Click row = add to My Shows (and close or stay). |
| **Subscribe block** | Surface card. Heading “Subscribe to calendar”. Read-only input or box with the feed URL; “Copy link” button (primary). Short line: “Add this URL in Apple Calendar, Google Calendar, or Outlook.” |
| **Empty state** | When My Shows is empty: message “No shows yet” + subtext “Add your first show to build your calendar.” + “Add show” button. |

---

## 5. Responsiveness (locked for v1)

- **Single column** on all sizes; max-width ~640px for content, centered.
- **Touch-friendly:** Buttons and list rows at least 44px tap target where possible.
- **No breakpoint-specific layout changes** in v1; one layout that works on phone and desktop.

---

## 6. Your notes (optional)

_Add links to sites you like, or tweaks (e.g. different accent color)._

```
[ Your design notes ]
```

---

## Changelog

| Date | Change |
|------|--------|
| Feb 2, 2025 | Initial layout and wireframe; placeholder color/typography sections |
| Feb 2, 2025 | Locked design: dark palette (GitHub-dark style), system fonts, component specs, responsiveness |
