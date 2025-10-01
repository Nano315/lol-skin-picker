import { useEffect, useState } from "react";
import { api } from "../api";

export function useConnection() {
  const [status, setStatus] = useState("checking");
  const [iconId, setIconId] = useState(0);

  useEffect(() => {
    let mounted = true;

    api.getStatus().then((v) => mounted && setStatus(v));
    api.getSummonerIcon().then((v) => mounted && setIconId(v));

    const off1 = api.onStatus(setStatus);
    const off2 = api.onSummonerIcon(setIconId);

    return () => {
      mounted = false;
      if (typeof off1 === "function") off1();
      if (typeof off2 === "function") off2();
    };
  }, []);

  return { status, iconId };
}
