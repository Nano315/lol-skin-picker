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
    <div className="h-screen overflow-auto bg-black text-white p-6">
      <div className="text-xl mb-4">{statusLabel}</div>
      <div className="text-lg mb-4">
        Gameflow : <span className="font-mono">{phase}</span>
      </div>

      <div className="mt-4">
        <label className="inline-flex items-center gap-2 cursor-pointer">
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
            className="h-4 w-4"
          />
          Include default skin
        </label>
      </div>

      {skins.length > 0 && (
        <ul className="space-y-2">
          {skins.map((s) => (
            <li key={s.id}>
              <div className="font-semibold">{s.name}</div>
              {s.chromas.length > 0 ? (
                <ul className="ml-4 list-disc">
                  {s.chromas.map((c) => (
                    <li key={c.id}>{c.name}</li>
                  ))}
                </ul>
              ) : (
                <div className="ml-4 text-gray-400">Aucun chroma</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
