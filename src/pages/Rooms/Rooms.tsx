// src/pages/Rooms/Rooms.tsx
import { useSelection } from "@/features/hooks/useSelection";
import { useRooms } from "@/features/hooks/useRooms";
import { useState, useMemo, useEffect } from "react";
import Header from "@/components/layout/Header";
import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { RoomMemberCard } from "@/components/RoomMemberCard";
import { useSummonerName } from "@/features/hooks/useSummonerName";
import type { RoomMember } from "@/features/roomsClient";
import { GroupRerollControls } from "@/components/controls/GroupRerollControls";
import { api } from "@/features/api";
import { roomsClient } from "@/features/roomsClient";
import { useOwnedSkins } from "@/features/hooks/useOwnedSkins";
import type { GroupSkinOption } from "@/features/roomsClient";
import { computeChromaColor } from "@/features/chromaColor";

export function RoomsPage() {
  const { status, iconId } = useConnection();
  const phase = useGameflow();
  const [selection] = useSelection();
  const skins = useOwnedSkins();
  const { room, joined, error, create, join, leave } = useRooms(selection);
  const [code, setCode] = useState("");

  const summonerName = useSummonerName();
  const isConnected = status === "connected";

  const [copied, setCopied] = useState(false);

  // --- Construction des 5 slots logiques (1..5) + ordre visuel 4-2-1-3-5 ---
  const orderedSlots = useMemo<
    { member: RoomMember | null; slotIndex: number }[]
  >(() => {
    const members = room?.members ?? [];

    if (members.length === 0) {
      return Array.from({ length: 5 }, (_, i) => ({
        member: null,
        slotIndex: i,
      }));
    }

    const normalizedSummoner = summonerName?.toLowerCase().trim() ?? null;

    const selfMember: RoomMember =
      normalizedSummoner != null
        ? members.find(
            (m) => m.name.toLowerCase().trim() === normalizedSummoner
          ) ?? members[0]
        : members[0];

    const others = members.filter((m) => m !== selfMember);

    const logicalSlots: (RoomMember | null)[] = Array(5).fill(null);
    logicalSlots[0] = selfMember;

    for (let i = 0; i < 4 && i < others.length; i++) {
      logicalSlots[i + 1] = others[i];
    }

    const indexOrder = [3, 1, 0, 2, 4];

    return indexOrder.map((idx) => ({
      member: logicalSlots[idx],
      slotIndex: idx,
    }));
  }, [room?.members, summonerName]);

  const isOwner =
    !!room &&
    !!summonerName &&
    (() => {
      const normalized = summonerName.toLowerCase().trim();
      const self = room.members.find(
        (m) => m.name.toLowerCase().trim() === normalized
      );
      return !!self && room.ownerId === self.id;
    })();

  // -> Appliquer le combo quand le serveur en choisit un
  useEffect(() => {
    if (!room || !summonerName) return;

    const normalized = summonerName.toLowerCase().trim();
    const self = room.members.find(
      (m) => m.name.toLowerCase().trim() === normalized
    );
    if (!self) return;

    const unsubscribe = roomsClient.onGroupCombo((payload) => {
      const pick = payload.picks.find((p) => p.memberId === self.id);
      if (!pick) return;

      const finalId = pick.chromaId || pick.skinId;
      api.applySkinId(finalId);
    });

    return unsubscribe;
  }, [room, summonerName]);

  const handleCopyCode = () => {
    if (!room?.code) return;

    const text = room.code;

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

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  // Quand on est en ChampSelect, que le champion est lock et qu'on connaît les skins,
  // on envoie TOUTES les options skin/chroma avec la VRAIE couleur d'aura.
  useEffect(() => {
    if (!room) return;
    if (phase !== "ChampSelect") return;
    if (!selection.locked) return;
    if (!selection.championId) return;
    if (!skins.length) return;

    let cancelled = false;

    async function run() {
      const options: GroupSkinOption[] = [];

      // Chaque OwnedSkin correspond au champion courant (selection.championId)
      for (const s of skins) {
        // Variante "skin nu" (sans chroma) -> auraColor peut être null
        const baseColor = await computeChromaColor({
          championId: selection.championId,
          skinId: s.id,
          chromaId: 0,
        });

        options.push({
          skinId: s.id,
          chromaId: 0,
          auraColor: baseColor,
        });

        // Variantes chroma
        for (const c of s.chromas) {
          const color = await computeChromaColor({
            championId: selection.championId,
            skinId: s.id,
            chromaId: c.id,
          });

          options.push({
            skinId: s.id,
            chromaId: c.id,
            auraColor: color,
          });
        }
      }

      if (cancelled) return;

      roomsClient.sendOwnedOptions({
        championId: selection.championId,
        championAlias: selection.championAlias,
        options,
      });
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [
    room,
    phase,
    selection.championId,
    selection.championAlias,
    selection.locked,
    skins,
  ]);

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
                  disabled={!isConnected}
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
                  disabled={!isConnected || !code.trim()}
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
          <button className="rooms-leave-btn" onClick={leave}>
            Leave room
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

        {room && (
          <GroupRerollControls
            room={room}
            phase={phase}
            isOwner={isOwner}
            selectionLocked={selection.locked}
          />
        )}
      </main>
    </div>
  );
}
