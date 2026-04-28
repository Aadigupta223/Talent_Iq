# Talent IQ

> Remote-first technical interview platform with collaborative coding, HD video, and telemetry you can trust.

## Table of Contents

- [Overview](#overview)
- [Feature Highlights](#feature-highlights)
- [Architecture Snapshot](#architecture-snapshot)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [API Surface](#api-surface)
- [Monitoring & Observability](#monitoring--observability)
- [Session Lifecycle](#session-lifecycle)
- [Useful Scripts](#useful-scripts)
- [Roadmap Ideas](#roadmap-ideas)

## Overview

Talent IQ is an end-to-end coding interview cockpit. The backend hardens an Express API with Clerk authentication, Stream video + chat primitives, MongoDB, Inngest-powered user sync, and first-class Prometheus metrics. The frontend ships a polished React 19 + Vite experience featuring Monaco-powered code editing, Piston code execution, Stream video calls, Stream Chat, DaisyUI visuals, and TanStack Query caching. Together they deliver a snappy, secure, two-person coding session with built-in practice problems, dashboards, and observability hooks for production readiness.

Live demo: https://talent-iq-eg56.onrender.com

## Feature Highlights

### Platform

- One-click session creation with curated coding problems and difficulty presets.
- Host + participant workflow with automatic joining, tokenized Stream access, and session state enforcement (`active` ↔ `completed`).
- Interactive practice playground for solo prep (problem selector, Monaco editor, Piston execution, confetti on success).
- Global toast feedback, optimistic navigation, and presence-aware UI states.

### Backend

- Express 4 API hardened with Helmet CSP, rate limiting, CORS, cookie parsing, request logging, Mongo sanitization, XSS guard, and HPP.
- Clerk authentication middleware that maps Clerk identities to first-class Mongo `User` records before controllers see the request.
- Session orchestration: create, join, fetch, end, with Stream Video calls + Stream Chat channels provisioned per session and rolled back on failures.
- Inngest worker that listens to `clerk/user.created` and `clerk/user.deleted` to upsert/delete users in Mongo and Stream.
- Prometheus metrics (`/metrics`) exporting default Node stats plus custom histogram + counter for request latency and throughput.

### Frontend

- React Router 7 routes for home, dashboard, problems catalog, single problem, and live session room.
- ClerkProvider gating plus TanStack Query for caching / background refetches of session data.
- Dashboard composed of reusable cards: active sessions list (join/rejoin states), recent history timeline, stats, and modal-based session creation.
- Session room with resizable panels (Problem description, Monaco editor, output console) alongside Stream video + chat UI.
- Monaco editor with language selector (JS/Python/Java), integrates Piston API for remote execution and normalized output checking.
- Problems catalog and solo problem runner backed by `src/data/problems.js` metadata, DaisyUI badges, and confetti rewards.

## Architecture Snapshot

```
┌────────────┐     Clerk Sign-in      ┌──────────────┐     Mongo Atlas     ┌────────────┐
│  Frontend  │ ─────────────────────▶ │  Express API │ ───────────────────▶│  Sessions  │
│  (Vite)    │◀──── REST / WebSocket ─│  /api/*      │                     │  Users     │
└─────┬──────┘                        └──────┬───────┘                     └────┬───────┘
	│   Stream token + call state          │                                 │
	│                                      │   Inngest Webhook               │
	▼                                      ▼                                 ▼
┌──────────────┐  video/chat  ┌──────────────────────┐  user sync  ┌──────────────┐
│ Stream Video │◀────────────▶│ streamClient/chatClient│◀─────────▶│ Clerk Events │
└──────────────┘              └──────────────────────┘             └──────────────┘

Prometheus Server ◀──────────── scrape /metrics (custom histogram + counter)
```

## Tech Stack

| Layer         | Technologies                                                                                                                                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend      | React 19, Vite 7, Clerk React, React Router 7, TanStack Query 5, DaisyUI + Tailwind 4, Monaco Editor, Stream Video React SDK, Stream Chat React, React Resizable Panels, React Hot Toast, Canvas Confetti         |
| Backend       | Node 20+, Express 4, Clerk Express, MongoDB + Mongoose, Stream Chat + Stream Node SDK, Inngest, Prom Client, Winston, Helmet, express-rate-limit, express-mongo-sanitize, xss-clean, HPP, Multer (future uploads) |
| Execution     | Piston (EMKC) API for sandboxed code runs                                                                                                                                                                         |
| Auth & Comms  | Clerk (user auth + session), Stream (video/audio/chat)                                                                                                                                                            |
| Observability | Prometheus, custom histograms/counters, Winston structured logs                                                                                                                                                   |

## Project Structure

```
talent-iq/
├── backend/
│   ├── app.js                # Express app wiring, security, metrics, routes
│   ├── index.js              # Server bootstrap + DB connection
│   ├── controllers/          # Chat + session + healthcheck logic
│   ├── events/               # Inngest handlers, Stream client helpers
│   ├── middlewares/          # Clerk auth guard, validators, multer stubs
│   ├── models/               # Mongoose User & Session schemas
│   ├── routes/               # /api/chat, /api/sessions, /api/healthcheck
│   ├── utils/                # ApiError/ApiResponse, logger, helpers
│   ├── prometheus-config.yml # Prom scrape config (docker-compose helper)
│   └── docker-compose.yaml   # Prometheus sidecar for local metrics
├── frontend/
│   ├── src/
│   │   ├── pages/            # Home, Dashboard, Problems, Problem, Session, 404
│   │   ├── components/       # Navbar, panels, video UI, modals, cards
│   │   ├── hooks/            # React Query session hooks, Stream client hook
│   │   ├── api/              # sessionsApi wrapper over axios instance
│   │   ├── lib/              # axios, piston, stream video helpers, utils
│   │   └── data/             # Problem metadata + language config
│   ├── vite.config.js        # Vite + React plugin config
│   └── eslint.config.js      # Project lint rules
├── package.json              # Backend scripts + root build pipeline
└── README.md                 # You are here
```

## Environment Variables

### Backend (`.env` at repo root)

| Variable                | Description                                                                    |
| ----------------------- | ------------------------------------------------------------------------------ |
| `PORT`                  | API port (defaults to 4000 if unset).                                          |
| `NODE_ENV`              | `development` or `production` (controls logging + Helmet).                     |
| `CLIENT_URL`            | Origin allowed by CORS and Helmet (`http://localhost:5173` during dev).        |
| `MONGODB_URI`           | Mongo connection string (without DB name; `talentiq` is appended).             |
| `STREAM_API_KEY`        | Stream server key used for video + chat provisioning.                          |
| `STREAM_API_SECRET`     | Stream server secret used to create tokens and calls.                          |
| `CLERK_PUBLISHABLE_KEY` | Needed by Clerk middleware for SSR token verification.                         |
| `CLERK_SECRET_KEY`      | Clerk backend secret for `requireAuth`.                                        |
| `CLERK_SIGNING_SECRET`  | Required if Clerk webhooks are verified before reaching Inngest (recommended). |
| `BASE_URL`              | Optional: used for logging the deployment URL.                                 |

### Frontend (`frontend/.env`)

| Variable                     | Description                                                 |
| ---------------------------- | ----------------------------------------------------------- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Frontend Clerk key (matches backend project).               |
| `VITE_API_BASE_URL`          | Points to Express API (`http://localhost:4000/api` in dev). |
| `VITE_STREAM_API_KEY`        | Public Stream API key for Stream Video client.              |

> Tip: never expose `STREAM_API_SECRET` or Clerk secret keys to the frontend bundle.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- MongoDB Atlas or local Mongo instance
- Clerk application (publishable + secret keys)
- Stream account (video/chat enabled)
- Optional: Docker Desktop for Prometheus sidecar

### Installation

```bash
git clone https://github.com/<your-org>/talent-iq.git
cd talent-iq
npm install          # installs backend deps (nodemon, express, etc.)
cd frontend && npm install && cd ..
```

Create the `.env` files described above before running anything.

### Start the development servers

```bash
# Terminal 1 - backend API
npm run dev

# Terminal 2 - frontend UI
cd frontend
npm run dev -- --open
```

- Backend defaults to `http://localhost:4000` and exposes `/api/*` plus `/metrics`.
- Frontend defaults to `http://localhost:5173` and proxies API calls via `VITE_API_BASE_URL`.

### Production build

```bash
# Build frontend assets into frontend/dist and install deps
npm run build

# Run API in production mode (serves frontend/dist)
npm start
```

### Optional: Prometheus server

```bash
cd backend
docker compose up prom-server
# Prom dashboard available at http://localhost:9090 scraping http://host.docker.internal:4000/metrics
```

## API Surface

Base URL: `http://<host>:<port>/api`

| Method | Path                  | Description                                                           | Auth                    |
| ------ | --------------------- | --------------------------------------------------------------------- | ----------------------- |
| GET    | `/healthcheck`        | Liveness probe.                                                       | Public                  |
| GET    | `/chat/token`         | Issues a Stream chat/video token for the signed-in Clerk user.        | Clerk JWT (via cookies) |
| POST   | `/sessions`           | Create a session (persists Mongo record, creates Stream call + chat). | Clerk                   |
| GET    | `/sessions/active`    | List up to 20 active sessions with populated host info.               | Clerk                   |
| GET    | `/sessions/my-recent` | Last 20 completed sessions where user was host or participant.        | Clerk                   |
| GET    | `/sessions/:id`       | Fetch single session; non-members can only see active sessions.       | Clerk                   |
| POST   | `/sessions/:id/join`  | Join as participant (adds you to Session + Stream chat).              | Clerk                   |
| POST   | `/sessions/:id/end`   | Host-only action to mark session as completed.                        | Clerk                   |
| POST   | `/inngest`            | Inngest webhook endpoint (Clerk events fan-in).                       | Signed by Inngest       |
| GET    | `/metrics`            | Prometheus metrics (protected by network rules / reverse proxy).      | Internal                |

## Monitoring & Observability

- **Prometheus metrics**: Default Node metrics plus `http_request_duration_seconds` histogram and `total_req` counter. Scrape via `/metrics` (secured via network ACL or auth proxy in production).
- **Winston logging**: Colorized console logs in dev, JSON logs persisted to `app.log` (all levels) and `error.log` (warn+). `requestLogger` middleware captures method, path, latency, bytes, and IP.
- **Stream recordings**: Sessions enable Stream recording mode; host can inspect `call.get()` metadata when ending sessions to retrieve recording references.

## Session Lifecycle

1. **Create session** (host) → backend persists Mongo `Session`, provisions Stream call + chat channel, returns `callId`.
2. **Dashboard listing** via `useActiveSessions` reveals open slots (host vs participant status displayed).
3. **Join session** (guest) → backend sets `participant`, adds user to Stream chat channel, frontend auto-joins call when you load `/session/:id`.
4. **During call** → StreamVideo + StreamChat provide real-time comms, Monaco editor + Piston handle collaborative coding.
5. **End session** (host) → backend flips status to `completed` (call deletion deferred for recording retrieval); React Query invalidates caches so UI updates.
6. **History** surfaces via `useMyRecentSessions` for analytics cards.

## Useful Scripts

| Location | Command                         | Purpose                                                          |
| -------- | ------------------------------- | ---------------------------------------------------------------- |
| root     | `npm run dev`                   | Nodemon-powered backend with `NODE_ENV=development`.             |
| root     | `npm start`                     | Production Express server serving `frontend/dist`.               |
| root     | `npm run build`                 | Installs deps and builds frontend bundle (used for deployments). |
| frontend | `npm run dev`                   | Launch Vite dev server with HMR.                                 |
| frontend | `npm run lint`                  | Run ESLint across React code.                                    |
| backend  | `docker compose up prom-server` | Start a local Prometheus instance using provided config.         |

## Roadmap Ideas

1. Persist Stream recording metadata in Mongo and surface replays in the dashboard.
2. Add collaborative cursor + code presence with Liveblocks or Yjs.
3. Introduce problem tagging, filtering, and search across `PROBLEMS` catalog.
4. Streamline deployments with a single `docker-compose.yml` that bundles API, frontend, Mongo, and Prometheus.
5. Add automated test coverage (Vitest for frontend hooks/components, Jest or Tap for backend controllers).

---

Questions or suggestions? Open an issue or start a discussion in this repo. Happy pairing!
