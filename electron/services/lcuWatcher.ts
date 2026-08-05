import { execFile } from "node:child_process";
import { EventEmitter } from "node:events";
import { promisify } from "node:util";
import path from "node:path";
import { lcuFetch } from "../utils/lcuFetch";
import { isArray, isPlainObject } from "../utils/jsonGuards";
import { logger } from "../logger";

const execFileAsync = promisify(execFile);

/**
 * Chemin ABSOLU de powershell.exe.
 *
 * L'appel se faisait via `exec("powershell ...")`, donc en resolvant le nom
 * dans le PATH (et, sous Windows, dans le repertoire courant avant lui). Un
 * `powershell.exe` malveillant depose au bon endroit etait alors execute a la
 * place du binaire systeme — toutes les 2 secondes, puisque c'est la boucle de
 * detection du client League.
 *
 * On resout depuis SystemRoot plutot que d'ecrire "C:\\Windows" en dur.
 */
const POWERSHELL_PATH = path.join(
  process.env.SystemRoot ?? "C:\\Windows",
  "System32",
  "WindowsPowerShell",
  "v1.0",
  "powershell.exe"
);

/* -------- types -------- */
export type LcuStatus = "connected" | "disconnected";
export interface LockCreds {
  port: string;
  password: string;
  protocol: string;
}

export interface LcuFriend {
  puuid: string;
  name: string;
  availability: string;
}

export interface LcuIdentity {
  puuid: string;
  summonerName: string;
}

/* -------- implementation -------- */
export class LcuWatcher extends EventEmitter {
  status: LcuStatus = "disconnected";
  creds: LockCreds | null = null;

  private timer: ReturnType<typeof setTimeout> | null = null;
  private lastCommandLine = "";
  private isScanning = false;
  // Intelligent polling (Story 4.9)
  private pollingInterval = 2000; // Start at 2s
  private timeWithoutClient = 0;
  // Scans infructueux consecutifs alors qu'on est connecte (cf. handleScanMiss).
  private consecutiveMisses = 0;

  public isConnected(): boolean {
    return this.creds !== null;
  }

  start() {
    if (this.timer) return;
    this.schedulePoll();
  }

  private schedulePoll() {
    this.tick();
    this.timer = setTimeout(() => this.schedulePoll(), this.pollingInterval);
  }

  private adjustPollingSpeed(clientFound: boolean) {
    if (clientFound) {
      // Reset to fast polling when client is found
      this.pollingInterval = 2000;
      this.timeWithoutClient = 0;
      return;
    }

    // Increment time without client
    this.timeWithoutClient += this.pollingInterval;

    // Slow down polling progressively (Story 4.9 AC6)
    if (this.timeWithoutClient > 120000) {
      // After 2 minutes: poll every 30s
      this.pollingInterval = 30000;
    } else if (this.timeWithoutClient > 30000) {
      // After 30 seconds: poll every 10s
      this.pollingInterval = 10000;
    }
    // Otherwise keep at 2s
  }

  /**
   * Nombre de scans infructueux consecutifs tolere avant de declarer le client
   * deconnecte.
   *
   * Le scan repose sur `Get-CimInstance` : un service WMI momentanement occupe,
   * une machine sous charge ou un timeout de PowerShell renvoient un resultat
   * vide alors que le client tourne toujours. Deconnecter des le premier echec
   * demontait tous les services et masquait la fenetre — potentiellement en
   * plein champion select, au pire moment possible. On exige donc plusieurs
   * echecs d'affilee, ce qui coute au plus quelques secondes de detection en
   * plus sur une vraie fermeture du client.
   */
  private static readonly MISS_THRESHOLD = 3;

