import { useEffect, useState } from "react";
import "./App.css";
import GradientText from "./components/GradientText/GradientText";
import { faPalette, faDice } from "@fortawesome/free-solid-svg-icons";

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

/* ---------- util ---------- */
const hexToRgba = (h: string, alpha = 0.5) => {
  const res = /^#?([0-9a-f]{6})$/i.exec(h);
  if (!res) return null;
  const int = parseInt(res[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
};

export default function App() {
  /* -------- états -------- */
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
  const [chromaColor, setChromaColor] = useState<string | null>(null);

  /* -------- helpers persistance (localStorage) -------- */
  const savePref = (k: "includeDefault" | "autoRoll", v: boolean) =>
    localStorage.setItem(`pref-${k}`, String(v));
  const readPref = (k: "includeDefault" | "autoRoll") => {
    const raw = localStorage.getItem(`pref-${k}`);
    return raw !== null ? raw === "true" : null;
  };

  /* -------- actions -------- */
  const handleToggleInclude = () => {
    window.lcu
      .toggleIncludeDefault()
      .then(() => window.lcu.getIncludeDefault())
      .then((val) => {
        setIncludeDefault(val);
        savePref("includeDefault", val);
      });
  };

  const handleToggleAuto = () => {
    window.lcu
      .toggleAutoRoll()
      .then(() => window.lcu.getAutoRoll())
      .then((val) => {
        setAutoRoll(val);
        savePref("autoRoll", val);
      });
  };

  /* ---------- effets init ---------- */
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

    /* appliquer préférences stockées */
    Promise.all([
      window.lcu.getIncludeDefault(),
      window.lcu.getAutoRoll(),
    ]).then(([incSrv, autoSrv]) => {
      const incPref = readPref("includeDefault");
      const autoPref = readPref("autoRoll");

      if (incPref !== null && incPref !== incSrv) {
        window.lcu
          .toggleIncludeDefault()
          .then(() => setIncludeDefault(incPref));
      } else setIncludeDefault(incSrv);

      if (autoPref !== null && autoPref !== autoSrv) {
        window.lcu.toggleAutoRoll().then(() => setAutoRoll(autoPref));
      } else setAutoRoll(autoSrv);
    });
  }, []);

  /* ---------- chroma color ---------- */
  useEffect(() => {
    async function fetchColor() {
      if (!selection.chromaId) {
        setChromaColor(null);
        return;
      }

      const pickHex = (arr?: unknown) =>
        Array.isArray(arr) && typeof arr[0] === "string"
          ? (arr[0] as string)
          : null;

      /* 1) fichier chroma direct */
      try {
        const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/chromas/${selection.chromaId}.json`;
        const data = await fetch(url).then((r) => (r.ok ? r.json() : null));
        const hex =
          pickHex(data?.colorsHexPrefixed) ||
          pickHex(data?.colorsHex) ||
          pickHex(data?.colors);
        if (hex) {
          setChromaColor(hexToRgba(hex));
          return;
        }
      } catch {
        /* ignore */
      }

      /* 2) fallback via champion */
      if (!selection.championId || !selection.skinId) {
        setChromaColor(null);
        return;
      }

      try {
        type CChroma = { id: number; colors?: string[] };
        type CSkin = { id: number; chromas?: CChroma[] };
        type CChamp = { skins?: CSkin[] };

        const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${selection.championId}.json`;
        const champ: CChamp = await fetch(url).then((r) => r.json());
        const skin = champ.skins?.find((s) => s.id === selection.skinId);
        const chroma = skin?.chromas?.find((c) => c.id === selection.chromaId);
        const hex = pickHex(chroma?.colors);
        setChromaColor(hex ? hexToRgba(hex) : null);
      } catch {
        setChromaColor(null);
      }
    }
    fetchColor();
  }, [selection.championId, selection.skinId, selection.chromaId]);

  /* ---------- données dérivées ---------- */
  const splashUrl =
    selection.skinId && selection.championAlias
      ? `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${
          selection.championAlias
        }_${selection.skinId - selection.championId * 1000}.jpg`
      : "";
  const displayedSkin = splashUrl || "/fallback-skin.png";

  const iconUrl = iconId
    ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${iconId}.jpg`
    : "/fallback-icon.png";

  const connectionLabel = () => {
    if (status === "disconnected" || phase === "Unknown")
      return "Not connected to client";
    if (status === "checking") return "Searching for client…";
    return phase === "None" ? "Connected to client" : phase;
  };

  /* ---------- rendu ---------- */
  return (
    <div className="app">
      {/* ---------- header ---------- */}
      <header className="header">
        <div className="logo">Skin Picker</div>

        <div className="connection">
          <div className="state">{connectionLabel()}</div>
          {iconUrl && <img src={iconUrl} alt="summoner" className="avatar" />}
        </div>
      </header>

      <main className="main">
        {/* skin affiché */}
        <div
          className="skin-wrapper"
          style={
            chromaColor
              ? { boxShadow: `1px 1px 111.3px 50px ${chromaColor}` }
              : undefined
          }
        >
          <img
            src={displayedSkin}
            alt="current skin"
            className="skin-img"
            width="660"
            height="371"
          />
        </div>

        {/* -------- reroll (centre sous l'image) -------- */}
          <div className="reroll-wrapper">
            {/* ---- bouton skin ---- */}
            <button
              className="reroll-btn"
              onClick={() =>
                window.lcu
                  .rerollSkin()
                  .then(() => window.lcu.getSelection().then(setSelection))
              }
            >
              <GradientText
                className="reroll-text"
                animationSpeed={6}
                colors={[
                  "#ffffff",
                  "#a3a3a3ff",
                  "#ffffff",
                  "#a3a3a3ff",
                  "#ffffff",
                ]}
                icon={faDice}
                iconSize={"1.9em"}
                gap={"1em"}
              >
                Reroll Skin
              </GradientText>
            </button>

            {/* ---- bouton chroma (affiché seulement si chromas) ---- */}
            {!skins.find((s) => s.id === selection.skinId)?.chromas.length ? (
              <button
                className="reroll-btn"
                onClick={() =>
                  window.lcu
                    .rerollChroma()
                    .then(() => window.lcu.getSelection().then(setSelection))
                }
              >
                <GradientText
                  className="reroll-text"
                  animationSpeed={6}
                  colors={[
                    "#6248FF",
                    "#E5FF48",
                    "#FF48ED",
                    "#48BDFF",
                    "#6248FF",
                  ]}
                  icon={faPalette}
                  iconSize={"1.9em"}
                  gap={"1em"}
                >
                  Reroll Chroma
                </GradientText>
              </button>
            ) : null}
          </div>

        {/* -------- options (fixé bas-gauche) -------- */}
        <div className="options-wrapper">
          <label className="option">
            <input
              type="checkbox"
              checked={includeDefault}
              onChange={handleToggleInclude}
            />
            <span className="dot" />
            <span className="txt">Include default skin</span>
          </label>

          <label className="option">
            <input
              type="checkbox"
              checked={autoRoll}
              onChange={handleToggleAuto}
            />
            <span className="dot" />
            <span className="txt">Auto roll on champion lock</span>
          </label>
        </div>
      </main>
    </div>
  );
}
