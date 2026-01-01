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
import ControlBar from "@/components/controls/ControlBar";
import { api } from "@/features/api";
import { roomsClient } from "@/features/roomsClient";
import { useOwnedSkins } from "@/features/hooks/useOwnedSkins";
import type { GroupSkinOption } from "@/features/roomsClient";
import { computeChromaColor } from "@/features/chromaColor";

export function RoomsPage() {
  const { status, iconId } = useConnection();
  const phase = useGameflow();
  const [selection, setSelection] = useSelection();
  const skins = useOwnedSkins();
  const { room, joined, error, create, join, leave, suggestColor, suggestedColorsMap } = useRooms(selection);
  const [code, setCode] = useState("");

  const [skinOptions, setSkinOptions] = useState<GroupSkinOption[]>([]);

  const isConnected = status === "connected";
  const summonerName = useSummonerName(status);
  const canUseRooms = isConnected && !!summonerName;

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

  const [isSyncing, setIsSyncing] = useState(false);

  // Calcul et envoi des skins possedes (Owned Options)
  useEffect(() => {
    // Conditions strictes pour eviter les calculs inutiles
    if (!room) return;
    if (!isConnected) return;

    // On ne le fait que si on a selectionne un champion
    if (!selection.championId || selection.championId === 0) return;

    // On ne le fait que si on a charge la liste des skins
    if (!skins || skins.length === 0) return;

    // Flag pour annuler si le composant est demonte pendant le calcul (async)
    let isMounted = true;

    async function computeAndSend() {
      if (!isMounted) return;
      
      // Start syncing visual state
      setIsSyncing(true);
      console.log("[Rooms] Computing skin colors for synergy...");
      
      const options: GroupSkinOption[] = [];

      try {
        for (const s of skins) {
          // Optimisation : On ne traite que les skins du champion actuel pour eviter d'envoyer 1000 items
          if (s.championId !== selection.championId) continue;
  
          // 1. Skin de base (sans chroma)
          const baseColor = await computeChromaColor({
            championId: selection.championId,
            skinId: s.id,
            chromaId: 0,
          });
  
          if (!isMounted) return;
  
          options.push({
            skinId: s.id,
            chromaId: 0,
            auraColor: baseColor,
          });
  
          // 2. Chromas
          for (const c of s.chromas) {
            const chromaColor = await computeChromaColor({
              championId: selection.championId,
              skinId: s.id,
              chromaId: c.id,
            });
  
            if (!isMounted) return;
  
            options.push({
              skinId: s.id,
              chromaId: c.id,
              auraColor: chromaColor,
            });
          }
        }
  
        if (isMounted) {
          setSkinOptions(options); // Store locally
          if (options.length > 0) {
            console.log(`[Rooms] Sending ${options.length} options to server.`);
            roomsClient.sendOwnedOptions({
              championId: selection.championId,
              championAlias: selection.championAlias,
              options,
            });
          }
        }
      } finally {
        // Stop syncing visual state (with a small safety delay for UX smoothness if it was too fast?)
        // For now, immediate is fine, or maybe a small timeout if needed.
        if (isMounted) {
           setIsSyncing(false);
        }
      }
    }

    computeAndSend();

    return () => {
      isMounted = false;
    };

    // Dependances CRITIQUES : on relance si le champion change ou si on vient de rejoindre
  }, [room?.id, selection.championId, skins]);

  // Determine active room color for local player
  const activeRoomColor = useMemo(() => {
    if (!room?.synergy?.colors || !skinOptions.length) return undefined;

    // Find current selection color
    const currentOption = skinOptions.find(o =>
      o.skinId === selection.skinId &&
      o.chromaId === selection.chromaId
    );

    if (!currentOption?.auraColor) return undefined;
    // Check if this color is a synergy color
    const synergy = room.synergy.colors.find(c => c.color === currentOption.auraColor);
    return synergy ? synergy.color : undefined;
  }, [room, skinOptions, selection.skinId, selection.chromaId]);

  /* ===================== VUE "PAS ENCORE DANS UNE ROOM" ===================== */

  if (!joined) {
    return (
      <div className="app">
        <Header status={status} phase={phase} iconId={iconId} />
        <main className="main">
          <div className="page-shell rooms-shell">
            <div className="bento-grid rooms-bento">
              {!isConnected && (
                <p className="rooms-warning">
                  Connect your League of Legends client to use rooms.
                </p>
              )}

              {isConnected && !summonerName && (
                <p className="rooms-warning">
                  Fetching your summoner name from the client...
                </p>
              )}

              {error && <p style={{ color: "tomato" }}>{error}</p>}

              <section className="card rooms-cta-card">
                <div className="rooms-card-header card-header">
                  <div>
                    <p className="eyebrow">CREATE</p>
                    <h2 className="card-title">Start a new lobby</h2>
                  </div>
                </div>

                <p className="rooms-card-desc">
                  Generate a fresh room and invite your group instantly.
                </p>

                <button
                  className="rooms-primary-btn"
                  onClick={() => summonerName && create(summonerName)}
                  disabled={!canUseRooms}
                >
                  Create room
                </button>
              </section>

              <section className="card rooms-cta-card">
                <div className="rooms-card-header card-header">
                  <div>
                    <p className="eyebrow">JOIN</p>
                    <h2 className="card-title">Enter a room code</h2>
                  </div>
                </div>

                <p className="rooms-card-desc">
                  Enter the shared code to sync up with your teammates.
                </p>

                <div className="rooms-input-row">
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
              </section>
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
        <div className="page-shell rooms-shell">
          <div className="bento-grid rooms-bento">
            <section className="card rooms-squad-card">
              <div className="card-header rooms-card-header">
                <div>
                  <p className="eyebrow">SQUAD</p>
                  <h2 className="card-title">
                    Lobby - Room{" "}
                    <button
                      type="button"
                      className="rooms-code-button"
                      onClick={handleCopyCode}
                    >
                      <span className="rooms-code-text">{room?.code}</span>
                      {copied && (
                        <span className="rooms-code-feedback">Copied!</span>
                      )}
                    </button>
                  </h2>
                </div>

                <button className="rooms-leave-btn" onClick={leave}>
                  Leave Room
                </button>
              </div>

              <div className="rooms-members-row">
                {orderedSlots.map(({ member, slotIndex }) => {
                  const suggestionId = member ? suggestedColorsMap[member.id] : undefined;

                  const handleApplySuggestion = () => {
                     if (!suggestionId || !room) return;
                     // We need to find the COLOR associated with this chroma to apply it to the group
                     // BUT, the server expects a color string for "sameColor" type.
                     // We have to reverse-lookup the color from the chromaId.
                     // This is tricky because we only have the chromaId.
                     
                     // Option 1: Re-compute color locally.
                     // We need the championId/skinId/chromaId combo.
                     // member has this info, except we replace member.chromaId with suggestionId.
                     if (!member) return;
                     
                     // We need to async compute color then call requestGroupReroll
                     // Let's do it inline or better, extract a helper.
                     // For now simple inline:
                     (async () => {
                        const color = await computeChromaColor({
                           championId: member.championId,
                           skinId: member.skinId,
                           chromaId: suggestionId
                        });
                        
                        if (color) {
                           roomsClient.requestGroupReroll({ type: "sameColor", color });
                        }
                     })();
                  };

                  return (
                    <RoomMemberCard
                      key={member?.id ?? `empty-${slotIndex}`}
                      member={member ?? undefined}
                      slotIndex={slotIndex}
                      suggestedChromaId={isOwner ? suggestionId : undefined}
                      onApplySuggestion={isOwner && suggestionId ? handleApplySuggestion : undefined}
                    />
                  );
                })}
              </div>
            </section>


            <section className="card rooms-actions-card">
              <div className="card-header rooms-card-header">
                <div>
                  <p className="eyebrow">{isOwner ? "COMMAND" : "ACTIONS"}</p>
                  <h2 className="card-title">Room Controls</h2>
                </div>
              </div>
              <div className="rooms-actions-body">
                <ControlBar
                  phase={phase}
                  status={status}
                  selection={selection}
                  skins={skins}
                  onChanged={() => api.getSelection().then(setSelection)}
                  room={room ?? undefined}
                  isOwner={isOwner || false}
                  activeRoomColor={activeRoomColor}
                  skinOptions={skinOptions}
                  isSyncing={isSyncing}
                  suggestColor={suggestColor}
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
