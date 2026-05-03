import { useSelection } from "@/features/hooks/useSelection";
import { useRooms } from "@/features/hooks/useRooms";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { RoomMemberCard } from "@/components/RoomMemberCard";
import { useSummonerName } from "@/features/hooks/useSummonerName";
import type { RoomMember } from "@/features/roomsClient";
import ControlBar from "@/components/controls/ControlBar";
import AutoRollPill from "@/components/controls/AutoRollPill";
import { api } from "@/features/api";
import { roomsClient } from "@/features/roomsClient";
import { useOwnedSkins } from "@/features/hooks/useOwnedSkins";
import type { GroupSkinOption } from "@/features/roomsClient";
import { computeChromaColor } from "@/features/chromaColor";
import { colorCache } from "@/features/utils/colorCache";
import { findMemberBySummonerName } from "@/features/utils/summonerUtils";
import { ConnectionStatusIndicator } from "@/components/ConnectionStatusIndicator";
import {
  SyncProgressBar,
  SyncFlashOverlay,
  GlassCard,
  Reveal,
  GradientText,
  Button,
  CardHeader,
} from "@/components/ui";
import { SkinLineageSelector } from "@/components/rooms/SkinLineageSelector";
import { ChromaSelector } from "@/components/rooms/ChromaSelector";
import { KickConfirmModal } from "@/components/rooms/KickConfirmModal";
import { useToast } from "@/features/hooks/useToast";
import { trackSkinergy } from "@/features/analytics/tracker";
import { useOnlineFriends } from "@/features/hooks/useOnlineFriends";
import { OnlineFriendsList } from "@/components/social/OnlineFriendsList";
import { AnimatePresence, motion } from "framer-motion";
import {
  Copy,
  Check,
  LogOut,
  Plus,
  KeyRound,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PremadePage() {
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
  // Pending kick target: when set, the confirmation modal is open. Cleared on
  // cancel or after the kick socket call fires. Tracks the full RoomMember so
  // the modal can show the name even if the underlying member is removed
  // mid-render.
  const [pendingKick, setPendingKick] = useState<RoomMember | null>(null);

  // Handle fatal errors - redirect to home
  useEffect(() => {
    if (isFatalError && joined) {
      const message =
        error?.code === "KICKED"
          ? "You were removed from the room. Redirecting to home..."
          : "Room closed. Redirecting to home...";
      showToast({
        type: "error",
        message,
        duration: 3000,
      });
      leave();
      // Small delay to show toast before redirecting
      const timeout = setTimeout(() => {
        navigate("/");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isFatalError, error?.code, joined, leave, navigate, showToast]);

  const [skinOptions, setSkinOptions] = useState<GroupSkinOption[]>([]);

  // Track previous phase to detect when leaving ChampSelect
  const prevPhaseRef = useRef(phase);
  useEffect(() => {
    // Clear suggestions and reset selectors when phase changes from ChampSelect to something else
    if (prevPhaseRef.current === "ChampSelect" && phase !== "ChampSelect") {
      clearSuggestions();
      setActiveSkinLineId(null);
      setActiveChromaColor(null);
    }
    prevPhaseRef.current = phase;
  }, [phase, clearSuggestions]);

  // Track previous room members to clear suggestions when someone leaves
  const prevMemberIdsRef = useRef<string[]>([]);
  useEffect(() => {
    const currentMemberIds = room?.members.map((m) => m.id) ?? [];
    const prevMemberIds = prevMemberIdsRef.current;

    // Check if any member left
    const leftMembers = prevMemberIds.filter(
      (id) => !currentMemberIds.includes(id),
    );
    if (leftMembers.length > 0 && Object.keys(suggestedColorsMap).length > 0) {
      // Clear suggestions from members who left
      const hasLeftMemberSuggestion = leftMembers.some(
        (id) => suggestedColorsMap[id],
      );
      if (hasLeftMemberSuggestion) {
        clearSuggestions();
      }
    }

    prevMemberIdsRef.current = currentMemberIds;
  }, [room?.members, suggestedColorsMap, clearSuggestions]);

  // State for sync flash overlay
  const [showSyncFlash, setShowSyncFlash] = useState<string | null>(null);

  // Active sync states
  const [activeSkinLineId, setActiveSkinLineId] = useState<number | null>(null);
  const [activeChromaColor, setActiveChromaColor] = useState<string | null>(null);

  // Show toast and flash when group combo is applied
  useEffect(() => {
    if (lastGroupCombo) {
      const currentMemberId = roomsClient.getMemberId();
      const isMySuggestion = lastGroupCombo.sourceMemberId === currentMemberId;

      const isSkinLine = lastGroupCombo.type === "skinLine";
      showToast({
        type: isMySuggestion ? "success" : "info",
        message: isMySuggestion
          ? "Your suggestion was accepted!"
          : isSkinLine
            ? `Team syncing on ${lastGroupCombo.skinLineName ?? "skin line"}!`
            : "Team syncing on color!",
        duration: 3000,
      });
      if (lastGroupCombo.color) {
        setShowSyncFlash(lastGroupCombo.color);
      }
      clearGroupCombo();
    }
  }, [lastGroupCombo, showToast, clearGroupCombo]);

  const isConnected = status === "connected";
  const summonerName = useSummonerName(status);
  const canUseRooms = isConnected && !!summonerName;

  // Online friends (Story 4.4) - consumes global presenceStore
  const { onlineFriends } = useOnlineFriends();

  // Names of members currently in the room (used to disable the invite action
  // for friends who have already joined).
  const roomMemberNames = useMemo(
    () => room?.members.map((m) => m.name) ?? [],
    [room?.members]
  );

  // Auto-create-and-invite flow: a FriendCard can request "ensure a room
  // exists, then give me its code". If we already have a room, we return its
  // code synchronously; otherwise we create one on the fly and return the
  // fresh code. Concurrent callers share a single in-flight creation so we
  // don't spawn multiple rooms when several cards are clicked at once.
  const ensureRoomInFlight = useRef<Promise<string | null> | null>(null);
  const ensureRoom = useCallback(async (): Promise<string | null> => {
    const existing = roomsClient.getCurrentRoom();
    if (existing?.code) return existing.code;
    if (!summonerName || !canUseRooms) return null;
    if (ensureRoomInFlight.current) return ensureRoomInFlight.current;

    const pending = (async () => {
      const newRoom = await create(summonerName);
      return newRoom?.code ?? null;
    })();
    ensureRoomInFlight.current = pending;
    try {
      return await pending;
    } finally {
      ensureRoomInFlight.current = null;
    }
  }, [summonerName, canUseRooms, create]);

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

  const handleApplySkinLine = (skinLineId: number | null) => {
    setActiveSkinLineId(skinLineId);
    if (skinLineId !== null) {
      setActiveChromaColor(null); // Deselect chroma when selecting a new skin line
      roomsClient.applySkinLineSynergy(skinLineId);
    } else {
      // Going back to "Default" — also reset chroma
      setActiveChromaColor(null);
    }
  };

  const handleApplyChroma = (color: string | null) => {
    setActiveChromaColor(color);
    if (color !== null) {
      // If no skin line is active, apply chroma directly
      // If a skin line IS active, keep the skin line and apply the chroma within that context
      roomsClient.requestGroupReroll({
        type: "sameColor",
        color,
        skinLineId: activeSkinLineId ?? undefined,
      });
    }
  };

  // Filter chroma synergies by active skin line when one is selected
  const filteredChromaSynergies = useMemo(() => {
    if (!room?.synergy?.colors) return [];
    if (activeSkinLineId === null) return room.synergy.colors;

    // Get the set of aura colors available within the active skin line's options
    const skinLineColors = new Set<string>();
    for (const opt of skinOptions) {
      if (opt.skinLineId === activeSkinLineId && opt.auraColor) {
        skinLineColors.add(opt.auraColor);
      }
    }

    if (skinLineColors.size === 0) return [];

    return room.synergy.colors.filter((c) => skinLineColors.has(c.color));
  }, [room?.synergy?.colors, activeSkinLineId, skinOptions]);

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
    if (!joined || !isConnected || !selection.championId || !skins?.length)
      return;

    let isMounted = true;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    async function computeOptionWithCache(
      championId: number,
      skinId: number,
      chromaId: number,
    ): Promise<GroupSkinOption | null> {
      // Check color cache first
      const cachedColor = colorCache.get(championId, skinId, chromaId);

      // Fetch skin line info and color in parallel for performance (Story 6.1)
      const [color, skinLineInfo] = await Promise.all([
        cachedColor
          ? Promise.resolve(cachedColor)
          : computeChromaColor({ championId, skinId, chromaId }),
        window.lcu.getSkinLine(skinId),
      ]);

      // Cache the color if it was computed
      if (color && !cachedColor) {
        colorCache.set(championId, skinId, chromaId, color);
      }

      return {
        skinId,
        chromaId,
        auraColor: color ?? null,
        skinLineId: skinLineInfo?.id,
        skinLineName: skinLineInfo?.name,
      };
    }

    async function computeAndSend() {
      if (!isMounted) return;

      setIsSyncing(true);
      setSyncProgress(0);
      console.time("[Rooms] Sync duration");
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

        console.log(
          `[Rooms] Processing ${computations.length} skin/chroma combinations...`,
        );
        let completed = 0;

        // Process all computations in parallel
        const promises = computations.map(async ({ skinId, chromaId }) => {
          const result = await computeOptionWithCache(
            selection.championId,
            skinId,
            chromaId,
          );
          completed++;
          if (isMounted) {
            setSyncProgress(
              Math.round((completed / computations.length) * 100),
            );
          }
          return result;
        });

        const results = await Promise.allSettled(promises);
        if (!isMounted) return;

        const options = results
          .filter(
            (r): r is PromiseFulfilledResult<GroupSkinOption | null> =>
              r.status === "fulfilled",
          )
          .map((r) => r.value)
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
        console.timeEnd("[Rooms] Sync duration");
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
  }, [
    joined,
    selection.championId,
    selection.championAlias,
    isConnected,
    skins,
  ]);

  const activeRoomColor = useMemo(() => {
    if (!room?.synergy?.colors || !skinOptions.length) return undefined;
    const currentOption = skinOptions.find(
      (o) => o.skinId === selection.skinId && o.chromaId === selection.chromaId,
    );
    if (!currentOption?.auraColor) return undefined;
    const synergy = room.synergy.colors.find(
      (c) => c.color === currentOption.auraColor,
    );
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
        <main className="relative flex flex-col items-center px-4 pb-12 pt-7">
          <div className="mx-auto w-full max-w-[1200px] px-2 sm:px-4">
            <ConnectionStatusIndicator
              error={error}
              isConnected={isConnected}
              isRetrying={isRetrying}
              onRetry={canRetry ? retry : undefined}
            />
            <div className="grid grid-cols-12 gap-6">
              {error && error.code !== "NETWORK_ERROR" && (
                <Reveal delay={0} className="col-span-12">
                  <GlassCard
                    hover={false}
                    className="flex flex-col items-center gap-3 border-rose-400/30 bg-rose-500/[0.04] text-center"
                  >
                    <div className="inline-flex items-center gap-2 text-rose-200">
                      <AlertTriangle className="h-4 w-4" aria-hidden />
                      <span className="text-sm font-medium">
                        {error.message}
                      </span>
                    </div>
                    {canRetry && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={retry}
                        loading={isRetrying}
                        icon={<RefreshCw className="h-3.5 w-3.5" aria-hidden />}
                      >
                        {isRetrying ? "Retrying..." : "Retry"}
                      </Button>
                    )}
                  </GlassCard>
                </Reveal>
              )}

              {/* ---------- Create Room ---------- */}
              <Reveal delay={0} className="col-span-12 md:col-span-6">
                <GlassCard className="flex h-full flex-col gap-4">
                  <CardHeader
                    eyebrow="Create"
                    title={
                      <>
                        Start a <GradientText>new lobby</GradientText>
                      </>
                    }
                  />
                  <p className="m-0 text-sm leading-relaxed text-muted">
                    Generate a fresh room and invite your group instantly.
                  </p>
                  <div className="mt-auto">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={() => summonerName && create(summonerName)}
                      disabled={!canUseRooms || isLoading}
                      loading={isLoading}
                      icon={<Plus className="h-5 w-5" aria-hidden />}
                    >
                      {isLoading ? "Creating..." : "Create room"}
                    </Button>
                  </div>
                </GlassCard>
              </Reveal>

              {/* ---------- Join Room ---------- */}
              <Reveal delay={0.08} className="col-span-12 md:col-span-6">
                <GlassCard className="flex h-full flex-col gap-4">
                  <CardHeader
                    eyebrow="Join"
                    title={
                      <>
                        Enter a <GradientText>room code</GradientText>
                      </>
                    }
                  />
                  <p className="m-0 text-sm leading-relaxed text-muted">
                    Enter the shared code to sync up with your teammates.
                  </p>
                  <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-stretch">
                    <input
                      className={cn(
                        "flex-1 rounded-full border border-white/10 bg-black/30 px-5 py-3 text-sm text-white",
                        "placeholder:text-white/30",
                        "outline-none transition-colors duration-200",
                        "focus:border-white/30 focus:bg-black/40",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                      )}
                      placeholder="Room code (e.g. ABC123)"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      disabled={isLoading}
                      maxLength={8}
                    />
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() =>
                        summonerName && join(code.trim(), summonerName)
                      }
                      disabled={!canUseRooms || !code.trim() || isLoading}
                      loading={isLoading}
                      icon={<KeyRound className="h-4 w-4" aria-hidden />}
                    >
                      {isLoading ? "Joining..." : "Join room"}
                    </Button>
                  </div>
                </GlassCard>
              </Reveal>

              {/* ---------- Online Friends ---------- */}
              <Reveal delay={0.16} className="col-span-12">
                <OnlineFriendsList
                  friends={onlineFriends}
                  currentRoomCode={undefined}
                  ensureRoom={canUseRooms ? ensureRoom : undefined}
                  isLcuConnected={isConnected}
                />
              </Reveal>
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
      <main className="relative flex flex-col items-center px-4 pb-12 pt-7">
        <div className="mx-auto w-full max-w-[1200px] px-2 sm:px-4">
          <ConnectionStatusIndicator
            error={error}
            isConnected={isConnected}
            isRetrying={isRetrying}
            onRetry={canRetry ? retry : undefined}
          />
          <div className="grid grid-cols-12 gap-6">
            {/* ---------- Squad Card ---------- */}
            <Reveal delay={0} className="col-span-12">
              <GlassCard className="flex flex-col gap-5">
                <CardHeader
                  eyebrow={isOwner ? "Command Squad" : "Squad"}
                  title={
                    <span className="flex flex-wrap items-center gap-2">
                      <span>Lobby</span>
                      <RoomCodePill
                        code={room?.code ?? ""}
                        copied={copied}
                        onCopy={handleCopyCode}
                      />
                    </span>
                  }
                  trailing={
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={leave}
                      icon={<LogOut className="h-4 w-4" aria-hidden />}
                    >
                      Leave
                    </Button>
                  }
                />

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {orderedSlots.map(({ member, slotIndex }) => {
                    const suggestion = member
                      ? suggestedColorsMap[member.id]
                      : undefined;

                    const handleApplySuggestion = () => {
                      if (!suggestion || !room || !member) return;
                      (async () => {
                        const color = await computeChromaColor({
                          championId: member.championId,
                          skinId: suggestion.skinId,
                          chromaId: suggestion.chromaId,
                        });
                        if (color)
                          roomsClient.requestGroupReroll({
                            type: "sameColor",
                            color,
                            sourceMemberId: member.id,
                          });
                      })();
                    };

                    const cardIsOwner =
                      !!member && !!room && room.ownerId === member.id;
                    // Owner sees a kick button on every other member's card.
                    // Self-card and empty slots get no button.
                    const canKickThisMember =
                      isOwner &&
                      !!member &&
                      !cardIsOwner; // never kick the owner (yourself)

                    return (
                      <RoomMemberCard
                        key={member?.id ?? `empty-${slotIndex}`}
                        member={member ?? undefined}
                        slotIndex={slotIndex}
                        isOwner={cardIsOwner}
                        onKick={
                          canKickThisMember ? (m) => setPendingKick(m) : undefined
                        }
                        suggestedSkinId={
                          isOwner && suggestion ? suggestion.skinId : undefined
                        }
                        suggestedChromaId={
                          isOwner && suggestion ? suggestion.chromaId : undefined
                        }
                        onApplySuggestion={
                          isOwner && suggestion
                            ? handleApplySuggestion
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              </GlassCard>
            </Reveal>

            {/* ---------- Actions Card ---------- */}
            <Reveal delay={0.08} className="col-span-12">
              <GlassCard className="flex flex-col gap-4">
                <CardHeader
                  eyebrow={isOwner ? "Command" : "Actions"}
                  title="Room Controls"
                  trailing={<AutoRollPill />}
                />
                <div className="flex flex-col gap-3">
                  {isSyncing && (
                    <SyncProgressBar
                      progress={syncProgress}
                      label="Computing synergies..."
                    />
                  )}
                  {isOwner && room && room.synergy && phase === "ChampSelect" && (
                    <>
                      <SkinLineageSelector
                        synergies={room.synergy.skinLines}
                        onApply={handleApplySkinLine}
                        activeId={activeSkinLineId}
                        totalMembers={room.members.length}
                        disabled={isSyncing}
                      />
                      <ChromaSelector
                        synergies={filteredChromaSynergies}
                        onApply={handleApplyChroma}
                        activeColor={activeChromaColor}
                        totalMembers={room.members.length}
                        disabled={isSyncing}
                      />
                    </>
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
              </GlassCard>
            </Reveal>

            {/* ---------- Online Friends ---------- */}
            <Reveal delay={0.16} className="col-span-12">
              <OnlineFriendsList
                friends={onlineFriends}
                currentRoomCode={room?.code}
                roomMemberNames={roomMemberNames}
                isLcuConnected={isConnected}
              />
            </Reveal>
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

      {/* Owner-triggered kick confirmation. Closes on cancel; on confirm, the
          server emits room-closed → kicked to the target's socket and a fresh
          room-state to everyone else, so we just fire-and-forget. */}
      {pendingKick && (
        <KickConfirmModal
          memberName={pendingKick.name}
          onCancel={() => setPendingKick(null)}
          onConfirm={() => {
            roomsClient.kickMember(pendingKick.id);
            setPendingKick(null);
          }}
        />
      )}
    </div>
  );
}

/* ---------- Local primitives (scoped to Rooms) ---------- */

function RoomCodePill({
  code,
  copied,
  onCopy,
}: {
  code: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onCopy}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-full border border-white/10",
        "bg-white/[0.03] px-3 py-1 text-[0.85em] font-bold tracking-[0.08em] text-white",
        "transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.06]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      )}
      title="Copy room code"
    >
      <span className="font-mono">{code}</span>
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-400/90 px-2 py-0.5 text-[0.6em] font-semibold uppercase tracking-[0.14em] text-emerald-950"
          >
            <Check className="h-3 w-3" aria-hidden />
            Copied
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center text-muted transition-colors group-hover:text-white"
          >
            <Copy className="h-3.5 w-3.5" aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
