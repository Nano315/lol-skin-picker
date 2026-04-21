import { useState } from "react";
import { Dices, Palette, Sparkles, Loader2 } from "lucide-react";
import { api } from "@/features/api";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { OwnedSkin, Selection, ConnectionStatus } from "@/features/types";
import type { RoomState, GroupSkinOption } from "@/features/roomsClient";
import { ColorSuggestionButton } from "./ColorSuggestionButton";

type ControlBarProps = {
  phase: string;
  status?: ConnectionStatus;
  selection: Selection;
  skins: OwnedSkin[];
  onChanged: () => void;
  room?: RoomState;
  isOwner?: boolean;
  activeRoomColor?: string;
  skinOptions?: GroupSkinOption[];
  isSyncing?: boolean;
  syncProgress?: number;
  suggestColor?: (skinId: number, chromaId: number) => Promise<{ success: boolean; error?: string }>;
};

export default function ControlBar({
  phase,
  status = "disconnected",
  selection,
  skins,
  onChanged,
  room,
  isOwner = false,
  activeRoomColor,
  skinOptions,
  isSyncing = false,
  syncProgress = 0,
  suggestColor,
}: ControlBarProps) {
  const notInChampSelect = phase !== "ChampSelect";
  const noChampion = selection.championId === 0;
  const notLocked = !selection.locked;
  const isConnected = status === "connected";

  const canInteract = isConnected && !notInChampSelect && !noChampion && !notLocked && !isSyncing;

  const currentSkinId = selection.skinId;
  const currentSkin = skins.find((s) => s.id === currentSkinId);
  const hasChromas = (currentSkin?.chromas?.length ?? 0) > 0;

  const [isRerollLoading, setIsRerollLoading] = useState(false);
  const [isChromaLoading, setIsChromaLoading] = useState(false);
  const [isMagicLoading, setIsMagicLoading] = useState(false);

  const synergyColors = (room?.synergy?.colors ?? []).filter(
    (c) => c.combinationCount > 0
  );

  const getSynergyCandidates = () => {
    if (!activeRoomColor) return [];

    const candidates: { skinId: number; chromaId: number }[] = [];
    const colorLower = activeRoomColor.toLowerCase();

    if (skinOptions && skinOptions.length > 0) {
      for (const opt of skinOptions) {
        if (opt.auraColor === activeRoomColor) {
          candidates.push({ skinId: opt.skinId, chromaId: opt.chromaId });
        }
      }
      return candidates;
    }

    for (const skin of skins) {
      if (skin.chromas) {
        for (const chroma of skin.chromas) {
          if (chroma.name.toLowerCase().includes(colorLower)) {
            candidates.push({ skinId: skin.id, chromaId: chroma.id });
          }
        }
      }
    }
    return candidates;
  };

  const synergyCandidates = getSynergyCandidates();
  const canSynergyReroll = canInteract && synergyCandidates.length > 0;

  const handleSynergyReroll = async () => {
    if (synergyCandidates.length === 0 || isMagicLoading) return;
    setIsMagicLoading(true);

    try {
      let pool = synergyCandidates;
      if (pool.length > 1) {
        pool = pool.filter(c => c.skinId !== selection.skinId || c.chromaId !== (selection.chromaId || 0));
        if (pool.length === 0) pool = synergyCandidates;
      }

      const pick = pool[Math.floor(Math.random() * pool.length)];

      await api.setSkin(pick.skinId);
      if (pick.chromaId !== 0) {
        await api.setChroma(pick.chromaId);
      }
      onChanged();
      await new Promise(r => setTimeout(r, 500));
    } finally {
      setIsMagicLoading(false);
    }
  };

  const handleRerollSkin = async () => {
    if (isRerollLoading) return;
    setIsRerollLoading(true);
    try {
      await api.rerollSkin();
      await new Promise(r => setTimeout(r, 500));
    } finally {
      setIsRerollLoading(false);
    }
  };

  const handleRerollChroma = async () => {
    if (isChromaLoading) return;
    setIsChromaLoading(true);
    try {
      await api.rerollChroma();
      await new Promise(r => setTimeout(r, 500));
    } finally {
      setIsChromaLoading(false);
    }
  };

  let statusMessage = "Ready";
  let statusIcon: React.ReactNode = null;

  if (!isConnected) {
    statusMessage = "Waiting for League Client...";
    statusIcon = <Loader2 className="h-4 w-4 animate-spin" aria-hidden />;
  } else if (notInChampSelect) {
    statusMessage = "Waiting for Champion Select...";
  } else if (noChampion) {
    statusMessage = "Select a champion...";
  } else if (notLocked) {
    statusMessage = "Lock in your champion to sync";
  } else if (isSyncing) {
    statusMessage = syncProgress > 0 ? `Computing synergies... ${syncProgress}%` : "Computing synergies...";
    statusIcon = <Loader2 className="h-4 w-4 animate-spin" aria-hidden />;
  }

  const showMagicButton = !!activeRoomColor && canSynergyReroll;

  return (
    <div className="flex w-full flex-col gap-4">
      {!isOwner && room && synergyColors.length > 0 && !notInChampSelect && selection.locked === true && suggestColor && (
        <div
          className={cn(
            "mb-1 flex flex-col gap-2 border-b border-white/10 pb-3 transition-opacity",
            isSyncing && "pointer-events-none opacity-60"
          )}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">
            Suggestions
          </div>
          <div className="flex justify-center gap-2 py-2">
            {synergyColors.map((synergy) => (
              <ColorSuggestionButton
                key={synergy.color}
                synergy={synergy}
                skinOptions={skinOptions || []}
                suggestColor={suggestColor}
                disabled={isSyncing}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-row items-stretch gap-3">
        {!canInteract ? (
          <div className="flex min-h-[2.75rem] w-full items-center justify-center gap-2 text-sm text-muted">
            {statusIcon}
            <span>{statusMessage}</span>
          </div>
        ) : (
          <>
            {showMagicButton && (
              <Button
                variant="magic"
                size="lg"
                className="flex-1"
                onClick={handleSynergyReroll}
                loading={isMagicLoading}
                icon={<Sparkles className="h-4 w-4" aria-hidden />}
              >
                Match Team
              </Button>
            )}
            <Button
              variant="primary"
              size="lg"
              className="flex-[2]"
              onClick={handleRerollSkin}
              loading={isRerollLoading}
              icon={<Dices className="h-5 w-5" aria-hidden />}
              title="Random Skin"
            >
              {showMagicButton ? "Random" : "Random Skin"}
            </Button>
            {hasChromas && (
              <Button
                variant="secondary"
                size="icon-lg"
                onClick={handleRerollChroma}
                loading={isChromaLoading}
                icon={<Palette className="h-5 w-5" aria-hidden />}
                title="Shuffle Chroma"
                aria-label="Shuffle Chroma"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
