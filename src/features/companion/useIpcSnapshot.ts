import { useEffect, useState } from "react";

/**
 * "Lis la valeur courante, puis suis ses changements" — le squelette commun a
 * tous les etats que le sidecar recoit du main process.
 *
 * Il etait recopie dans chaque hook companion : meme `useState`, meme drapeau
 * `cancelled`, meme `.catch(() => {})`, meme desabonnement. Trois copies pour
 * une seule idee, et l'anti-ecrasement ci-dessous n'existait que dans l'une
 * d'elles.
 *
 * L'hydratation et l'abonnement sont en course : `read()` est un aller-retour
 * IPC, un push peut arriver avant sa resolution. La reponse de `read()` est
 * alors PERIMEE, et l'appliquer ferait reculer l'affichage. On s'abonne donc en
 * premier et on laisse toujours gagner le push.
 *
 * `read` et `subscribe` doivent etre stables (les methodes de `companionApi`
 * sont des fonctions de module, donc elles le sont).
 */
export function useIpcSnapshot<T>(
  read: () => Promise<T>,
  subscribe: (cb: (value: T) => void) => () => void,
  initial: T
): T {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    let cancelled = false;
    let pushed = false;

    const unsub = subscribe((next) => {
      pushed = true;
      setValue(next);
    });

    void read()
      .then((current) => {
        if (!cancelled && !pushed) setValue(current);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      unsub();
    };
  }, [read, subscribe]);

  return value;
}
