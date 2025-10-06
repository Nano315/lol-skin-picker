# LoL Skin Picker – Codebase Overview

This document gives newcomers a tour of the project structure, the most important runtime flows, and suggestions for topics to explore next.

## High-level architecture

LoL Skin Picker is an Electron desktop app. The **main process** (under `electron/`) owns platform integration: it finds the League of Legends client, opens the window, talks to the tray, and fetches data from the local client APIs. The **renderer** (under `src/`) is a React single-page application built with Vite; it presents the UI and calls into the preload bridge for data and actions.

### Main process (Electron)

* `electron/main/app.ts` bootstraps the application. It configures a dev-specific profile, creates the browser window, and wires up the tray, IPC handlers, auto-updater hooks, and the background services that poll the League client.【F:electron/main/app.ts†L1-L89】
* Background services live in `electron/services/`:
  * `lcuWatcher.ts` keeps an eye on the Riot `lockfile` to discover auth credentials and notifies the rest of the app when the client appears or disappears.【F:electron/services/lcuWatcher.ts†L1-L91】
  * `gameflow.service.ts` periodically calls the LCU REST API to track the current gameflow phase (e.g., Champ Select) and emits updates to the renderer.【F:electron/services/gameflow.service.ts†L1-L48】
  * `skins.service.ts` coordinates summoner lookup, owned skin/chroma retrieval, random selection logic, toggle state, and PATCH requests that apply skins back through the LCU API.【F:electron/services/skins.service.ts†L1-L206】
* IPC channels are registered in `electron/main/ipc/`. Each module exposes small handlers (e.g., `get-owned-skins`, `toggle-auto-roll`) and forwards service events (`skins`, `selection`, `summoner-icon`) to the renderer window.【F:electron/main/ipc/index.ts†L1-L19】【F:electron/main/ipc/skins.ipc.ts†L1-L32】
* `electron/preload/index.ts` exposes a type-safe API surface (`window.lcu`) that wraps `ipcRenderer` calls so the renderer can request data, subscribe to push updates, and trigger actions without breaking context isolation.【F:electron/preload/index.ts†L1-L65】

### Renderer (React + Vite)

* `src/main.tsx` hydrates the React app and pulls in the global stylesheet bundle from `src/styles/` (a collection of modular CSS files).【F:src/main.tsx†L1-L9】【F:src/styles/index.css†L1-L16】
* Routing is hash-based: `src/app/routes.tsx` declares `Home` and `Settings` pages rendered through `<RouterProvider>` in `AppShell`.【F:src/app/routes.tsx†L1-L8】【F:src/app/AppShell.tsx†L1-L6】
* **Home page:** Displays connection state, the current splash/chroma glow, and reroll buttons. It composes domain-specific hooks (`useConnection`, `useGameflow`, `useOwnedSkins`, `useSelection`, `useChromaColor`) to pull reactive data from the preload API.【F:src/pages/Home/Home.tsx†L1-L34】
* **Settings page:** Reuses the header and option toggles, syncing preferences with both localStorage and the Electron-side services.【F:src/pages/Settings/Settings.tsx†L1-L49】
* Components in `src/components/` are mostly presentational:
  * `layout/Header.tsx` renders navigation and the connection badge + summoner icon.【F:src/components/layout/Header.tsx†L1-L46】
  * `skin/SkinPreview.tsx` resolves splash art URLs via Data Dragon and applies chroma glow styling from `useChromaColor`.【F:src/components/skin/SkinPreview.tsx†L1-L34】
  * `controls/RerollControls.tsx` and `controls/OptionsPanel.tsx` wrap the preload API to trigger rerolls and toggles.【F:src/components/controls/RerollControls.tsx†L1-L43】【F:src/components/controls/OptionsPanel.tsx†L1-L40】
  * `overlays/MascotsLayer.tsx` lays decorative imagery over the UI.【F:src/components/overlays/MascotsLayer.tsx†L1-L47】
* Hooks under `src/features/hooks/` centralize all interactions with the preload API, so components remain declarative and side-effect free. For example, `useSelection` subscribes to selection events, and `useChromaColor` fetches chroma palettes from CommunityDragon when a chroma is active.【F:src/features/hooks/useSelection.ts†L1-L19】【F:src/features/hooks/useChromaColor.ts†L1-L48】

### Styling

CSS is split into themed modules (layout, header, nav, skin, options, etc.) that are combined by `index.css`. Tokens (colors, fonts, spacing) live in `src/styles/tokens.css`, giving the app its DPM.lol-inspired look-and-feel.【F:src/styles/index.css†L1-L16】

## Data flow at runtime

1. The main process watches for the League client and, when connected, populates services with the discovered credentials.【F:electron/main/app.ts†L27-L82】
2. Services fetch summoner, champion, skin, and chroma data and emit IPC events when they change.【F:electron/services/skins.service.ts†L73-L206】【F:electron/main/ipc/skins.ipc.ts†L1-L32】
3. The preload bridge forwards these events to the renderer, where React hooks subscribe and update component state.【F:electron/preload/index.ts†L6-L65】【F:src/features/api.ts†L1-L34】
4. User actions (reroll buttons, toggles) call back through the same bridge, invoking service methods that call the LCU API and persist option changes when needed.【F:src/components/controls/RerollControls.tsx†L17-L42】【F:src/components/controls/OptionsPanel.tsx†L1-L40】

## Getting oriented in development

* `npm run dev` starts the Vite dev server alongside Electron (see `vite.config.ts` and `electron-vite` integration) so you get hot reload in the renderer while the main process restarts on changes.
* `npm run build` compiles the renderer, TypeScript, and packages the app using `electron-builder`.
* Linting is provided through ESLint with the React + TypeScript plugin set (`npm run lint`).

## What to explore next

* **LCU APIs:** Read up on the official and community documentation for the League Client Update API to understand rate limits and endpoint shapes; this helps when expanding `SkinsService` to cover more features.
* **State management patterns:** Hooks currently wrap raw IPC calls. If the app grows, consider introducing React Query or Zustand for caching and derived data.
* **Testing:** There are no automated tests today; evaluating Jest/react-testing-library for renderer components and adding integration tests for services would be a good next step.
* **CI/CD:** The build script already publishes via `electron-builder --publish=always`. Investigate GitHub Actions workflows for lint/build/test so releases stay reliable.
* **Design system:** Tokens + CSS modules provide a base. Document them or migrate to CSS-in-JS/Tailwind if the component library expands.

Welcome aboard, and happy hacking!
