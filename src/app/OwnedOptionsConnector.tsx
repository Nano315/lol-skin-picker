import { useCallback, useEffect, useSyncExternalStore } from "react";
import { computeChromaColor } from "@/features/chromaColor";
import { ownedOptionsStore } from "@/features/premade/ownedOptionsStore";
import { roomsClient, type GroupSkinOption } from "@/features/roomsClient";
import { colorCache } from "@/features/utils/colorCache";
import { useConnection } from "@/features/hooks/useConnection";
import { useOwnedSkins } from "@/features/hooks/useOwnedSkins";
import { useSelection } from "@/features/hooks/useSelection";

/** Laisse le temps aux rerolls rapides de se stabiliser avant de tout recalculer. */
const DEBOUNCE_MS = 300;

/**
 * Calcule les combinaisons skin/chroma possedees sur le champion verrouille et
 * les envoie au serveur de rooms.
 *
 * Deplace depuis `Premade.tsx` : ce calcul alimente la synergie cote serveur,
 * donc il conditionne Match Team, les badges de couleur et l'auto-apply. Tant
 * qu'il vivait dans la page, rejoindre une room puis naviguer vers Solo
 * suffisait a le neutraliser en silence — et le sidecar de draft, qui masque la
 * fenetre principale, rendait ce scenario courant.
 *
 * `joined` est lu sur `roomsClient` et non sur `useRooms` : ce hook porte son
 * propre etat et ses propres effets, l'instancier une seconde fois ici
 * dupliquerait ses envois.
 */
export function OwnedOptionsConnector() {
  const { status } = useConnection();
  const [selection] = useSelection();
  const skins = useOwnedSkins();
  const joined = useSyncExternalStore(
    useCallback((cb: () => void) => roomsClient.subscribe(cb), []),
    useCallback(() => roomsClient.isJoined(), [])
  );

  const isConnected = status === "connected";

  useEffect(() => {
    if (!joined || !isConnected || !selection.championId || !skins?.length) {
      // Hors room ou sans champion verrouille, un resultat conserve ne
      // correspondrait plus a rien — et serait relaye tel quel au sidecar.
      if (!joined) ownedOptionsStore.reset();
      return;
    }

    let isMounted = true;

    /**
     * Une seule requete de skin line par skin, partagee par tous ses chromas.
     *
     * La skin line ne depend QUE du skinId : la demander par couple
     * skin/chroma faisait 9 allers-retours IPC identiques pour un skin a 8
     * chromas. On memorise la promesse, pas le resultat, pour que les appels
     * concurrents se rattachent au meme vol.
     */
    const skinLineRequests = new Map<
      number,
      ReturnType<typeof window.lcu.getSkinLine>
    >();
    const getSkinLineOnce = (skinId: number) => {
      const pending = skinLineRequests.get(skinId);
      if (pending) return pending;
      const request = window.lcu.getSkinLine(skinId);
      skinLineRequests.set(skinId, request);
      return request;
    };

    async function computeOptionWithCache(
      championId: number,
      skinId: number,
      chromaId: number
    ): Promise<GroupSkinOption | null> {
      const cachedColor = colorCache.get(championId, skinId, chromaId);

      // Couleur et skin line en parallele : deux allers-retours distincts,
      // aucune raison de les serialiser.
      const [color, skinLineInfo] = await Promise.all([
        cachedColor
          ? Promise.resolve(cachedColor)
          : computeChromaColor({ championId, skinId, chromaId }),
        getSkinLineOnce(skinId),
      ]);

      if (color && !cachedColor) {
        colorCache.set(championId, skinId, chromaId, color);
      }

      return {
        skinId,
        chromaId,
        auraColor: color ?? null,
        skinLineId: skinLineInfo?.id,
        skinLineName: skinLineInfo?.name,
      };
    }

    async function computeAndSend() {
      if (!isMounted) return;

      ownedOptionsStore.patch({ isSyncing: true, progress: 0 });

      try {
        const computations: Array<{ skinId: number; chromaId: number }> = [];
        for (const s of skins) {
          if (s.championId !== selection.championId) continue;
          computations.push({ skinId: s.id, chromaId: 0 });
          for (const c of s.chromas) {
            computations.push({ skinId: s.id, chromaId: c.id });
          }
        }

        if (computations.length === 0) {
          ownedOptionsStore.patch({ options: [] });
          return;
        }

        let completed = 0;

        const promises = computations.map(async ({ skinId, chromaId }) => {
          const result = await computeOptionWithCache(
            selection.championId,
            skinId,
            chromaId
          );
          completed++;
          if (isMounted) {
            ownedOptionsStore.patch({
              progress: Math.round((completed / computations.length) * 100),
            });
          }
          return result;
        });

        const results = await Promise.allSettled(promises);
        if (!isMounted) return;

        const options = results
          .filter(
            (r): r is PromiseFulfilledResult<GroupSkinOption | null> =>
              r.status === "fulfilled"
          )
          .map((r) => r.value)
          .filter((opt): opt is GroupSkinOption => opt !== null);

        ownedOptionsStore.patch({ options });
        if (options.length > 0) {
          roomsClient.sendOwnedOptions({
            championId: selection.championId,
            championAlias: selection.championAlias,
            options,
          });
        }
      } finally {
        if (isMounted) {
          ownedOptionsStore.patch({ isSyncing: false, progress: 100 });
        }
      }
    }

    const debounceTimer = setTimeout(computeAndSend, DEBOUNCE_MS);

    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [
    joined,
    selection.championId,
    selection.championAlias,
    isConnected,
    skins,
  ]);

  return null;
}
