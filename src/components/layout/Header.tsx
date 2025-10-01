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
      <div className="logo">Skin Picker</div>
      <div className="connection">
        <div className="state">{connectionLabel()}</div>
        {iconUrl && <img src={iconUrl} alt="summoner" className="avatar" />}
      </div>
    </header>
  );
}
