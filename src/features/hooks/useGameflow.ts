import { useEffect, useState } from "react";
import { api } from "../api";

export function useGameflow() {
  const [phase, setPhase] = useState("Unknown");

  useEffect(() => {
    api.getPhase().then(setPhase);
    const off = api.onPhase(setPhase);
    return () => { if (typeof off === "function") off(); };
  }, []);

  return phase;
}
