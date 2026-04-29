import { useState } from "react";
import { api } from "@/features/api";
import { cn } from "@/lib/utils";
import type { OwnedSkin, Selection, ConnectionStatus } from "@/features/types";
import type { RoomState, GroupSkinOption } from "@/features/roomsClient";
import { ColorSuggestionButton } from "./ColorSuggestionButton";
import RerollActions from "./RerollActions";

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

/**
 * Multi-aware wrapper used in Rooms.
 *
 * Composé de 2 strates : strip de suggestions (membres uniquement), puis le
 * trio standard Reroll/Skin/Chroma — étendu en layout "diamond" côté owner
 * pour intégrer un CTA "Match Team" (cf. RerollActions). Le CTA reste
 * persistant au gré des recalculs de couleur d'équipe (juste désactivé)
 * pour éviter le shift visuel à chaque tour.
 *
 * En solo (Home) on n'utilise pas ControlBar — RerollActions est appelé
 * directement, sans synergy ni propriétaire.
 */
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
  suggestColor,
}: ControlBarProps) {
  const notInChampSelect = phase !== "ChampSelect";

  // ---------- Member-side : color suggestions strip ----------
  const synergyColors = (room?.synergy?.colors ?? []).filter(
    (c) => c.combinationCount > 0
  );

  const showSuggestionStrip =
    !isOwner &&
    !!room &&
    synergyColors.length > 0 &&
    !notInChampSelect &&
    selection.locked === true &&
    !!suggestColor;

  // ---------- Owner-side : Match Team candidates ----------
  function getSynergyCandidates() {
    if (!activeRoomColor) return [] as { skinId: number; chromaId: number }[];

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
  }

  const synergyCandidates = getSynergyCandidates();

  const [isMagicLoading, setIsMagicLoading] = useState(false);

  async function handleSynergyReroll() {
    if (synergyCandidates.length === 0 || isMagicLoading) return;
    setIsMagicLoading(true);

    try {
      let pool = synergyCandidates;
      if (pool.length > 1) {
        pool = pool.filter(
          (c) =>
            c.skinId !== selection.skinId ||
            c.chromaId !== (selection.chromaId || 0)
        );
        if (pool.length === 0) pool = synergyCandidates;
      }

      const pick = pool[Math.floor(Math.random() * pool.length)];

      await api.setSkin(pick.skinId);
      if (pick.chromaId !== 0) {
        await api.setChroma(pick.chromaId);
      }
      onChanged();
      await new Promise((r) => setTimeout(r, 500));
    } finally {
      setIsMagicLoading(false);
    }
  }

  // synergyAction est défini en owner+room. RerollActions s'occupe de
  // rendre le CTA "Match Team" en haut du losange et de gérer son état
  // disabled (couleur absente ou pas de candidats). Le bouton reste donc
  // toujours visible tant qu'on est owner — cohérent avec la demande de
  // ne pas faire shifter le layout au gré des recalculs de team color.
  const synergyAction =
    isOwner && !!room
      ? {
          onClick: () => void handleSynergyReroll(),
          loading: isMagicLoading,
          color: activeRoomColor,
          candidatesCount: synergyCandidates.length,
        }
      : undefined;

  return (
    <div className="flex w-full flex-col gap-4">
      {/* ---------- Color Suggestions (members only) ---------- */}
      {showSuggestionStrip && (
        <div
          className={cn(
            "flex flex-col gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-opacity",
            isSyncing && "pointer-events-none opacity-60"
          )}
        >
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Suggest a color to your commander
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {synergyColors.map((synergy) => (
              <ColorSuggestionButton
                key={synergy.color}
                synergy={synergy}
                skinOptions={skinOptions || []}
                totalMembers={room?.members.length ?? 0}
                suggestColor={suggestColor!}
                disabled={isSyncing}
              />
            ))}
          </div>
        </div>
      )}

      {/* ---------- Reroll trio (+ Match Team CTA en owner) ---------- */}
      <RerollActions
        phase={phase}
        status={status}
        selection={selection}
        skins={skins}
        onChanged={onChanged}
        disabled={isSyncing || isMagicLoading}
        synergyAction={synergyAction}
      />
    </div>
  );
}
