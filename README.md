# LoL Skin Picker

A tiny, modern Electron + React app that auto-picks and rerolls League of Legends skins (and chromas) during Champ Select. It seamlessly talks to the local LoL Client (LCU) and orchestrates multiplayer skin synchronization.

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

### 🤝 Multiplayer Rooms (New!)
* **Real-time Sync:** Create or join a lobby via a short code (e.g., `ABC123`).
* **Live Dashboard:** See your teammates' picks updating in real-time.
* **Skinergy & Group Reroll:** The app analyzes color palettes of all players to find matching "Synergies". The host can trigger a **Group Reroll** to harmonize the entire team's skins instantly.

### ⚙️ Core
* **Include default skin** toggle.
* **Tray Support:** Minimizes to tray when the client closes, restores when a game starts.
* **Persistence:** Settings and room preferences are stored locally.
* **Auto-updates:** Integrated with GitHub Releases.

---

## 🖼️ UI at a glance: The Bento Grid

The application uses a responsive Bento layout divided into smart panels:

1.  **Preview Card (Top-Left):** Large, rounded display of the current splash art with a dynamic chroma glow.
2.  **Details Card (Top-Right):** Live data showing current Game Phase, Champion Alias, and active Skin/Chroma names.
3.  **Actions Card (Bottom):** Context-aware controls. Shows Reroll buttons in solo mode, or Group Synergy controls when in a Room.
4.  **Rooms Tab:** A dedicated interface to manage the squad, copy invite codes, and visualize the team's loadout.

## ▶️ How it works

**LCU Watcher & Gameflow**
The app reads the lockfile to authenticate with the local League Client API (LCU). It polls for:
* Summoner identity & icon.
* Gameflow phase (Lobby, ChampSelect, InProgress...).
* Champion ownership & current selection.

**Real-time Multiplayer (Socket.io)**
* The app connects to a custom Node.js/Socket.io backend.
* **Events:** It emits `update-selection` when you change skins and listens for `room-state` updates to render teammates.
* **Synergy:** When the host clicks "Group Reroll", the server calculates the best matching skin for every player based on their owned inventory and broadcasts an `apply-skin` command.

**Data Sources**
* **CommunityDragon:** Used for chroma color analysis (hex codes) and assets.
* **Data Dragon:** Used for champion splash art.

## 🔁 Auto-updates

The app uses **electron-updater** to check your **GitHub Releases**.
* The app downloads/applies updates on next launch.
* Checks are performed automatically against the repository releases.

## 🔐 Disclaimer

* The app only talks to the local LoL Client (LCU) on `127.0.0.1` and the dedicated Rooms server.
* It changes only cosmetic selection (skins/chromas).
* You are responsible for compliance with Riot’s terms. This project is not endorsed by Riot.

## 🙌 Credits

* **CommunityDragon** for data & assets.
* **Data Dragon** for champion splash art.
* **Electron**, **React**, **Vite**, **Socket.io** and the awesome OSS ecosystem.

## Quick “How to use”

1.  **Launch:** Start the LoL Client and the App.
2.  **Solo:** Lock a champion. Use **Reroll** buttons or let **Auto-roll** decide.
3.  **Multiplayer:**
    * Go to the **Rooms** tab.
    * **Create** a room and share the code.
    * Wait for your friends to join and lock their champs.
    * As the host, use the **Group Reroll** dropdown to pick a color theme (e.g., "Blue", "Red", "Golden") and sync everyone!

Enjoy 💙
