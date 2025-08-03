import { useEffect, useState } from "react";

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

  const iconUrl = iconId
    ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${iconId}.jpg`
    : "";

  /* ---------- rendu ---------- */
  return (
    <div>
      <div className="flex items-center gap-3 text-xl">
        {iconUrl && (
          <img src={iconUrl} alt="icon" className="w-10 h-10 rounded" />
        )}
        <span>
          {status === "connected"
            ? "✅ LCU connecté"
            : status === "disconnected"
            ? "🔴 Client non détecté"
            : "⏳ Recherche du client…"}
        </span>
      </div>

      <div>
        Gameflow : <span>{phase}</span>
      </div>

      <div>
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
      </div>

      <div>
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
        <div>
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

      {selSkin && (
        <div>
          <div>
            Skin sélectionné&nbsp;: <span>{selSkin.name}</span>
            {selChroma && (
              <>
                {" "}
                — Chroma&nbsp;: <span>{selChroma.name}</span>
              </>
            )}
          </div>

          {splashUrl && <img src={splashUrl} alt="Skin splash" />}
        </div>
      )}
    </div>
  );
}
