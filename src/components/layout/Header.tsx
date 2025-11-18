import { NavLink } from "react-router-dom";
import fallbackIcon from "/fallback-icon.png?url";

export default function Header({
  status,
  phase,
  iconId,
}: {
  status: string;
  phase: string;
  iconId: number;
}) {
  const iconUrl = iconId
    ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${iconId}.jpg`
    : fallbackIcon;

  const connectionLabel = () => {
    if (status === "disconnected" || phase === "Unknown")
      return "Not connected to client";
    if (status === "checking") return "Searching for client…";
    return phase === "None" ? "Connected to client" : phase;
  };

  return (
    <header className="header">
      {/* Bloc gauche : logo + nav rapprochés */}
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
          >
            Rooms
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

      {/* Bloc droit : état + avatar */}
      <div className="connection">
        <div className="state">{connectionLabel()}</div>
        {iconUrl && <img src={iconUrl} alt="summoner" className="avatar" />}
      </div>
    </header>
  );
}
