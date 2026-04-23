import { useCallback, useEffect, useState } from "react";
import { updatesApi } from "@/features/api";

const INITIAL_STATE: UpdateState = {
  status: "idle",
  currentVersion: "",
  newVersion: null,
  channel: null,
  percent: null,
  errorMessage: null,
};

/**
 * Source unique pour la pastille in-app : recupere l'etat courant au mount
 * (utile apres un reload du renderer alors que le main process a deja un
 * etat etabli) puis s'abonne aux broadcasts emis par electron-updater
 * cote main (cf. updaterHooks dans tray.ts).
 *
 * Pas de timer cote renderer : le main process declenche deja un check
 * 10s apres le boot et toutes les 4h (cf. app.ts). On expose juste
 * `recheck()` pour le bouton "Verifier" du popup.
 */
export function useUpdateAvailability() {
  const [state, setState] = useState<UpdateState>(INITIAL_STATE);

  useEffect(() => {
    let mounted = true;
    updatesApi.getState().then((s) => {
      if (mounted) setState(s);
    });
    const unsub = updatesApi.onStatus((s) => setState(s));
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  const recheck = useCallback(() => updatesApi.check(), []);
  const download = useCallback(() => updatesApi.download(), []);
  const install = useCallback(() => updatesApi.install(), []);

  return { state, recheck, download, install };
}
