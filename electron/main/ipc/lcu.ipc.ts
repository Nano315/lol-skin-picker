import { ipcMain } from "electron";
import fetch from "node-fetch";
import type { LcuWatcher } from "../../services/lcuWatcher";
import { skinLineService } from "../../services/skinLineService";
import { logger } from "../../logger";

export function registerLcuIpc(lcu: LcuWatcher) {
  ipcMain.handle("get-lcu-status", () => lcu.status);

  ipcMain.handle("lcu:getIdentity", async () => {
    return lcu.getIdentity();
  });

  ipcMain.handle("lcu:getFriends", async () => {
    return lcu.getFriends();
  });

  // Skin Lines (Story 6.1)
  ipcMain.handle("lcu:getSkinLine", (_event, skinId: number) => {
    return skinLineService.getSkinLine(skinId);
  });

  ipcMain.handle("lcu:getSkinLines", () => {
    return skinLineService.getSkinLines();
  });

  // Chroma Color fetch via main process (fixes CORS issue)
  ipcMain.handle(
    "lcu:getChromaColor",
    async (
      _event,
      params: { championId: number; skinId: number; chromaId: number }
    ): Promise<string | null> => {
      const { championId, skinId, chromaId } = params;

      if (!chromaId) return null;

      const pickHex = (arr?: unknown): string | null =>
        Array.isArray(arr) && typeof arr[0] === "string" ? arr[0] : null;

      const hexToRgba = (h: string, alpha = 0.5): string | null => {
        const res = /^#?([0-9a-f]{6})$/i.exec(h);
        if (!res) return null;
        const int = parseInt(res[1], 16);
        const r = (int >> 16) & 255;
        const g = (int >> 8) & 255;
        const b = int & 255;
        return `rgba(${r},${g},${b},${alpha})`;
      };

      // 1) Try direct chroma endpoint
      try {
        const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/chromas/${chromaId}.json`;
        const response = await fetch(url);
        if (response.ok) {
          const data = (await response.json()) as Record<string, unknown>;
          const hex =
            pickHex(data?.colorsHexPrefixed) ||
            pickHex(data?.colorsHex) ||
            pickHex(data?.colors);
          if (hex) {
            return hexToRgba(hex);
          }
        }
      } catch (err) {
        logger.debug("[ChromaColor] Direct chroma fetch failed", chromaId, err);
      }

      // 2) Fallback via champion data
      if (!championId || !skinId) return null;

      try {
        type CChroma = { id: number; colors?: string[] };
        type CSkin = { id: number; chromas?: CChroma[] };
        type CChamp = { skins?: CSkin[] };

        const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${championId}.json`;
        const response = await fetch(url);
        if (!response.ok) return null;

        const champ = (await response.json()) as CChamp;
        const skin = champ.skins?.find((s) => s.id === skinId);
        const chroma = skin?.chromas?.find((c) => c.id === chromaId);
        const hex = chroma?.colors?.[0] || null;
        return hex ? hexToRgba(hex) : null;
      } catch (err) {
        logger.debug("[ChromaColor] Champion fallback failed", championId, err);
        return null;
      }
    }
  );
}
