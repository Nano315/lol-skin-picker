import { loadSettings, saveSettings } from "./settings";

/**
 * Preferences du sidecar de draft, en un seul exemplaire.
 *
 * Il y en avait deux : un miroir mutable dans `app.ts` (parce que
 * `applyPresentation` doit etre synchrone et ne peut pas `await loadSettings()`
 * a chaque event de phase) et des `loadSettings()` disperses dans les handlers
 * IPC. Les deux etaient recolles par un callback `onCompanionEnabledChange`
 * pousse a travers `registerAllIpc` — donc tout futur ecrivain qui n'emprunte
 * pas exactement ce chemin laissait le miroir perime, et la machine a etats
 * decidait sur une valeur qui n'existait plus sur le disque.
 *
 * Ici la valeur en memoire EST la source de verite du process principal ; le
 * disque n'est lu qu'une fois au demarrage. Meme forme que
 * `readyCheck.setAutoAccept` / `wards.initFromSettings`, qui resolvent deja ce
 * probleme pour leurs propres preferences.
 */

/** Defaut a false : on n'impose pas une fenetre supplementaire aux installs existantes. */
const DEFAULT_ENABLED = false;

/**
 * Defaut a true, mais sans effet tant que le sidecar est desactive : les
 * raccourcis ne s'enregistrent que quand la fenetre est affichee. Personne ne
 * se retrouve donc avec Alt+S capte sans l'avoir demande — activer le sidecar
 * est l'opt-in, et ce reglage reste la pour le desactiver en cas de conflit
 * avec une autre application.
 */
const DEFAULT_HOTKEYS_ENABLED = true;

export type CompanionPrefs = {
  enabled: boolean;
  hotkeysEnabled: boolean;
};

let prefs: CompanionPrefs = {
  enabled: DEFAULT_ENABLED,
  hotkeysEnabled: DEFAULT_HOTKEYS_ENABLED,
};

type Listener = (next: CompanionPrefs) => void;
const listeners = new Set<Listener>();

/** Lecture synchrone — c'est tout l'interet du cache. */
export function getCompanionPrefs(): CompanionPrefs {
  return prefs;
}

/**
 * A appeler une fois au demarrage, AVANT le premier calcul de presentation :
 * sinon un lancement en pleine champ select ouvrirait la fenetre principale au
 * lieu du sidecar.
 */
export async function initCompanionPrefs(): Promise<void> {
  const settings = await loadSettings();
  prefs = {
    enabled: settings.companionEnabled ?? DEFAULT_ENABLED,
    hotkeysEnabled: settings.companionHotkeysEnabled ?? DEFAULT_HOTKEYS_ENABLED,
  };
}

/**
 * Met a jour la valeur en memoire, persiste, puis notifie.
 *
 * L'ordre compte : les abonnes (dont `applyPresentation`) doivent voir la
 * nouvelle valeur, pas relire le disque pour la retrouver.
 */
export async function setCompanionPrefs(
  patch: Partial<CompanionPrefs>
): Promise<CompanionPrefs> {
  prefs = { ...prefs, ...patch };

  await saveSettings({
    ...(patch.enabled !== undefined ? { companionEnabled: prefs.enabled } : {}),
    ...(patch.hotkeysEnabled !== undefined
      ? { companionHotkeysEnabled: prefs.hotkeysEnabled }
      : {}),
  });

  for (const listener of listeners) listener(prefs);
  return prefs;
}

/** S'abonner aux changements. Renvoie la fonction de desabonnement. */
export function onCompanionPrefsChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
