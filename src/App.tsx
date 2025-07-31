import { useEffect, useState } from "react";

/*  Déclare l’API que le preload injecte dans window
    (sinon TypeScript râle). */
declare global {
  interface Window {
    lcu: {
      getStatus: () => Promise<string>;
      onStatus: (cb: (s: string) => void) => void;
    };
  }
}

export default function App() {
  const [status, setStatus] = useState<string>("checking");

  /* 1. état initial  •  2. abonnement temps-réel */
  useEffect(() => {
    window.lcu.getStatus().then(setStatus);
    window.lcu.onStatus(setStatus);
  }, []);

  const label =
    status === "connected"
      ? "✅ Connecté au client League"
      : status === "disconnected"
      ? "🔴 Client non détecté"
      : "⏳ Recherche du client…";

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white text-xl">
      {label}
    </div>
  );
}
