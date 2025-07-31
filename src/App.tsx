import { useEffect, useState } from "react";

declare global {
  interface Window {
    lcu: {
      getStatus: () => Promise<string>;
      onStatus: (cb: (s: string) => void) => void;
      getPhase: () => Promise<string>;
      onPhase: (cb: (p: string) => void) => void;
    };
  }
}

export default function App() {
  const [status, setStatus] = useState("checking");
  const [phase, setPhase] = useState("Unknown");

  /* initial + listeners */
  useEffect(() => {
    window.lcu.getStatus().then(setStatus);
    window.lcu.getPhase().then(setPhase);
    window.lcu.onStatus(setStatus);
    window.lcu.onPhase(setPhase);
  }, []);

  const statusLabel =
    status === "connected"
      ? "✅ LCU connecté"
      : status === "disconnected"
      ? "🔴 Client non détecté"
      : "⏳ Recherche du client…";

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
      <div className="text-xl">{statusLabel}</div>
      <div className="text-lg">
        Gameflow : <span className="font-mono">{phase}</span>
      </div>
    </div>
  );
}