  /**
   * Traite un scan infructueux, quelle qu'en soit la cause (client absent,
   * credentials illisibles, echec d'execution).
   */
  private handleScanMiss(reason: string) {
    // Deja deconnecte : rien a amortir, on garde le comportement d'origine
    // (et la temporisation progressive du polling).
    if (this.status !== "connected") {
      this.toDisconnected();
      this.adjustPollingSpeed(false);
      return;
    }

    this.consecutiveMisses += 1;

    if (this.consecutiveMisses < LcuWatcher.MISS_THRESHOLD) {
      // On reste connecte et on garde le poll rapide : si c'etait un hoquet,
      // le prochain scan reussira et l'utilisateur n'aura rien vu.
      logger.warn(
        `[LCU] Scan infructueux (${reason}) — ${this.consecutiveMisses}/${LcuWatcher.MISS_THRESHOLD} avant deconnexion`
      );
      return;
    }

    logger.info(
      `[LCU] ${this.consecutiveMisses} scans infructueux consecutifs (${reason}) — deconnexion`
    );
    this.toDisconnected();
    this.adjustPollingSpeed(false);
  }

  private async tick() {
    if (this.isScanning) return;
    this.isScanning = true;

    try {
      const commandLine = await this.getLcuCommandLine();

      if (!commandLine) {
        this.handleScanMiss("client introuvable");
        return;
      }

      if (commandLine !== this.lastCommandLine) {
        const parsed = this.parseCommandLine(commandLine);

        if (!parsed) {
          logger.warn("[LCU] Impossible de parser les credentials de la ligne de commande");
          this.handleScanMiss("credentials illisibles");
          return;
        }

        // Memorise APRES le parse : en le faisant avant, une ligne illisible
        // devenait la reference, le scan suivant la trouvait "inchangee" et
        // prenait le chemin nominal sans jamais s'etre connecte.
        this.lastCommandLine = commandLine;
        this.toConnected(parsed);
      }
      this.consecutiveMisses = 0;
      this.adjustPollingSpeed(true);
    } catch (error) {
      // On ne logge que le message, jamais l'objet d'erreur complet : sur un
      // echec d'execFile, Node y attache `stdout`, qui contient la ligne de
      // commande du client League — donc ses jetons d'authentification. Les logs
      // electron-log sont ecrits sur disque.
      logger.error(
        `[LCU] Erreur lors du scan du processus: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      this.handleScanMiss("scan en echec");
    } finally {
      this.isScanning = false;
    }
  }

  private toConnected(c: LockCreds) {
    // Eviter d'emettre si deja connecte avec les memes creds (optionnel mais propre)
    // Ici on suit la logique precedente : on met a jour si ca change
    this.status = "connected";
    this.creds = c;
    logger.info("[LCU] Connecte au client", {
      port: c.port,
      protocol: c.protocol,
    });
    this.emit("status", "connected", c);
  }

  private toDisconnected() {
    this.consecutiveMisses = 0;
    if (this.status !== "disconnected") {
      this.status = "disconnected";
      this.creds = null;
      this.lastCommandLine = "";
      logger.info("[LCU] Client deconnecte");
      this.emit("status", "disconnected");
    }
  }

  private async getLcuCommandLine(): Promise<string | null> {
    try {
      // Utilisation de PowerShell et Get-CimInstance pour remplacer wmic
      // Get-CimInstance est la methode moderne recommandee sur Windows.
      //
      // `execFile` avec un chemin absolu et un tableau d'arguments, au lieu de
      // `exec` avec une chaine : plus de resolution via le PATH (ni via le
      // repertoire courant), et plus de shell intermediaire qui interpreterait
      // la ligne de commande.
      const { stdout } = await execFileAsync(POWERSHELL_PATH, [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        "Get-CimInstance Win32_Process -Filter \"Name = 'LeagueClientUx.exe'\" | Select-Object -ExpandProperty CommandLine",
      ]);
      
      // La sortie peut contenir plusieurs lignes si plusieurs processus (rare pour LoL mais possible)
      // Ou simplement la ligne de commande
      const lines = stdout.trim().split(/\r?\n/);
      
      for (const line of lines) {
        const trimmed = line.trim();
        // On verifie que c'est bien le bon process et qu'il a les arguments cles
        if (trimmed && trimmed.includes("LeagueClientUx.exe") && trimmed.includes("--app-port")) {
          return trimmed;
        }
      }
      // Sortie exploitable mais aucun processus League dedans : le client
      // n'est pas lance. C'est le seul cas qui vaut "absent" avec certitude.
      return null;
    } catch (e) {
      // PowerShell lui-meme a echoue (WMI occupe, strategie d'execution,
      // machine sous charge). Ce n'est PAS la meme chose que "client absent" :
      // on laisse remonter pour que l'appelant l'amortisse via le compteur de
      // scans infructueux, et pour que la cause reelle apparaisse dans les logs
      // au lieu d'etre confondue avec une fermeture du client.
      throw e instanceof Error ? e : new Error(String(e));
    }
  }

  private parseCommandLine(cmd: string): LockCreds | null {
    try {
      // Anchor each capture on an end-of-argument boundary (whitespace, a
      // closing quote, or end-of-string) so the regex cannot silently
      // truncate a token mid-value or glue on neighbouring argument bytes.
      // Port is numeric, token is URL-safe base64 (alphanumerics + _ -).
      const portMatch = cmd.match(/--app-port=(\d+)(?=["\s]|$)/);
      const tokenMatch = cmd.match(
        /--remoting-auth-token=([A-Za-z0-9_-]+)(?=["\s]|$)/
      );

      if (!portMatch || !tokenMatch) return null;

      const port = portMatch[1];
      const token = tokenMatch[1];
      // Sanity bounds: LCU ports are 16-bit, tokens are ~22 base64 chars.
      const portNum = parseInt(port, 10);
      if (!Number.isFinite(portNum) || portNum < 1 || portNum > 65535) {
        return null;
      }
      if (token.length < 8 || token.length > 128) {
        return null;
      }

      return {
        port,
        password: token,
        protocol: "https", // Toujours https pour le LCU
      };
    } catch {
      return null;
    }
  }

  /**
   * Get current player identity (PUUID + summoner name) from LCU
   * Returns null if client is not connected
   */
  async getIdentity(): Promise<LcuIdentity | null> {
    if (!this.creds) return null;

    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-summoner/v1/current-summoner`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");

    try {
      const res = await lcuFetch(url, {
        headers: { Authorization: `Basic ${auth}` },
      });

      if (!res.ok) {
        logger.warn("[LCU] Failed to get identity", { status: res.status });
        return null;
      }

      const data = (await res.json()) as unknown;
      if (!isPlainObject(data)) {
        logger.warn("[LCU] Identity response is not an object");
        return null;
      }

      const puuid = data.puuid;
      if (typeof puuid !== "string" || puuid.length === 0) {
        logger.warn("[LCU] Identity response missing puuid");
        return null;
      }

      const gameName = typeof data.gameName === "string" ? data.gameName : "";
      const displayName =
        typeof data.displayName === "string" ? data.displayName : "";

      return {
        puuid,
        summonerName: gameName || displayName || "",
      };
    } catch (error) {
      logger.error("[LCU] Error fetching identity", error);
      return null;
    }
  }

  /**
   * Get friends list from LCU
   * Returns null if client is not connected
   */
  async getFriends(): Promise<LcuFriend[] | null> {
    if (!this.creds) return null;

    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-chat/v1/friends`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");

    try {
      const res = await lcuFetch(url, {
        headers: { Authorization: `Basic ${auth}` },
      });

      if (!res.ok) {
        logger.warn("[LCU] Failed to get friends", { status: res.status });
        return null;
      }

      const data = (await res.json()) as unknown;
      if (!isArray(data)) {
        logger.warn("[LCU] Friends response is not an array");
        return null;
      }

      const friends: LcuFriend[] = [];
      for (const entry of data) {
        if (!isPlainObject(entry)) continue;
        const puuid = entry.puuid;
        if (typeof puuid !== "string" || puuid.length === 0) continue;
        const gameName = typeof entry.gameName === "string" ? entry.gameName : "";
        const name = typeof entry.name === "string" ? entry.name : "";
        const availability =
          typeof entry.availability === "string" ? entry.availability : "offline";
        friends.push({
          puuid,
          name: gameName || name || "",
          availability,
        });
      }
      return friends;
    } catch (error) {
      logger.error("[LCU] Error fetching friends", error);
      return null;
    }
  }

  override on(
    event: "status",
    fn: (s: LcuStatus, c?: LockCreds) => void
  ): this {
    return super.on(event, fn);
  }
  override emit(event: "status", s: LcuStatus, c?: LockCreds): boolean {
    return super.emit(event, s, c);
  }
}
