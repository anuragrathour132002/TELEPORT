# Teleport — Flight Schedule Management (Take-Home)

Internal operations-style UI to view, search, filter, select, edit, and delete flight records. All data is loaded once from local JSON and managed in React state (no backend).

## Live demo

Deployed build: [https://teleport-assessment.vercel.app/](https://teleport-assessment.vercel.app/)

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+ (comes with Node)

## Setup

```bash
git clone <your-repo-url>
cd teleport
npm install
```

## Run locally

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

`preview` serves the built files from `dist/` for a quick production check.

## Data

Flight records are served as static JSON:

- `public/data/flights.json`

The app fetches this file on mount (`/data/flights.json`).

## Tech stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- MUI (Material UI) for layout and controls
- `react-window` for table row virtualization
- `dayjs` for date comparisons in filters

## Feature notes (assessment alignment)

- **Filters** combine with **AND** logic; **Clear All** resets filters (search is cleared with Clear All in the current implementation).
- **Date range filter** uses **overlap** between the selected range and each flight’s `startDate`–`endDate`.
- **Inline edit save** simulates an async request; saves can **randomly fail** to demonstrate loading, error state, and non-commit (rollback) behavior. Click **Save** again to retry.

## What to submit

- A **GitHub repository** (public or shared with the hiring team) containing this source code.
- This **README** with the setup instructions above.

## Project scripts

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `npm run dev`      | Start dev server               |
| `npm run build`    | Typecheck + production build   |
| `npm run preview`  | Preview production build       |
