import { useEffect, useState } from "react";

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
      toggleAutoRoll: () => Promise<void>;
      getAutoRoll: () => Promise<boolean>;
      rerollSkin: () => Promise<void>;
      rerollChroma: () => Promise<void>;
      getSelection: () => Promise<{ skinId: number; chromaId: number }>;
      onSelection: (
        cb: (s: { skinId: number; chromaId: number }) => void
      ) => void;
    };
  }
}

export default function App() {
  const [status, setStatus] = useState("checking");
  const [phase, setPhase] = useState("Unknown");
  const [skins, setSkins] = useState<OwnedSkin[]>([]);
  const [includeDefault, setIncludeDefault] = useState(true);
  const [selection, setSelection] = useState<{
    skinId: number;
    chromaId: number;
  }>({ skinId: 0, chromaId: 0 });
  const [autoRoll, setAutoRoll] = useState(true);

  useEffect(() => {
    window.lcu.getStatus().then(setStatus);
    window.lcu.getPhase().then(setPhase);
    window.lcu.getSkins().then(setSkins);
    window.lcu.onStatus(setStatus);
    window.lcu.onPhase(setPhase);
    window.lcu.onSkins(setSkins);
    window.lcu.getIncludeDefault().then(setIncludeDefault);
    window.lcu.getSelection().then(setSelection);
    window.lcu.onSelection(setSelection);
    window.lcu.getAutoRoll().then(setAutoRoll);
  }, []);

  const statusLabel =
    status === "connected"
      ? "✅ LCU connecté"
      : status === "disconnected"
      ? "🔴 Client non détecté"
      : "⏳ Recherche du client…";

  const selSkin = skins.find((s) => s.id === selection.skinId);
  const selChroma = selSkin?.chromas.find((c) => c.id === selection.chromaId);

  return (
    <div>
      <div>{statusLabel}</div>
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
          Skin sélectionné&nbsp;: <span>{selSkin.name}</span>
          {selChroma && (
            <>
              {" "}
              — Chroma&nbsp;: <span>{selChroma.name}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
