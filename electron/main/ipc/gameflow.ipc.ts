import { ipcMain } from "electron";
import type { GameflowService } from "../../services/gameflow.service";
import { broadcast } from "../windows/broadcast";

export function registerGameflowIpc(gameflow: GameflowService) {
  ipcMain.handle("get-gameflow-phase", () => gameflow.phase);

  // Broadcast et non plus ciblage de la fenetre principale : le sidecar de
  // draft doit voir les changements de phase, sinon il reste fige sans erreur.
  gameflow.on("phase", (phase) => {
    broadcast("gameflow-phase", phase);
  });
}
