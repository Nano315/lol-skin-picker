import { useEffect } from "react";
import { api } from "../api";
import { usePrefs } from "./usePrefs";

export function useSyncPrefsWithBackend() {
  const { read } = usePrefs();

  useEffect(() => {
    // includeDefault
    const storedIncludeDefault = read("includeDefault");
    if (storedIncludeDefault !== null) {
      api.setIncludeDefault(storedIncludeDefault);
    }

    // autoRoll
    const storedAutoRoll = read("autoRoll");
    if (storedAutoRoll !== null) {
      api.setAutoRoll(storedAutoRoll);
    }
  }, [read]);
}
