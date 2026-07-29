import { defineConfig, loadEnv, type Plugin } from "vite";
import path from "node:path";
import { readFileSync } from "node:fs";
import electron from "vite-plugin-electron/simple";
import react from "@vitejs/plugin-react";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

/**
 * Injecte la Content-Security-Policy dans index.html au moment du build.
 *
 * Pourquoi un meta tag et pas `onHeadersReceived` cote main : en production la
 * fenetre est chargee via `loadFile()`, donc sur `file://`. Aucun en-tete HTTP
 * n'est emis pour ce document, et `onHeadersReceived` ne se declenche jamais
 * pour lui — seul un meta tag s'applique.
 *
 * Pourquoi a la compilation et pas en statique : `connect-src` doit autoriser le
 * serveur de rooms, dont l'URL change selon l'environnement
 * (`VITE_ROOMS_SERVER_URL`). On la lit donc dans l'env du build.
 *
 * Applique uniquement au build : en dev, Vite a besoin de `unsafe-eval` et d'un
 * websocket HMR, et la CSP n'y protegerait rien d'utile.
 */
function cspPlugin(mode: string): Plugin {
  return {
    name: "skinpicker-csp",
    apply: "build",
    transformIndexHtml(html) {
      const env = loadEnv(mode, process.cwd(), "VITE_");
      const roomsUrl = env.VITE_ROOMS_SERVER_URL ?? "";

      // Socket.IO commence en HTTP long-polling puis bascule en WebSocket :
      // les deux schemes de la meme origine doivent etre autorises.
      const connectHosts = new Set<string>(["'self'"]);
      if (roomsUrl) {
        try {
          const u = new URL(roomsUrl);
          connectHosts.add(u.origin);
          connectHosts.add(`${u.protocol === "https:" ? "wss:" : "ws:"}//${u.host}`);
        } catch {
          throw new Error(
            `[csp] VITE_ROOMS_SERVER_URL invalide: ${JSON.stringify(roomsUrl)}`
          );
        }
      }

      const csp = [
        "default-src 'self'",
        "script-src 'self'",
        // 'unsafe-inline' : Tailwind et framer-motion injectent des <style>.
        // Les styles React `style={{...}}` passent par la propriete DOM et ne
        // sont pas concernes par la CSP.
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' data: https://fonts.gstatic.com",
        // Portraits de champions et icones de profil.
        "img-src 'self' data: blob: https://raw.communitydragon.org https://ddragon.leagueoflegends.com",
        `connect-src ${[...connectHosts].join(" ")}`,
        // Verrous : aucun plugin, aucune iframe, aucune reecriture de base URL,
        // et interdiction d'etre embarque.
        "object-src 'none'",
        "frame-src 'none'",
        "child-src 'none'",
        "base-uri 'none'",
        "form-action 'none'",
        "frame-ancestors 'none'",
        "worker-src 'self'",
      ].join("; ");

      return {
        html,
        tags: [
          {
            tag: "meta",
            attrs: {
              "http-equiv": "Content-Security-Policy",
              content: csp,
            },
            injectTo: "head-prepend",
          },
        ],
      };
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    cspPlugin(mode),
    react(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: "electron/main/app.ts",
        vite: {
          build: {
            rollupOptions: {
              external: ["bufferutil", "utf-8-validate"],
            },
          },
        },
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, "electron/preload/index.ts"),
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer:
        process.env.NODE_ENV === "test"
          ? // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
            undefined
          : {},
    }),
  ],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
}));
