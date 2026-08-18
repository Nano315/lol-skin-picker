/**
 * Tray menu tests — centres sur le toggle Show/Hide App.
 *
 * Regression visee : le handler du menu se basait sur `isFocused()`, or
 * ouvrir le menu du tray (ou cliquer sur son icone) donne le focus au shell
 * Windows. La fenetre etait donc toujours vue comme "non focus" et "Hide App"
 * re-affichait la fenetre au lieu de la masquer.
 *
 * Les fakes ci-dessous reproduisent ce comportement : `isFocused()` renvoie
 * toujours false, comme au moment reel du clic.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

type MenuItemTemplate = { label?: string; click?: () => void; type?: string };

const state = vi.hoisted(() => ({
  templates: [] as MenuItemTemplate[][],
  trayHandlers: new Map<string, () => void>(),
}));

vi.mock("electron", () => {
  class FakeTray {
    setToolTip = vi.fn();
    setContextMenu = vi.fn();
    on(event: string, cb: () => void) {
      state.trayHandlers.set(event, cb);
    }
  }
  return {
    app: {
      isPackaged: false,
      getVersion: () => "9.9.9",
      getAppPath: () => "/fake-app",
    },
    Menu: {
      buildFromTemplate: (template: MenuItemTemplate[]) => {
        state.templates.push(template);
        return template;
      },
    },
    Tray: FakeTray,
    nativeImage: { createFromPath: () => ({}) },
    dialog: { showMessageBox: vi.fn(), showErrorBox: vi.fn() },
  };
});

vi.mock("node:fs", () => ({
  default: { existsSync: () => true },
  existsSync: () => true,
}));

vi.mock("../../logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock("../../main/telemetry", () => ({ track: vi.fn() }));

vi.mock("../../utils/fetchWithTimeout", () => ({
  fetchWithTimeout: vi.fn(),
}));

import { setupTray } from "../../main/windows/tray";

function makeWindow(initial: { visible?: boolean; minimized?: boolean } = {}) {
  const listeners = new Map<string, Array<() => void>>();
  const win = {
    visible: initial.visible ?? true,
    minimized: initial.minimized ?? false,
    isVisible: () => win.visible,
    isMinimized: () => win.minimized,
    isDestroyed: () => false,
    // Le shell Windows a le focus des qu'on interagit avec le tray.
    isFocused: vi.fn(() => false),
    show: vi.fn(() => {
      win.visible = true;
      win.emit("show");
    }),
    hide: vi.fn(() => {
      win.visible = false;
      win.emit("hide");
    }),
    restore: vi.fn(() => {
      win.minimized = false;
      win.emit("restore");
    }),
    focus: vi.fn(),
    maximize: vi.fn(),
    on: (event: string, cb: () => void) => {
      const list = listeners.get(event) ?? [];
      list.push(cb);
      listeners.set(event, list);
    },
    emit: (event: string) => {
      for (const cb of listeners.get(event) ?? []) cb();
    },
  };
  return win;
}

/** Premier item du dernier menu construit : le toggle Show/Hide App. */
function currentToggleItem(): MenuItemTemplate {
  const last = state.templates[state.templates.length - 1];
  expect(last).toBeDefined();
  return last[0];
}

describe("tray Show/Hide App", () => {
  beforeEach(() => {
    state.templates.length = 0;
    state.trayHandlers.clear();
  });

  it("masque la fenetre quand on clique sur Hide App, meme sans focus", () => {
    const win = makeWindow({ visible: true });
    setupTray(() => win as unknown as Electron.BrowserWindow);

    const item = currentToggleItem();
    expect(item.label).toBe("Hide App");

    item.click!();

    expect(win.hide).toHaveBeenCalledTimes(1);
    expect(win.show).not.toHaveBeenCalled();
    expect(win.maximize).not.toHaveBeenCalled();
    expect(win.visible).toBe(false);
  });

  it("bascule le libelle sur Show App et reaffiche la fenetre au clic suivant", () => {
    const win = makeWindow({ visible: true });
    setupTray(() => win as unknown as Electron.BrowserWindow);

    currentToggleItem().click!();

    const item = currentToggleItem();
    expect(item.label).toBe("Show App");

    item.click!();

    expect(win.show).toHaveBeenCalledTimes(1);
    expect(win.maximize).toHaveBeenCalledTimes(1);
    expect(win.visible).toBe(true);
  });

  it("traite une fenetre reduite comme masquee et la restaure", () => {
    const win = makeWindow({ visible: true, minimized: true });
    setupTray(() => win as unknown as Electron.BrowserWindow);

    const item = currentToggleItem();
    expect(item.label).toBe("Show App");

    item.click!();

    expect(win.restore).toHaveBeenCalledTimes(1);
    expect(win.show).toHaveBeenCalledTimes(1);
    expect(win.minimized).toBe(false);
  });

  it("masque aussi la fenetre depuis un clic sur l'icone du tray", () => {
    const win = makeWindow({ visible: true });
    setupTray(() => win as unknown as Electron.BrowserWindow);

    state.trayHandlers.get("click")!();

    expect(win.hide).toHaveBeenCalledTimes(1);
    expect(win.visible).toBe(false);
    expect(currentToggleItem().label).toBe("Show App");
  });

  it("garde l'action figee avec le libelle si la fenetre se masque seule", () => {
    const win = makeWindow({ visible: true });
    setupTray(() => win as unknown as Electron.BrowserWindow);

    const item = currentToggleItem();
    expect(item.label).toBe("Hide App");

    // La partie demarre : app.ts masque la fenetre pendant que le menu
    // est ouvert. "Hide App" ne doit surtout pas la re-afficher.
    win.hide();
    win.hide.mockClear();

    item.click!();

    expect(win.show).not.toHaveBeenCalled();
    expect(win.visible).toBe(false);
  });
});
