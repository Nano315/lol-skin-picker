// src/pages/Rooms/Rooms.tsx
import { useSelection } from "@/features/hooks/useSelection";
import { useRooms } from "@/features/hooks/useRooms";
import { useState } from "react";
import Header from "@/components/layout/Header";
import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { RoomMemberCard } from "@/components/RoomMemberCard";
import { useSummonerName } from "@/features/hooks/useSummonerName";

export function RoomsPage() {
  const { status, iconId } = useConnection();
  const phase = useGameflow();
  const [selection] = useSelection();
  const { room, joined, error, create, join, leave } = useRooms(selection);
  const [code, setCode] = useState("");

  const summonerName = useSummonerName();
  const isConnected = status === "connected";
  const canUseRooms = isConnected && !!summonerName;

  if (!joined) {
    return (
      <div className="app">
        <Header status={status} phase={phase} iconId={iconId} />
        <main className="main">
          <div className="rooms-join-create">
            <h2>Rooms</h2>

            {!isConnected && (
              <p className="rooms-warning">
                Connecte-toi au client League of Legends pour utiliser les
                rooms.
              </p>
            )}

            {isConnected && !summonerName && (
              <p className="rooms-warning">
                Récupération de ton pseudo depuis le client...
              </p>
            )}

            {error && <p style={{ color: "tomato" }}>{error}</p>}

            <div className="card">
              <h3>Créer une room</h3>
              <button
                onClick={() => summonerName && create(summonerName)}
                disabled={!canUseRooms}
              >
                Créer avec mon pseudo
                {summonerName ? ` (${summonerName})` : ""}
              </button>
            </div>

            <div className="card">
              <h3>Rejoindre une room</h3>
              <input
                placeholder="Code room (ex: ABC123)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
              <button
                onClick={() => summonerName && join(code.trim(), summonerName)}
                disabled={!canUseRooms || !code.trim()}
              >
                Rejoindre avec mon pseudo
                {summonerName ? ` (${summonerName})` : ""}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Toujours 5 slots
  const members = room?.members ?? [];
  const slots = Array.from({ length: 5 }, (_, index) => members[index] ?? null);

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />
      <main className="main">
        <div className="rooms-header">
          <h2>Room {room?.code}</h2>
          <button className="rooms-leave-btn" onClick={leave}>
            Quitter la room
          </button>
        </div>

        <div className="rooms-members-row">
          {slots.map((member, index) => (
            <RoomMemberCard
              key={member?.id ?? `empty-${index}`}
              member={member ?? undefined}
              slotIndex={index}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
