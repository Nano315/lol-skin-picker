// src/pages/Rooms/Rooms.tsx
import { useSelection } from "@/features/hooks/useSelection";
import { useRooms } from "@/features/hooks/useRooms";
import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { RoomMemberCard } from "@/components/RoomMemberCard";
import { useSummonerName } from "@/features/hooks/useSummonerName";
import { SynergyControls } from "@/components/controls/SynergyControls";
import type { RoomMember } from "@/features/roomsClient";

export function RoomsPage() {
  const { status, iconId } = useConnection();
  const phase = useGameflow();
  const [selection] = useSelection();

  // Récupération des nouvelles props de useRooms
  const {
    room,
    joined,
    error,
    create,
    join,
    leave,
    synergyResult,
    requestSynergy,
    applySynergy,
    clearSynergy,
  } = useRooms(selection);

  const [code, setCode] = useState("");

  const [copied, setCopied] = useState(false);

  const summonerName = useSummonerName();
  const isConnected = status === "connected";
  const canUseRooms = isConnected && !!summonerName;

  // --- Helper: Est-ce que je suis le owner ? ---
  // On suppose que le membre local est le premier de orderedSlots ou on compare ownerId
  // Le plus simple est de comparer l'ID si on l'a, mais room.members ne contient pas mon ID socket brut
  // Cependant, room.ownerId existe. Il faut trouver mon memberId dans le client ou comparer les noms.
  // Dans roomsClient.ts, memberId est privé.
  // ASTUCE : Dans create/join, on reçoit "owner: boolean".
  // Pour faire simple ici, on va check si member.id === room.ownerId dans la boucle d'affichage
  // Ou on peut rajouter une prop `isOwner` retournée par useRooms (basée sur roomsClient.room?.ownerId === roomsClient.memberId)

  // (Pour le code ci-dessous, je suppose que tu as accès à l'info owner, sinon on le déduit du nom)
  const isOwner = useMemo(() => {
    if (!room || !summonerName) return false;
    // On cherche le membre qui correspond à mon nom
    const me = room.members.find(
      (m) => m.name.toLowerCase() === summonerName.toLowerCase()
    );
    return me ? me.id === room.ownerId : false;
  }, [room, summonerName]);

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

  const handleCopyCode = () => {
    if (!room?.code) return;

    const text = room.code;

    // On essaye de copier, et on affiche le feedback quoi qu’il arrive
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        /* ignore */
      });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(textarea);
    }

    // feedback visuel
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  /* ===================== VUE "PAS ENCORE DANS UNE ROOM" ===================== */

  if (!joined) {
    return (
      <div className="app">
        <Header status={status} phase={phase} iconId={iconId} />
        <main className="main">
          <div className="rooms-join-create">
            {!isConnected && (
              <p className="rooms-warning">
                Connect your League of Legends client to use rooms.
              </p>
            )}

            {error && <p style={{ color: "tomato" }}>{error}</p>}

            <div className="rooms-panel card">
              <div className="rooms-side rooms-side--left">
                <p className="rooms-side-label">Start a new room</p>
                <button
                  className="rooms-primary-btn"
                  onClick={() => summonerName && create(summonerName)}
                  disabled={!canUseRooms}
                >
                  Create room
                </button>
              </div>

              <div className="rooms-divider" aria-hidden="true" />

              <div className="rooms-side rooms-side--right">
                <p className="rooms-side-label">Join an existing room</p>
                <input
                  className="rooms-input"
                  placeholder="Room code (e.g. ABC123)"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
                <button
                  className="rooms-primary-btn"
                  onClick={() =>
                    summonerName && join(code.trim(), summonerName)
                  }
                  disabled={!canUseRooms || !code.trim()}
                >
                  Join room
                </button>
              </div>
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
          <h2>
            Room{" "}
            <button
              type="button"
              className="rooms-code-btn"
              onClick={handleCopyCode}
            >
              <span className="rooms-code-text">{room?.code}</span>
              {copied && <span className="rooms-code-badge">Copied!</span>}
            </button>
          </h2>
          <div style={{ display: "flex", gap: "10px" }}>
            {/* BOUTON SYNERGY (Owner Only) */}
            {isOwner && !synergyResult && room && room.members.length > 1 && (
              <button className="rooms-primary-btn" onClick={requestSynergy}>
                ✨ Find Synergy
              </button>
            )}
            <button className="rooms-leave-btn" onClick={leave}>
              Leave room
            </button>
          </div>
        </div>

        {/* PANNEAU DE CONTROLE SYNERGY (S'affiche si résultat dispo) */}
        {isOwner && synergyResult && (
          <SynergyControls
            result={synergyResult}
            onApply={applySynergy}
            onCancel={clearSynergy}
          />
        )}

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
