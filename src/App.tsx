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
      rerollSkin: () => Promise<void>;
    };
  }
}

export default function App() {
  const [status, setStatus] = useState("checking");
  const [phase, setPhase] = useState("Unknown");
  const [skins, setSkins] = useState<OwnedSkin[]>([]);
  const [includeDefault, setIncludeDefault] = useState(true);

  useEffect(() => {
    window.lcu.getStatus().then(setStatus);
    window.lcu.getPhase().then(setPhase);
    window.lcu.getSkins().then(setSkins);
    window.lcu.onStatus(setStatus);
    window.lcu.onPhase(setPhase);
    window.lcu.onSkins(setSkins);
    window.lcu.getIncludeDefault().then(setIncludeDefault);
  }, []);

  const statusLabel =
    status === "connected"
      ? "✅ LCU connecté"
      : status === "disconnected"
      ? "🔴 Client non détecté"
      : "⏳ Recherche du client…";

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

      {phase === "ChampSelect" && (
        <button onClick={() => window.lcu.rerollSkin()}>Reroll Skin</button>
      )}

      {skins.length > 0 && (
        <ul>
          {skins.map((s) => (
            <li key={s.id}>
              <div>{s.name}</div>
              {s.chromas.length > 0 ? (
                <ul>
                  {s.chromas.map((c) => (
                    <li key={c.id}>{c.name}</li>
                  ))}
                </ul>
              ) : (
                <div>Aucun chroma</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
