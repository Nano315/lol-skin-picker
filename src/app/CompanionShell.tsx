import CompanionSidecar from "@/pages/Companion/CompanionSidecar";
import { MatchLockBridge } from "@/features/matchLock/MatchLockBridge";

/**
 * Racine de la fenetre Draft Companion.
 *
 * Volontairement MINIMALE : elle ne monte ni `RoomsClientConnector` ni
 * `IdentityConnector`. Ces deux connectors ouvrent des sockets Socket.IO au
 * montage ; les monter ici ferait tourner deux sockets identity pour le meme
 * puuid, donc un double `identify` cote serveur et une presence dedoublee. La
 * fenetre principale reste seule proprietaire des sockets — le sidecar passera
 * par un relais IPC quand le premade sera cable.
 *
 * Pas de ToastProvider, pas d'onboarding, pas de telemetrie : tout ce qui a un
 * effet de bord global appartient a la fenetre principale. `MatchLockBridge`
 * fait exception, et c'est justement son role — il ne cree rien, il ne fait
 * que recevoir l'etat arbitre par le main process.
 */
export default function CompanionShell() {
  return (
    <>
      <MatchLockBridge />
      <CompanionSidecar />
    </>
  );
}
