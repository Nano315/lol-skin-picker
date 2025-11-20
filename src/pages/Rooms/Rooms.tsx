// src/pages/Rooms/Rooms.tsx
import { useSelection } from "@/features/hooks/useSelection";
import { useRooms } from "@/features/hooks/useRooms";
import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { RoomMemberCard } from "@/components/RoomMemberCard";
import { useSummonerName } from "@/features/hooks/useSummonerName";
import type { RoomMember } from "@/features/roomsClient";

export function RoomsPage() {
  const { status, iconId } = useConnection();
  const phase = useGameflow();
  const [selection] = useSelection();
  const { room, joined, error, create, join, leave } = useRooms(selection);
  const [code, setCode] = useState("");

  const summonerName = useSummonerName();
  const isConnected = status === "connected";
  const canUseRooms = isConnected && !!summonerName;

  // --- Construction des 5 slots logiques (1..5) + ordre visuel 4-2-1-3-5 ---
  const orderedSlots = useMemo<
    { member: RoomMember | null; slotIndex: number }[]
  >(() => {
    const members = room?.members ?? [];

    if (members.length === 0) {
      // 5 slots vides par défaut
      return Array.from({ length: 5 }, (_, i) => ({
        member: null,
        slotIndex: i,
      }));
    }

    const normalizedSummoner = summonerName?.toLowerCase().trim() ?? null;

    // On cherche le joueur local par son pseudo
    const selfMember: RoomMember =
      normalizedSummoner != null
        ? members.find(
            (m) => m.name.toLowerCase().trim() === normalizedSummoner
          ) ?? members[0] // fallback : premier membre
        : members[0];

    const others = members.filter((m) => m !== selfMember);

    // Slots logiques : index 0..4 = slots 1..5
    // slot1 = joueur local, slots 2..5 = autres
    const logicalSlots: (RoomMember | null)[] = Array(5).fill(null);
    logicalSlots[0] = selfMember;

    for (let i = 0; i < 4 && i < others.length; i++) {
      logicalSlots[i + 1] = others[i];
    }

    // Ordre visuel : 4, 2, 1, 3, 5 => indices 3,1,0,2,4
    const indexOrder = [3, 1, 0, 2, 4];

    return indexOrder.map((idx) => ({
      member: logicalSlots[idx],
      slotIndex: idx,
    }));
  }, [room?.members, summonerName]);

  /* ===================== VUE "PAS ENCORE DANS UNE ROOM" ===================== */

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

  /* ===================== VUE "DANS UNE ROOM" ===================== */

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
          {orderedSlots.map(({ member, slotIndex }) => (
            <RoomMemberCard
              key={member?.id ?? `empty-${slotIndex}`}
              member={member ?? undefined}
              slotIndex={slotIndex}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
