/**
 * Renvoie EXACTEMENT la meme couleur que useChromaColor,
 * mais dans une fonction utilitaire async reutilisable.
 *
 * Uses IPC to fetch from main process (fixes CORS issues with CDragon).
 */
export async function computeChromaColor(params: {
  championId: number;
  skinId: number;
  chromaId: number;
}): Promise<string | null> {
  // Delegate to main process via IPC to avoid CORS issues
  return window.lcu.getChromaColor(params);
}
