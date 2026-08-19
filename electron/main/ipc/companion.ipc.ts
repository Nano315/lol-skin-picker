import { ipcMain, screen } from "electron";
import {
  getCompanionPrefs,
  setCompanionPrefs,
} from "../companionSettings";
import { broadcastExcept } from "../windows/broadcast";
import { dismissCompanion } from "../windows/companionDismissal";
import { getActiveHotkeys } from "../hotkeys";

/**
 * Surface IPC du sidecar de draft.
 *
 * Les preferences vivent dans `companionSettings` : ce module ne fait que les
 * exposer au renderer. Il ne touche ni aux fenetres ni aux raccourcis — la
 * visibilite est decidee par `computePresentation` et appliquee par `app.ts`,
 * qui s'abonne aux changements de preference.
 */

export function registerCompanionIpc() {
  ipcMain.handle("companion:getEnabled", () => getCompanionPrefs().enabled);

  ipcMain.handle("companion:setEnabled", async (_e, value: unknown) => {
    const { enabled } = await setCompanionPrefs({ enabled: value === true });
    return enabled;
  });

  /**
   * Fermeture depuis la croix du sidecar : on masque pour cette draft, on ne
   * desactive pas l'option. C'est une ENTREE de la machine a etats, pas un
   * `hide()` direct — sinon, en pleine champ select ou la fenetre principale
   * est deja masquee, la croix laissait les DEUX fenetres invisibles et rien
   * ne recalculait avant le prochain changement de phase.
   */
  ipcMain.handle("companion:hide", () => {
    dismissCompanion();
  });

  /* ---------- Raccourcis globaux ---------- */

  ipcMain.handle(
    "companion:getHotkeysEnabled",
    () => getCompanionPrefs().hotkeysEnabled
  );

  ipcMain.handle("companion:setHotkeysEnabled", async (_e, value: unknown) => {
    const { hotkeysEnabled } = await setCompanionPrefs({
      hotkeysEnabled: value === true,
    });
    return hotkeysEnabled;
  });

  /** Accelerateurs reellement enregistres — l'UI n'affiche que ceux-la. */
  ipcMain.handle("companion:getHotkeys", () => getActiveHotkeys());

  /**
   * Faut-il proposer le sidecar a l'utilisateur ?
   *
   * Un seul ecran ET option desactivee. Sur deux ecrans le probleme que
   * resout le sidecar n'existe pas — on ne va pas vanter une fonctionnalite a
   * quelqu'un qui n'en a pas besoin.
   */
  ipcMain.handle("companion:shouldSuggest", () => {
    if (getCompanionPrefs().enabled) return false;
    return screen.getAllDisplays().length === 1;
  });

  registerRoomRelay();
}

/**
 * Relais premade entre les deux fenetres.
 *
 * La fenetre principale reste seule proprietaire des sockets Socket.IO — deux
 * sockets identity pour le meme puuid dedoubleraient la presence cote serveur.
 * Le sidecar ne parle donc jamais au serveur de rooms : il lit un etat publie
 * par la fenetre principale, et lui renvoie des intentions.
 *
 * Consequence de securite qui vaut d'etre notee : le `memberToken` ne transite
 * jamais par ce canal. Les actions sont executees par la fenetre principale
 * avec son propre token — le sidecar ne peut rien emettre que la fenetre
 * principale n'aurait pas pu emettre elle-meme.
 */
function registerRoomRelay() {
  /**
   * Dernier etat publie. Sert a hydrater le sidecar a son ouverture : il peut
   * apparaitre en plein milieu d'une room, longtemps apres le dernier push de
   * room-state, et attendre le suivant l'afficherait vide sans raison.
   */
  let cachedRoom: unknown = null;

  ipcMain.handle("companion:publishRoom", (event, state: unknown) => {
    cachedRoom = state ?? null;
    // Pas de retour a l'envoyeur : la fenetre principale est la seule a
    // publier, et elle n'ecoute pas `companion:room`.
    broadcastExcept(event.sender.id, "companion:room", cachedRoom);
  });

  ipcMain.handle("companion:getRoom", () => cachedRoom);

  ipcMain.handle("companion:action", (event, action: unknown) => {
    // Idem en sens inverse : l'emetteur est le sidecar, le destinataire la
    // fenetre principale qui detient le memberToken.
    broadcastExcept(event.sender.id, "companion:action", action);
  });
}
