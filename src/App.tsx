import { useEffect, useState } from "react";
import "./App.css";

/* ---------- types globaux ---------- */
type Selection = {
  championId: number;
  championAlias: string;
  skinId: number;
  chromaId: number;
};

declare global {
  interface OwnedSkin {
    id: number;
    name: string;
    chromas: { id: number; name: string }[];
  }
  interface Window {
    lcu: {
      getStatus: () => Promise<string>;
      onStatus: (cb: (s: string) => void) => void;
      getPhase: () => Promise<string>;
      onPhase: (cb: (p: string) => void) => void;
      getSkins: () => Promise<OwnedSkin[]>;
      onSkins: (cb: (s: OwnedSkin[]) => void) => void;

      getIncludeDefault: () => Promise<boolean>;
      toggleIncludeDefault: () => Promise<void>;

      getAutoRoll: () => Promise<boolean>;
      toggleAutoRoll: () => Promise<void>;

      rerollSkin: () => Promise<void>;
      rerollChroma: () => Promise<void>;

      getSelection: () => Promise<Selection>;
      onSelection: (cb: (s: Selection) => void) => void;

      getSummonerIcon: () => Promise<number>;
      onSummonerIcon: (cb: (id: number) => void) => void;
    };
  }
}

export default function App() {
  const [status, setStatus] = useState("checking");
  const [phase, setPhase] = useState("Unknown");
  const [skins, setSkins] = useState<OwnedSkin[]>([]);
  const [includeDefault, setIncludeDefault] = useState(true);
  const [autoRoll, setAutoRoll] = useState(true);

  const [selection, setSelection] = useState<Selection>({
    championId: 0,
    championAlias: "",
    skinId: 0,
    chromaId: 0,
  });

  const [iconId, setIconId] = useState(0);

  /* ---------- effets ---------- */
  useEffect(() => {
    window.lcu.getStatus().then(setStatus);
    window.lcu.getPhase().then(setPhase);
    window.lcu.getSkins().then(setSkins);

    window.lcu.getIncludeDefault().then(setIncludeDefault);
    window.lcu.getAutoRoll().then(setAutoRoll);

    window.lcu.getSelection().then(setSelection);
    window.lcu.getSummonerIcon().then(setIconId);

    /* listeners */
    window.lcu.onStatus(setStatus);
    window.lcu.onPhase(setPhase);
    window.lcu.onSkins(setSkins);
    window.lcu.onSelection(setSelection);
    window.lcu.onSummonerIcon(setIconId);
  }, []);

  /* ---------- données dérivées ---------- */
  const selSkin = skins.find((s) => s.id === selection.skinId);
  const selChroma = selSkin?.chromas.find((c) => c.id === selection.chromaId);
  const splashUrl =
    selection.skinId && selection.championAlias
      ? `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${
          selection.championAlias
        }_${selection.skinId - selection.championId * 1000}.jpg`
      : "";

  const displayedSkin = splashUrl || "/fallback-skin.png";

  const iconUrl = iconId
    ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${iconId}.jpg`
    : "";

  function connectionLabel(): string {
    if (status === "disconnected") return "Not connected to client";
    if (status === "checking") return "Searching for client…";

    /* connected */
    if (phase === "None") return "Connected to client";
    return phase; // ex: Lobby, ChampSelect, InProgress…
  }

  /* ---------- rendu ---------- */
  return (
    <div className="app">
      {/* ---------- header ---------- */}
      <header className="header">
        <div className="logo">Skin&nbsp;Picker</div>

        <div className="connection">
          <div className="state">{connectionLabel()}</div>

          {iconUrl && <img src={iconUrl} alt="summoner" className="avatar" />}
        </div>
      </header>

      <main className="main">
        <div className="skin-wrapper">
          <img
            src={displayedSkin}
            alt="current skin"
            className="skin-img"
            width="660"
            height="371"
          />
        </div>

        <div className="buttons">
          <div className="options-wrapper">
            <label>
              <input
                type="checkbox"
                checked={includeDefault}
                onChange={() =>
                  window.lcu
                    .toggleIncludeDefault()
                    .then(() =>
                      window.lcu.getIncludeDefault().then(setIncludeDefault)
                    )
                }
              />
              Include default skin
            </label>
            <label>
              <input
                type="checkbox"
                checked={autoRoll}
                onChange={() =>
                  window.lcu
                    .toggleAutoRoll()
                    .then(() => window.lcu.getAutoRoll().then(setAutoRoll))
                }
              />
              Auto roll on champion lock
            </label>
          </div>

          {phase === "ChampSelect" && (
            <div className="reroll-wrapper">
              <button
                onClick={() =>
                  window.lcu
                    .rerollSkin()
                    .then(() => window.lcu.getSelection().then(setSelection))
                }
              >
                Reroll Skin
              </button>

              {selSkin?.chromas.length ? (
                <button
                  onClick={() =>
                    window.lcu
                      .rerollChroma()
                      .then(() => window.lcu.getSelection().then(setSelection))
                  }
                >
                  Reroll Chroma
                </button>
              ) : null}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
