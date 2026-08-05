import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Le scan du client passe par `execFile` (PowerShell / Get-CimInstance). On le
// mocke AVANT d'importer le service : `promisify(execFile)` est evalue au
// chargement du module, donc un mock pose apres serait ignore.
const execFileMock = vi.fn();
vi.mock("node:child_process", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:child_process")>();
  const execFile = (...args: unknown[]) => execFileMock(...args);
  // On conserve le reste du module (et son export par defaut) : d'autres
  // dependances du graphe l'importent, un mock partiel les casserait.
  return { ...actual, execFile, default: { ...actual, execFile } };
});
vi.mock("../../utils/lcuFetch", () => ({ lcuFetch: vi.fn() }));
vi.mock("../../logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { LcuWatcher } from "../../services/lcuWatcher";

const VALID_CMD =
  '"C:\\Riot Games\\League of Legends\\LeagueClientUx.exe" --app-port=54321 --remoting-auth-token=abcdefghijklmnop';

/** Intervalle de poll nominal du watcher quand le client est detecte. */
const POLL_MS = 2000;

type ScanOutcome = { stdout: string } | { error: Error };

/**
 * Programme le resultat du prochain scan. Le mock respecte la convention
 * callback de `execFile` pour que `promisify` le resolve correctement.
 */
function setScanOutcome(outcome: ScanOutcome) {
  execFileMock.mockImplementation(
    (
      _file: string,
      _args: string[],
      cb: (err: Error | null, value?: { stdout: string; stderr: string }) => void
    ) => {
      if ("error" in outcome) cb(outcome.error);
      else cb(null, { stdout: outcome.stdout, stderr: "" });
    }
  );
}

describe("LcuWatcher — tolerance aux scans infructueux", () => {
  let watcher: LcuWatcher;
  let statusEvents: string[];

  beforeEach(async () => {
    vi.useFakeTimers();
    execFileMock.mockReset();
    watcher = new LcuWatcher();
    statusEvents = [];
    watcher.on("status", (status: string) => statusEvents.push(status));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /** Demarre le watcher sur un client present et attend la connexion. */
  async function startConnected() {
    setScanOutcome({ stdout: VALID_CMD });
    watcher.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(watcher.status).toBe("connected");
    statusEvents.length = 0;
  }

  /** Laisse passer `n` cycles de scan. */
  async function scans(n: number) {
    for (let i = 0; i < n; i++) {
      await vi.advanceTimersByTimeAsync(POLL_MS);
    }
  }

  it("se connecte quand le client est detecte", async () => {
    setScanOutcome({ stdout: VALID_CMD });
    watcher.start();
    await vi.advanceTimersByTimeAsync(0);

    expect(watcher.status).toBe("connected");
    expect(watcher.isConnected()).toBe(true);
    expect(watcher.creds).toMatchObject({
      port: "54321",
      password: "abcdefghijklmnop",
    });
    expect(statusEvents).toEqual(["connected"]);
  });

  it("reste connecte pendant deux scans infructueux d'affilee", async () => {
    await startConnected();

    // WMI qui hoquette : sortie vide alors que le client tourne toujours.
    setScanOutcome({ stdout: "" });
    await scans(2);

    expect(watcher.status).toBe("connected");
    expect(statusEvents).toEqual([]);
  });

  it("repart proprement si le scan redevient bon avant le seuil", async () => {
    await startConnected();

    setScanOutcome({ stdout: "" });
    await scans(2);
    setScanOutcome({ stdout: VALID_CMD });
    await scans(1);

    // Le compteur est remis a zero : deux nouveaux echecs ne suffisent
    // toujours pas a declarer la deconnexion.
    setScanOutcome({ stdout: "" });
    await scans(2);

    expect(watcher.status).toBe("connected");
    expect(statusEvents).toEqual([]);
  });

  it("se deconnecte au troisieme scan infructueux consecutif", async () => {
    await startConnected();

    setScanOutcome({ stdout: "" });
    await scans(3);

    expect(watcher.status).toBe("disconnected");
    expect(watcher.creds).toBeNull();
    expect(statusEvents).toEqual(["disconnected"]);
  });

  it("traite un echec d'execution comme un scan infructueux, pas comme une deconnexion", async () => {
    await startConnected();

    // PowerShell lui-meme echoue : ce n'est pas la preuve que le client est parti.
    setScanOutcome({ error: new Error("WMI busy") });
    await scans(2);
    expect(watcher.status).toBe("connected");

    await scans(1);
    expect(watcher.status).toBe("disconnected");
  });

  it("n'emet qu'un seul evenement de deconnexion meme si les scans continuent d'echouer", async () => {
    await startConnected();

    setScanOutcome({ stdout: "" });
    await scans(6);

    expect(statusEvents).toEqual(["disconnected"]);
  });

  it("ne retient pas une ligne de commande illisible comme reference", async () => {
    await startConnected();

    // Ligne reconnue comme League mais dont les credentials sont illisibles :
    // en la memorisant, le scan suivant l'aurait vue "inchangee" et aurait
    // repris le chemin nominal sans jamais s'etre reconnecte.
    const UNPARSEABLE =
      '"C:\\Riot Games\\LeagueClientUx.exe" --app-port=54321 --remoting-auth-token=';
    setScanOutcome({ stdout: UNPARSEABLE });
    await scans(3);
    expect(watcher.status).toBe("disconnected");

    // Le client revient avec les memes credentials qu'au depart : comme la
    // ligne illisible n'a pas ete memorisee, la reconnexion est bien detectee.
    setScanOutcome({ stdout: VALID_CMD });
    await scans(1);

    expect(watcher.status).toBe("connected");
    expect(watcher.creds).toMatchObject({ port: "54321" });
  });
});
