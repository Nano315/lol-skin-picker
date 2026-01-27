import { NavLink, useLocation } from "react-router-dom";
import fallbackIcon from "/fallback-icon.png?url";
import { useInvitationBadgeCount } from "@/features/hooks/useInvitationQueue";
import { SocketConnectionIndicator } from "@/components/common/SocketConnectionIndicator";

export default function Header({
  status,
  phase,
  iconId,
}: {
  status: string;
  phase: string;
  iconId: number | null;
}) {
  const location = useLocation();
  const invitationCount = useInvitationBadgeCount();
  // Show badge only when not on /rooms page and there are pending invitations
  const showBadge = invitationCount > 0 && location.pathname !== "/rooms";
  const iconUrl = iconId
    ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${iconId}.jpg`
    : fallbackIcon;

  const connectionLabel = () => {
    if (status === "disconnected" || phase === "Unknown")
      return "Not connected to client";
    if (status === "checking") return "Searching for client…";
    return status === "connected" ? "Connected to client" : status;
  };

  return (
    <header className="header">
      {/* Bloc gauche : logo + nav rapproches */}
      <div className="brand">
        <div className="logo">Skin Picker</div>

        <nav className="nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/rooms"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            style={{ position: "relative" }}
          >
            Rooms
            {showBadge && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-8px",
                  minWidth: "18px",
                  height: "18px",
                  padding: "0 5px",
                  background: "#ef4444",
                  borderRadius: "9px",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              >
                {invitationCount}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/priority"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Priority
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Settings
          </NavLink>
        </nav>
      </div>

      {/* Bloc droit : etat + avatar */}
      <div className="connection">
        <SocketConnectionIndicator />
        <div className="state">{connectionLabel()}</div>
        {iconUrl && <img src={iconUrl} alt="summoner" className="avatar" />}
      </div>
    </header>
  );
}
