[![Tests](https://github.com/Nano315/lol-skin-picker/actions/workflows/test.yml/badge.svg)](https://github.com/Nano315/lol-skin-picker/actions/workflows/test.yml)
[![Release](https://img.shields.io/github/v/release/Nano315/lol-skin-picker)](https://github.com/Nano315/lol-skin-picker/releases)
[![Downloads](https://img.shields.io/github/downloads/Nano315/lol-skin-picker/total)](https://github.com/Nano315/lol-skin-picker/releases)
[![License: MIT](https://img.shields.io/github/license/Nano315/lol-skin-picker)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows-informational)]()

**[Website](https://skin-picker-website.vercel.app)** · **[Download](https://github.com/Nano315/lol-skin-picker/releases/latest)** · **[Report an issue](https://github.com/Nano315/lol-skin-picker/issues)** · **[Rooms server](https://github.com/Nano315/skin-picker-rooms-server)**

# Skin Picker — Desktop

A desktop companion for League of Legends champion select that turns *"what skin should I play?"* into zero extra clicks — solo, or with a full premade.

Skin Picker is an Electron application that talks directly to the local League of Legends Client (LCU) to automatically roll, re-roll and coordinate skins during champion select. It runs standalone for solo queue and pairs with a dedicated real-time server to synchronize a whole team's skins by color, by thematic Skin Line, or a smart blend of both.

> ⚠️ Skin Picker is not affiliated with or endorsed by Riot Games. It interacts only with the local LoL Client to modify cosmetic selection (skins and chromas). You remain responsible for compliance with Riot's Terms of Service.

---

## Download

Grab the latest Windows installer from the [releases page](https://github.com/Nano315/lol-skin-picker/releases/latest) or from the [website](https://skin-picker-website.vercel.app). Updates are delivered automatically via `electron-updater`.

The installer is currently unsigned, so Windows SmartScreen will display a warning on first launch — click **More info** → **Run anyway**. Code signing is being put in place to remove this friction.

---

## What it does

### Solo queue

- **Auto-roll on lock-in** — the moment you lock a champion, Skin Picker picks a random skin and chroma from what you own and applies it via the LCU.
- **Manual re-roll** — dedicated *Reroll Skin* and *Reroll Chroma* buttons, usable at any point in champ select.
- **History-aware picks** — each champion keeps a rolling window of recent rolls (configurable, default 5) so the same skin doesn't come back two games in a row.
- **Library** — browse every owned champion (mastery / A–Z / skin-count sort, fuzzy search), drill down to per-skin and per-chroma include/exclude. Excluded entries never come up in random rolls; restrict a champion to a single skin and the random will lock onto it. Persists across sessions.
- **Match Lock** *(new)* — a floating widget (bottom-left or bottom-right, configurable in *Settings → Quick Controls*) that holds your skin for a single game. While active: no auto-roll, no re-roll, and the owner of any premade you join cannot override your skin. Auto-resets at the end of each played game (a champ-select dodge does **not** disarm it).
- **Dynamic theming** — borders, glows and ambient animations adapt to the dominant color of whatever chroma is currently equipped.
- **Animated mascots layer** — Meeps, Poros and Lulu floating in parallax behind the UI.

### Premade rooms (real-time)

- **Join a room with a six-character code** (e.g. `ABC123`), or send a direct invitation to an online friend.
- **Live team dashboard** — every teammate's current pick updates in real time as they change it.
- **Three sync modes**, controlled by the room owner:
  - **Chromas** — coordinate by shared chroma color. The server finds the tightest color match across everyone's owned pool.
  - **Skins** — coordinate by shared Skin Line (e.g. everyone Star Guardian, everyone PROJECT). Chromas reset to base for visual consistency.
  - **Both** *(default)* — try Skin Line first, fall back to color harmony if no common line exists.
- **Auto-Apply** — once every member has locked a champion and submitted their available options, the app automatically applies a coordinated combination (5 s cooldown, respects the active sync mode).
- **Synergy panel + Combination Builder** *(owner-only)* — browse every viable Skin Line match with member coverage and combination counts, preview each teammate's splash art, randomize within the synergy, apply with a single click.
- **Synergy history** — the last three applied synergies (colors and skin lines tracked separately) are excluded from auto-picks to avoid repetition.

### Social

- **Friend presence** — reads your LoL friends list via the LCU and surfaces who is online and currently running Skin Picker.
- **Direct invitations** with in-app toast notifications.
- **Identity handshake** — friends automatically see your current champion and skin selection.
- **Resilient socket** — the client auto re-identifies after any WebSocket reconnect; no session is ever lost.

### Quality of life

- **Tray integration** — minimizes to the system tray when the client closes, restores automatically on lobby or champ select.
- **Smart window lifecycle** — hides itself during `InProgress` (active game) and reappears on the post-game screen. Window position and target display are persisted across restarts.
- **Single-instance lock** — a second launch focuses the existing window instead of spawning a duplicate.
- **Auto-updates** via `electron-updater` and GitHub Releases — check 10 seconds after launch, then every 4 hours.
- **Opt-in telemetry** — anonymous usage events (Aptabase) are disabled by default, gated by explicit consent, and revocable at any time from the settings panel.
- **Robust LCU polling** — adaptive interval with exponential back-off, works even if the League Client is slow to start.

---

## Interface

The home screen is a responsive Bento-style grid:

1. **Preview card** — full-size splash art of the current skin/chroma with a glow tinted from the chroma's dominant color.
2. **Details card** — live LCU state: gameflow phase, champion alias, active skin and chroma names.
3. **Actions card** — context-aware controls. Reroll buttons in solo mode, group synergy controls in a room.
4. **Rooms tab** — manage the squad, copy the invite code, pick the sync mode, browse Skin Line synergy cards, step through the Combination Builder.

---

## Architecture

| Layer | Stack |
|-------|-------|
| Desktop shell | Electron 30 |
| Renderer | React 18 + Vite 5 + TypeScript 5 + Tailwind 3 |
| Motion | Framer Motion |
| Game client integration | Custom LCU watcher (lockfile auth, HTTPS polling) |
| Real-time sync | Socket.IO client → Node.js + Express 5 + Socket.IO backend ([`skin-picker-rooms-server`](https://github.com/Nano315/skin-picker-rooms-server)) |
| State | Custom stores (`presenceStore`, `invitationStore`, `matchLockStore`, `historyStore`) — no Redux/Zustand/MobX |
| Testing | Vitest + Testing Library (unit + integration) |
| Logging | `electron-log` (rotating files) |
| Telemetry | Aptabase (opt-in) |
| CI/CD | GitHub Actions (test → release) |
| Packaging | `electron-builder` (NSIS installer, Windows x64) |

### LCU integration

- Reads the local LoL Client **lockfile** to obtain LCU credentials (port, password, protocol).
- Polls the local HTTPS API (`127.0.0.1`) with **adaptive intervals** — fast (2 s) while the client is running, slower when offline.
- Subscribes to gameflow phase changes, champion lock-ins, skin/chroma selection events and the friend presence feed.
- Writes the selected skin and chroma back through the LCU to apply each rolled pick.

### Real-time sync

- **Two independent Socket.IO connections** per client:
  - `rooms` — created on demand, handles room state and synergy computation.
  - `identity` — permanent, handles presence and direct invitations with infinite auto-reconnect.
- Client emits `update-selection` on every skin change; server broadcasts `room-state` updates to the rest of the room.
- Server computes **color synergies** and **Skin Line synergies** in parallel and broadcasts both; the active sync mode decides which is applied.
- A `CLIENT_VERSION` is sent on every handshake so the backend can gate incompatible clients.

### Data sources

| Source | Used for |
|--------|----------|
| **CommunityDragon** | Chroma color analysis, chroma asset URLs, `skinlines.json` & `skins.json` (Skin Line mapping, 24 h cache) |
| **Data Dragon** | Champion splash art |

---

## Getting started (development)

### Prerequisites

- Node.js ≥ 18
- League of Legends Client installed (Windows)

### Run the Electron app in dev mode

```bash
cd SkinPicker-Front
npm install
npm run dev
```

`npm run dev` starts Vite for the renderer and launches Electron against the dev bundle with hot reload on both the main process and the renderer.

### Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite + Electron, hot reload |
| `npm run build` | Production bundle + NSIS installer (stable channel) |
| `npm run build:beta` | Production bundle + NSIS installer (beta channel) |
| `npm run release` | Build + publish to GitHub Releases (stable) |
| `npm run release:beta` | Build + publish to GitHub Releases (beta) |
| `npm run lint` | ESLint over `src/` and `electron/` |
| `npm test` | Vitest (unit + integration) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with V8 coverage |

### Environment files

| File | Committed? | Used by |
|------|-----------|---------|
| `.env.development` | ✅ yes | `npm run dev` |
| `.env.example` | ✅ yes | Reference template |
| `.env.production`, `.env.staging` | ❌ no (gitignored) | Regenerated by CI from GitHub Secrets at release time |

All `VITE_*` variables end up **inlined into the client bundle**. Only put values that are safe to ship publicly (Aptabase app key, public endpoints). Real secrets must stay server-side behind an API.

> ⚠️ Running `npm run build` / `npm run release` **locally** will produce a binary without the production Aptabase key (telemetry will silently no-op), because `.env.production` is only materialized inside the GitHub Actions workflow. Published releases are cut by pushing a `v*` tag — see `.github/workflows/release-front.yml`.

### Backend

Skin Picker's multiplayer features require the **Rooms server**. See the [`skin-picker-rooms-server`](https://github.com/Nano315/skin-picker-rooms-server) repository for setup.

---

## Release channels

| Channel | Purpose | `appId` | Auto-update feed |
|---------|---------|---------|------------------|
| **Stable** | End-user releases | `com.dumas.lolskinpicker` | `latest.yml` |
| **Beta** | Pre-release validation | separate `appId` | `beta.yml` |

Both channels install into separate `userData` folders and ship distinct icons, so they can run side by side on the same machine without stepping on each other's state.

---

## Privacy & safety

- All communication happens with the local LoL Client (`127.0.0.1` / LCU) or with the dedicated Skin Picker rooms server. No third parties are involved.
- Telemetry (Aptabase) is **off by default**. The first launch asks for explicit consent; the choice can be revoked at any time from the settings panel. Exact list of collected and excluded fields is shown in *Settings → Telemetry & Analytics → What data is collected?*.
- Only cosmetic selection (skins and chromas) is modified on the client. Runes, summoner spells, champion selection and anything gameplay-related are never touched.

---

## License

MIT — see [LICENSE](LICENSE).

---

## Credits

- **CommunityDragon** for skin metadata, chroma assets and Skin Line mappings.
- **Data Dragon** for champion splash art.
- **Electron**, **React**, **Vite**, **Tailwind CSS**, **Framer Motion**, **Socket.IO**, **Express** and the wider open-source ecosystem.

---

## Quick "how to use"

1. **Launch the LoL Client**, then launch Skin Picker. The app connects automatically.
2. **Solo:** lock a champion in champ select. Use the *Reroll* buttons or let *Auto-roll* decide. Visit the *Library* tab to curate which skins and chromas the random can pick from per champion, or click the inline ✘ button on the live preview to exclude the displayed variant.
3. **Premade:** open the *Premade* tab, create a room and share the code (or invite a friend directly from the friends list). Once everyone has locked in, *Auto-Apply* coordinates the team based on the selected sync mode. As room owner, refine the result via the *Synergy Panel* or the step-by-step *Combination Builder*.
4. **Hold your skin:** click the floating cadenas in the bottom corner to lock for a single game — others in the room see a small badge on your card and the owner's apply paths skip you. The lock auto-resets when the game ends.

Enjoy 💙
