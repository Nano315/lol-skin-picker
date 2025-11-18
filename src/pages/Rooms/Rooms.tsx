import { useSelection } from "@/features/hooks/useSelection";
import { useRooms } from "@/features/hooks/useRooms";
import { useState } from "react";
import Header from "@/components/layout/Header";
import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { RoomMemberCard } from "@/components/RoomMemberCard";

export function RoomsPage() {
  const { status, iconId } = useConnection();
  const phase = useGameflow();
  const [selection] = useSelection();
  const { room, joined, error, create, join } = useRooms(selection);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  if (!joined) {
    return (
      <div className="app">
        <Header status={status} phase={phase} iconId={iconId} />
        <main className="main">
          <div className="rooms-join-create">
            <h2>Rooms</h2>

            {error && <p style={{ color: "tomato" }}>{error}</p>}

            <div className="card">
              <h3>Créer une room</h3>
              <input
                placeholder="Votre pseudo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button onClick={() => create(name)}>Créer</button>
            </div>

            <div className="card">
              <h3>Rejoindre une room</h3>
              <input
                placeholder="Code room (ex: ABC123)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
              <input
                placeholder="Votre pseudo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button onClick={() => join(code, name)}>Rejoindre</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />
      <main className="main">
        <div className="rooms-header">
          <h2>Room {room?.code}</h2>
        </div>

        <div className="rooms-members-row">
          {room?.members.map((m) => (
            <RoomMemberCard key={m.id} member={m} />
          ))}
        </div>
      </main>
    </div>
  );
}
