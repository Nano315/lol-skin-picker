import { BrowserWindow } from "electron";

/**
 * Envoie un event a TOUTES les fenetres vivantes.
 *
 * Les events domaine partaient jusqu'ici vers `getMainWindow()` uniquement.
 * Avec une seconde fenetre (le sidecar de draft), ce ciblage devient un bug
 * silencieux : la fenetre companion ne recoit jamais `selection` ni
 * `gameflow-phase` et affiche un etat fige, sans la moindre erreur.
 *
 * Note : seuls les events PUSH ont besoin de ca. Les appels `invoke` du
 * preload repondent deja a n'importe quelle fenetre — verifie au spike.
 */
export function broadcast(channel: string, ...args: unknown[]): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (win.isDestroyed()) continue;
    win.webContents.send(channel, ...args);
  }
}

/**
 * Comme `broadcast`, mais sans renvoyer l'event a la fenetre qui l'a emis.
 *
 * Les canaux de relais (une fenetre publie, l'autre consomme) n'ont pas de
 * destinataire a nommer, mais ils ont un NON-destinataire evident : l'emetteur.
 * Sans ca, chaque publication de room repayait une serialisation structuree
 * complete vers la fenetre qui venait tout juste de l'envoyer, pour un event
 * que personne n'y ecoute.
 *
 * @param senderId `event.sender.id` du handler IPC.
 */
export function broadcastExcept(
  senderId: number,
  channel: string,
  ...args: unknown[]
): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (win.isDestroyed()) continue;
    if (win.webContents.id === senderId) continue;
    win.webContents.send(channel, ...args);
  }
}
