[![Tests](https://github.com/Nano315/lol-skin-picker/actions/workflows/test.yml/badge.svg)](https://github.com/Nano315/lol-skin-picker/actions/workflows/test.yml)

# LoL Skin Picker

A modern Electron + React app that auto-picks and rerolls League of Legends skins (and chromas) during Champ Select. It seamlessly talks to the local LoL Client (LCU) and orchestrates multiplayer skin synchronization by **color** or by **thematic Skin Line**.

> ⚠️ Not affiliated with or endorsed by Riot Games. Use at your own risk.

### 🎨 Design & purpose

The visual design is **heavily inspired by the art direction of DPM.lol**, featuring a modern **Bento Grid layout**, glassmorphism effects, and animated mascots.

This app is a **personal project** created to showcase my Full Stack & UI/UX skills to the DPM.lol team with the hope of securing an **alternance (apprenticeship)** there. It is not an official DPM.lol product.

---

## ✨ Features

### 🎮 Solo Experience
* **Smart Auto-roll:** Automatically picks a random skin/chroma upon champion lock.
* **Smart Reroll:** Manual **Reroll Skin** & **Reroll Chroma** buttons with history tracking (avoids recent picks).
* **Dynamic Theming:** The UI adapts its glow and borders based on the dominant color of the selected skin/chroma.
* **Mascots Layer:** Animated mascots (Meeps, Poros, Lulu) floating in parallax.

### 📋 Skin History & Priority System
* **History Tracking:** Remembers recently used skins and chromas per champion (configurable window, default 5) and avoids re-rolling into them.
* **Skin Priorities:** Mark any skin as **Favorite** (×3 roll weight) or **Deprioritized** (×0.3 roll weight). Priorities are stored locally per champion and persist between sessions.
* **History Management:** Clear history globally or per champion from the settings panel.

### 🤝 Multiplayer Rooms
* **Real-time Sync:** Create or join a lobby via a short code (e.g., `ABC123`).
* **Live Dashboard:** See your teammates' picks updating in real-time.
* **Synergy Detection:** Analyses chroma color palettes **and thematic Skin Lines** of all players to surface coordinated looks.
* **Group Reroll (Color mode):** The host picks a color theme (Blue, Red, Golden…) and the server harmonizes the entire team's skins instantly.

### 🎨 SkinLine Sync (Epic 6)
* **3 Sync Modes** (controlled by the room owner):
  * **Chromas** — Classic: coordinates by shared chroma color.
  * **Skins** — Thematic: coordinates by shared Skin Line (e.g., all Star Guardian, all PROJECT). Chroma resets to base for visual consistency.
  * **Both** *(default)* — Tries Skin Line first; falls back to color if no common line is found.
* **Auto-Apply:** When every member has locked a champion and sent available options, the app automatically applies a coordinated combination based on the active sync mode (5-second cooldown).
* **Skin Line Synergy Panel:** Displays available Skin Line matches (name, member coverage, combination count). Clicking a card applies it instantly (owner only).
* **Combination Builder** *(owner only)*: Step-by-step interface to choose a synergy, preview each member's assigned skin splash art, randomize picks within the synergy, and confirm with a single **Apply** click.
* **Synergy History:** The last 3 applied synergies (colors & skin lines tracked separately) are remembered to avoid repetition.

### 👥 Social System (Epic 4)
* **Friend Presence:** Reads your LoL friends list via LCU and shows who is online and using Skin Picker.
* **Direct Invitations:** Send and receive room invitations directly to/from friends with in-app notification toasts.
* **Identity Handshake:** Automatic identity sharing so friends see your in-game champion and skin selection.
* **Socket Reconnection:** The client auto re-identifies after a WebSocket reconnect — no session lost.
* **LCU Retry Logic:** Robust polling with exponential back-off if the League Client is slow to start.

### ⚙️ Core
* **Include default skin** toggle.
* **Tray Support:** Minimizes to tray when the client closes; restores automatically at game end/lobby.
* **Smart Window Management:** Hides itself during `InProgress` (active game) and reappears on the post-game screen. Window position and display are persisted across restarts.
* **Single-Instance Lock:** Only one copy of the app can run at a time; a second launch focuses the existing window.
* **Auto-updates:** Integrated with GitHub Releases via `electron-updater` (startup check + every 4 hours).
* **Analytics & Consent:** Optional opt-in telemetry (Umami) and error reporting (Sentry) — both require explicit user consent.

---

## 🖼️ UI at a glance: The Bento Grid

The application uses a responsive Bento layout divided into smart panels:

1. **Preview Card (Top-Left):** Large, rounded display of the current splash art with a dynamic chroma glow.
2. **Details Card (Top-Right):** Live data showing current Game Phase, Champion Alias, and active Skin/Chroma names.
3. **Actions Card (Bottom):** Context-aware controls. Reroll buttons in solo mode, or Group Synergy controls in a Room.
4. **Rooms Tab:** Manage the squad, copy invite codes, visualize the team's loadout, select the **Sync Mode**, and browse Skin Line synergy cards.

---

## ▶️ How it works

### LCU Watcher & Gameflow
The app reads the lockfile to authenticate with the local League Client API (LCU) and polls for:
* Summoner identity & icon.
* Gameflow phase (Lobby, ChampSelect, InProgress…).
* Champion ownership & current selection.
* Friends list presence.

### Real-time Multiplayer (Socket.io)
* Connects to a custom **Node.js / Express 5 / Socket.io** backend.
* Emits `update-selection` when you change skins; listens for `room-state` to render teammates.
* Server computes **Skin Line synergies** alongside color synergies and broadcasts both.
* Owner emits `set-sync-mode` to switch between `chromas`, `skins`, or `both`.

### Data Sources
| Source | Used for |
|--------|----------|
| **CommunityDragon** | Chroma color analysis, chroma assets, `skinlines.json` & `skins.json` (Skin Line mapping, cached 24 h) |
| **Data Dragon** | Champion splash art |

---

## 🔁 Auto-updates

* Checks **10 seconds** after startup.
* Rechecks every **4 hours** during usage.
* Downloads and applies the update on next launch.

---

## 🏗️ Architecture Overview

| Layer | Technology |
|-------|------------|
| Desktop shell | Electron 30 |
| UI renderer | React 18 + Vite 5 + TypeScript |
| Test suite (front) | Vitest + Testing Library |
| Backend server | Node.js + Express 5 + Socket.io 4 |
| Test suite (back) | Jest + Supertest |
| CI/CD | GitHub Actions (front release + back deploy) |
| Analytics | Umami (self-hosted, opt-in) |
| Error tracking | Sentry (opt-in) |
| Logging | electron-log (front) + Winston (back) |

---

## 🚀 Getting Started (Development)

### Prerequisites
* Node.js ≥ 18
* League of Legends Client installed and running

### Frontend (Electron app)
```bash
cd SkinPicker-Front
npm install
npm run dev           # starts Vite + Electron in dev mode
npm test              # run Vitest unit tests
npm run test:coverage
```

### Backend (Rooms server)
```bash
cd SkinPicker-Back
npm install
npm run dev           # ts-node hot-reload
npm test              # run Jest tests
```

---

## 🔐 Disclaimer

* The app only communicates with the local LoL Client (`127.0.0.1` / LCU) and the dedicated Rooms server.
* It changes only cosmetic selection (skins/chromas).
* You are responsible for compliance with Riot's Terms of Service. This project is not endorsed by Riot Games.

---

## 🙌 Credits

* **CommunityDragon** for skin data, chroma assets, and Skin Line metadata.
* **Data Dragon** for champion splash art.
* **Electron**, **React**, **Vite**, **Socket.io**, **Express**, and the broader OSS ecosystem.

---

## Quick "How to use"

1. **Launch:** Start the LoL Client, then launch Skin Picker. The app connects automatically.
2. **Solo:** Lock a champion. Use **Reroll** buttons or let **Auto-roll** decide.
   * Right-click a skin to mark it as **Favorite** or **Deprioritized**.
3. **Multiplayer:**
   * Go to the **Rooms** tab.
   * **Create** a room and share the code, or invite a friend directly from the friends list.
   * Wait for your friends to join and lock their champions — **Auto-Apply** kicks in automatically.
   * As the owner, select a **Sync Mode** (Chromas / Skins / Both) and refine the result via the **Synergy Panel** or the **Combination Builder**.

Enjoy 💙
