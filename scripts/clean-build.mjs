import { rmSync } from "node:fs";

/**
 * Vide les dossiers de build avant de reconstruire.
 *
 * Pourquoi c'est necessaire : Vite vide `dist/` tout seul, mais PAS
 * `dist-electron/`, ou vite-plugin-electron ecrit le bundle du main sous un nom
 * hashe (app-<hash>.js). Chaque build y depose donc un nouveau chunk sans jamais
 * retirer les precedents. Comme electron-builder empaquete `dist-electron/**`,
 * tous ces bundles morts partaient dans l'installateur : 100 fichiers et 23 Mo
 * accumules depuis avril, pour ~0,4 Mo reellement utiles.
 */
// `dist` est vide par Vite lui-meme ; on ne le touche pas.
for (const dir of ["dist-electron", "release"]) {
  rmSync(dir, { recursive: true, force: true });
  console.log(`[clean] ${dir}`);
}
