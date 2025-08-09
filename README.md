# LoL Skin Picker

A tiny Electron + React app that auto-picks and rerolls League of Legends skins (and chromas) during Champ Select. It talks to the local LoL Client (LCU) and uses CommunityDragon for art & chroma data.

> ⚠️ Not affiliated with or endorsed by Riot Games. Use at your own risk.

### 🎨 Design & purpose

The visual design is **heavily inspired by the art direction of DPM.lol**.
This app is a **personal project** created to showcase my skills to the DPM.lol team with the hope of securing an **alternance (apprenticeship)** there. It is not an official DPM.lol product.

---

## ✨ Features

* Auto-roll on champion lock (optional)
* “Include default skin” toggle
* Manual **Reroll Skin** & **Reroll Chroma** buttons
  *(buttons appear only after you’ve selected/locked a champion)*
* Shows the current skin splash (centered, rounded corners)
* Dynamic glow around the splash based on current chroma color
* Shows your summoner icon
* Minimize to tray when the client closes, restore when it opens
* Option persistence (stored locally)
* Windows installer (NSIS) + auto-updates from GitHub Releases

## 🖼️ UI at a glance

* **Header:** “Skin Picker” (left), connection state (center/right), summoner icon (right).
* **Main:** current skin splash (660×371, radius 40px) with chroma glow.
* **Reroll buttons:** centered under the splash (appear after champion is chosen).
* **Option toggles:** stacked bottom-left with colored status dots (green/red).

## ▶️ How it works (quick)

**LCU watcher** reads the lockfile to authenticate and polls:

* current summoner (icon)
* current champion id
* owned skins & chromas for that champion
* your manual skin/chroma selection (kept in sync)

**Randomization** honors your toggles:

* Exclude the default skin if you want
* Auto-roll on champion lock if enabled, otherwise use the buttons

**Art & colors**

* Splashes from **Data Dragon**
* Chroma colors from **CommunityDragon** (`/chromas/:id.json` or fallback champion JSON)

## 🔁 Auto-updates

The app uses **electron-updater** (via `autoUpdater`) to check your **GitHub Releases**.

* Publish a new release with a higher semver (`1.0.4`, `1.1.0`, …) and attach the Windows installer.
* The app downloads/applies updates on next launch (or when you trigger checks) and prompts to restart.
* Auto-update reads the repo/owner from your `publish` config—make sure releases are **public**.

## 🔐 Disclaimer

* The app only talks to the local LoL Client (LCU) on `127.0.0.1`.
* It changes only cosmetic selection (skins/chromas).
* You are responsible for compliance with Riot’s terms. This project is not endorsed by Riot.

## 🙌 Credits

* **CommunityDragon** for data & assets
* **Data Dragon** for champion splash art
* **Electron**, **React**, **Vite** and the awesome OSS ecosystem

## Quick “How to use”

1. Start the LoL Client (or launch the app first — it’ll hide until the client appears).
2. Lock a champion in Champ Select.
3. The app shows the current splash with a chroma glow (if any).
4. Use **Reroll Skin** / **Reroll Chroma** or let **Auto-roll** do it for you.
5. Toggle **Include default skin** and **Auto roll** (bottom-left).
   Your choices are saved and persist between restarts.

Enjoy 💙
