import { useEffect, useState } from "react";
import { companionApi } from "@/features/api";

/**
 * Le sidecar vaut-il la peine d'etre propose a cet utilisateur ?
 *
 * La reponse vient du main process, seul a connaitre le nombre d'ecrans : un
 * seul ecran ET option encore desactivee. Sur deux ecrans le probleme que
 * resout le sidecar n'existe pas, et vanter une fonctionnalite a quelqu'un qui
 * n'en a pas besoin est le meilleur moyen de lui apprendre a ignorer les
 * infobulles.
 *
 * `active` evite d'interroger le main en permanence : l'appelant ne l'active
 * que dans le contexte ou la suggestion aurait un sens.
 */
export function useCompanionSuggestion(active: boolean): boolean {
  const [suggest, setSuggest] = useState(false);

  useEffect(() => {
    if (!active) {
      setSuggest(false);
      return;
    }

    let cancelled = false;
    void companionApi
      .shouldSuggest()
      .then((value) => {
        if (!cancelled) setSuggest(value);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [active]);

  return suggest;
}
