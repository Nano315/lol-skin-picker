// src/pages/Rooms/Rooms.tsx
import { useSelection } from "@/features/hooks/useSelection";
import { useRooms } from "@/features/hooks/useRooms";
import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { colorCache } from "@/features/utils/colorCache";
import { findMemberBySummonerName } from "@/features/utils/summonerUtils";
import { ConnectionStatusIndicator } from "@/components/ConnectionStatusIndicator";
import { SyncProgressBar, SyncFlashOverlay } from "@/components/ui";
import { useToast } from "@/features/hooks/useToast";
import { trackSkinergy } from "@/features/analytics/tracker";

export function RoomsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { status, iconId } = useConnection();
  const phase = useGameflow();
  const [selection, setSelection] = useSelection();
  const skins = useOwnedSkins();
  const {
    room,
    joined,
    error,
    isLoading,
    isRetrying,
    canRetry,
    isFatalError,
    create,
    join,
    leave,
    retry,
    suggestColor,
    suggestedColorsMap,
    clearSuggestions,
    lastGroupCombo,
    clearGroupCombo,
  } = useRooms(selection);
  const [code, setCode] = useState("");

  // Handle fatal errors - redirect to home
  useEffect(() => {
    if (isFatalError && joined) {
      showToast({
        type: "error",
        message: "Room closed. Redirecting to home...",
        duration: 3000,
      });
      leave();
      // Small delay to show toast before redirecting
      const timeout = setTimeout(() => {
        navigate("/");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isFatalError, joined, leave, navigate, showToast]);

  const [skinOptions, setSkinOptions] = useState<GroupSkinOption[]>([]);

  // Track previous phase to detect when leaving ChampSelect
  const prevPhaseRef = useRef(phase);
  useEffect(() => {
    // Clear suggestions when phase changes from ChampSelect to something else
    if (prevPhaseRef.current === 'ChampSelect' && phase !== 'ChampSelect') {
      clearSuggestions();
    }
    prevPhaseRef.current = phase;
  }, [phase, clearSuggestions]);

  // Track previous room members to clear suggestions when someone leaves
  const prevMemberIdsRef = useRef<string[]>([]);
  useEffect(() => {
    const currentMemberIds = room?.members.map(m => m.id) ?? [];
    const prevMemberIds = prevMemberIdsRef.current;

    // Check if any member left
    const leftMembers = prevMemberIds.filter(id => !currentMemberIds.includes(id));
    if (leftMembers.length > 0 && Object.keys(suggestedColorsMap).length > 0) {
      // Clear suggestions from members who left
      const hasLeftMemberSuggestion = leftMembers.some(id => suggestedColorsMap[id]);
      if (hasLeftMemberSuggestion) {
        clearSuggestions();
      }
    }

    prevMemberIdsRef.current = currentMemberIds;
  }, [room?.members, suggestedColorsMap, clearSuggestions]);

  // State for sync flash overlay
  const [showSyncFlash, setShowSyncFlash] = useState<string | null>(null);

  // Show toast and flash when group combo is applied
  useEffect(() => {
    if (lastGroupCombo) {
      const currentMemberId = roomsClient.getMemberId();
      const isMySuggestion = lastGroupCombo.sourceMemberId === currentMemberId;

      showToast({
        type: isMySuggestion ? "success" : "info",
        message: isMySuggestion
          ? "Ta suggestion a été acceptée!"
          : "Team syncing on color!",
        duration: 3000,
      });
      setShowSyncFlash(lastGroupCombo.color);
      clearGroupCombo();
    }
  }, [lastGroupCombo, showToast, clearGroupCombo]);

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

    const selfMember: RoomMember =
      findMemberBySummonerName(members, summonerName) ?? members[0];

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
      const self = findMemberBySummonerName(room.members, summonerName);
      return !!self && room.ownerId === self.id;
    })();

  // -> Appliquer le combo quand le serveur en choisit un
  useEffect(() => {
    if (!room || !summonerName) return;

    const self = findMemberBySummonerName(room.members, summonerName);
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
  const [syncProgress, setSyncProgress] = useState(0);

  // Calcul et envoi des skins possedes (Owned Options) - Parallelized with cache
  useEffect(() => {
    if (!joined || !isConnected || !selection.championId || !skins?.length) return;

    let isMounted = true;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    async function computeOptionWithCache(
      championId: number,
      skinId: number,
      chromaId: number
    ): Promise<GroupSkinOption | null> {
      // Check cache first
      const cached = colorCache.get(championId, skinId, chromaId);
      if (cached) {
        return { skinId, chromaId, auraColor: cached };
      }

      // Compute and cache
      const color = await computeChromaColor({ championId, skinId, chromaId });
      if (color) {
        colorCache.set(championId, skinId, chromaId, color);
        return { skinId, chromaId, auraColor: color };
      }

      return { skinId, chromaId, auraColor: null };
    }

    async function computeAndSend() {
      if (!isMounted) return;

      setIsSyncing(true);
      setSyncProgress(0);
      console.time('[Rooms] Sync duration');
      console.log("[Rooms] Computing skin colors for synergy (parallel)...");

      try {
        // Build list of all computations needed
        const computations: Array<{ skinId: number; chromaId: number }> = [];
        for (const s of skins) {
          if (s.championId !== selection.championId) continue;
          // Base skin (chromaId = 0)
          computations.push({ skinId: s.id, chromaId: 0 });
          // Chromas
          for (const c of s.chromas) {
            computations.push({ skinId: s.id, chromaId: c.id });
          }
        }

        if (computations.length === 0) {
          setSkinOptions([]);
          return;
        }

        console.log(`[Rooms] Processing ${computations.length} skin/chroma combinations...`);
        let completed = 0;

        // Process all computations in parallel
        const promises = computations.map(async ({ skinId, chromaId }) => {
          const result = await computeOptionWithCache(selection.championId, skinId, chromaId);
          completed++;
          if (isMounted) {
            setSyncProgress(Math.round((completed / computations.length) * 100));
          }
          return result;
        });

        const results = await Promise.allSettled(promises);
        if (!isMounted) return;

        const options = results
          .filter((r): r is PromiseFulfilledResult<GroupSkinOption | null> => r.status === 'fulfilled')
          .map(r => r.value)
          .filter((opt): opt is GroupSkinOption => opt !== null);

        setSkinOptions(options);
        if (options.length > 0) {
          console.log(`[Rooms] Sending ${options.length} options to server.`);
          roomsClient.sendOwnedOptions({
            championId: selection.championId,
            championAlias: selection.championAlias,
            options,
          });
        }
      } finally {
        console.timeEnd('[Rooms] Sync duration');
        if (isMounted) {
          setIsSyncing(false);
          setSyncProgress(100);
        }
      }
    }

    // Debounce to avoid multiple rapid computations
    debounceTimer = setTimeout(computeAndSend, 300);

    return () => {
      isMounted = false;
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [joined, selection.championId, selection.championAlias, isConnected, skins]);

  const activeRoomColor = useMemo(() => {
    if (!room?.synergy?.colors || !skinOptions.length) return undefined;
    const currentOption = skinOptions.find(o => o.skinId === selection.skinId && o.chromaId === selection.chromaId);
    if (!currentOption?.auraColor) return undefined;
    const synergy = room.synergy.colors.find(c => c.color === currentOption.auraColor);
    return synergy ? synergy.color : undefined;
  }, [room, skinOptions, selection.skinId, selection.chromaId]);

  // Track skinergy matches
  const prevSynergyCountRef = useRef(0);
  useEffect(() => {
    const synergyCount = room?.synergy?.colors?.length ?? 0;
    // Only track when synergy count increases (new match found)
    if (synergyCount > 0 && synergyCount > prevSynergyCountRef.current) {
      trackSkinergy(synergyCount);
    }
    prevSynergyCountRef.current = synergyCount;
  }, [room?.synergy?.colors]);

  /* ===================== VUE "PAS ENCORE DANS UNE ROOM" ===================== */

  if (!joined) {
    return (
      <div className="app">
        <Header status={status} phase={phase} iconId={iconId} />
        <main className="main">
          <div className="page-shell rooms-shell">
            <ConnectionStatusIndicator
              error={error}
              isConnected={isConnected}
              isRetrying={isRetrying}
              onRetry={canRetry ? retry : undefined}
            />
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

              {error && error.code !== 'NETWORK_ERROR' && (
                <div className="rooms-error-block">
                  <p className="rooms-error-message">{error.message}</p>
                  {canRetry && (
                    <button
                      className="rooms-retry-btn"
                      onClick={retry}
                      disabled={isRetrying}
                    >
                      {isRetrying ? "Retrying..." : "Retry"}
                    </button>
                  )}
                </div>
              )}

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
                  disabled={!canUseRooms || isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create room'}
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
                    disabled={isLoading}
                  />
                  <button
                    className="rooms-primary-btn"
                    onClick={() =>
                      summonerName && join(code.trim(), summonerName)
                    }
                    disabled={!canUseRooms || !code.trim() || isLoading}
                  >
                    {isLoading ? 'Joining...' : 'Join room'}
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
          <ConnectionStatusIndicator
            error={error}
            isConnected={isConnected}
            isRetrying={isRetrying}
            onRetry={canRetry ? retry : undefined}
          />
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
                  const suggestion = member ? suggestedColorsMap[member.id] : undefined;

                  const handleApplySuggestion = () => {
                     if (!suggestion || !room || !member) return;
                     (async () => {
                        const color = await computeChromaColor({
                           championId: member.championId,
                           skinId: suggestion.skinId,
                           chromaId: suggestion.chromaId
                        });
                        if (color) roomsClient.requestGroupReroll({ type: "sameColor", color, sourceMemberId: member.id });
                     })();
                  };

                  return (
                    <RoomMemberCard
                      key={member?.id ?? `empty-${slotIndex}`}
                      member={member ?? undefined}
                      slotIndex={slotIndex}
                      suggestedSkinId={isOwner && suggestion ? suggestion.skinId : undefined}
                      suggestedChromaId={isOwner && suggestion ? suggestion.chromaId : undefined}
                      onApplySuggestion={isOwner && suggestion ? handleApplySuggestion : undefined}
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
                {isSyncing && (
                  <SyncProgressBar progress={syncProgress} label="Computing synergies..." />
                )}
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
                  syncProgress={syncProgress}
                  suggestColor={suggestColor}
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Sync Flash Overlay */}
      {showSyncFlash && (
        <SyncFlashOverlay
          color={showSyncFlash}
          onComplete={() => setShowSyncFlash(null)}
        />
      )}
    </div>
  );
}
