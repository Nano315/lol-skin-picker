import { exec } from "node:child_process";
import { EventEmitter } from "node:events";
import { promisify } from "node:util";
import { logger } from "../logger";

const execAsync = promisify(exec);

/* -------- types -------- */
export type LcuStatus = "connected" | "disconnected";
export interface LockCreds {
  port: string;
  password: string;
  protocol: string;
}

/* -------- implementation -------- */
export class LcuWatcher extends EventEmitter {
  status: LcuStatus = "disconnected";
  creds: LockCreds | null = null;

  private timer: ReturnType<typeof setInterval> | null = null;
  private lastCommandLine = "";
  private isScanning = false;

  public isConnected(): boolean {
    return this.creds !== null;
  }

  start(interval = 2000) {
    if (this.timer) return;
    this.tick();
    this.timer = setInterval(() => this.tick(), interval);
  }

  private async tick() {
    if (this.isScanning) return;
    this.isScanning = true;

    try {
      const commandLine = await this.getLcuCommandLine();

      if (!commandLine) {
        this.toDisconnected();
        return;
      }

      if (commandLine !== this.lastCommandLine) {
        this.lastCommandLine = commandLine;
        const parsed = this.parseCommandLine(commandLine);
        
        if (!parsed) {
          logger.warn("[LCU] Impossible de parser les credentials de la ligne de commande");
          this.toDisconnected();
          return;
        }

        this.toConnected(parsed);
      }
    } catch (error) {
      logger.error("[LCU] Erreur lors du scan du processus", error);
      this.toDisconnected();
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
      // Get-CimInstance est la methode moderne recommandee sur Windows
      const command = `powershell -NoProfile -NonInteractive -Command "Get-CimInstance Win32_Process -Filter \\"Name = 'LeagueClientUx.exe'\\" | Select-Object -ExpandProperty CommandLine"`;
      
      const { stdout } = await execAsync(command);
      
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
      return null;
    } catch (e) {
      // Si le processus n'existe pas, ou erreur d'execution
      return null;
    }
  }

  private parseCommandLine(cmd: string): LockCreds | null {
    try {
      // Recherche des arguments --app-port et --remoting-auth-token
      const portMatch = cmd.match(/--app-port=([0-9]+)/);
      const tokenMatch = cmd.match(/--remoting-auth-token=([\w-]+)/);

      if (!portMatch || !tokenMatch) return null;

      return {
        port: portMatch[1],
        password: tokenMatch[1],
        protocol: "https", // Toujours https pour le LCU
      };
    } catch {
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
