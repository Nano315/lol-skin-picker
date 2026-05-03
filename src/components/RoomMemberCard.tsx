// src/components/RoomMemberCard.tsx
import { Crown, Lock, UserMinus } from "lucide-react";
import { useChromaColor } from "@/features/hooks/useChromaColor";
import type { RoomMember } from "@/features/roomsClient";
import fallbackSkin from "/fallback-skin.png?url";

type Props = {
  member?: RoomMember;
  /** 0..4 => slot1..slot5 */
  slotIndex: number;
  suggestedSkinId?: number;
  suggestedChromaId?: number;
  onApplySuggestion?: () => void;
  /** True when this card represents the room owner. Shows a crown badge. */
  isOwner?: boolean;
  /** When provided, renders a kick button on hover; called with the member. */
  onKick?: (member: RoomMember) => void;
};

export function RoomMemberCard({
  member,
  slotIndex,
  suggestedSkinId,
  suggestedChromaId,
  onApplySuggestion,
  isOwner = false,
  onKick,
}: Props) {
  const isOccupied = !!member;

  // Valeurs "safe" pour les hooks & calculs
  const championId = member?.championId ?? 0;
  const skinId = member?.skinId ?? 0;
  const chromaId = member?.chromaId ?? 0;
  const championAlias = member?.championAlias ?? "";

  // Hook toujours appele, jamais conditionnel
  const chromaColor = useChromaColor({
    championId,
    skinId,
    chromaId,
    championAlias,
    locked: false,
  });

  // Calculate suggestion color if present - use suggested skinId, not member's current skin
  const suggestionColor = useChromaColor({
    championId,
    skinId: suggestedSkinId ?? skinId,
    chromaId: suggestedChromaId ?? 0,
    championAlias,
    locked: false,
  });

  // Gestion d'erreur pour charger l'image par defaut si le calcul d'URL echoue
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackSkin;
  };

  // Portrait loading screen
  let portraitUrl = "";
  if (championId && skinId && championAlias) {
    const skinIndex = skinId - championId * 1000;
    portraitUrl = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championAlias}_${skinIndex}.jpg`;
  }
  const displayedSkin = portraitUrl || fallbackSkin;

  const classes = [
    "room-member-card",
    "group/card",
    `room-member-card--slot-${slotIndex + 1}`,
    !isOccupied ? "room-member-card--empty" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={{
        backgroundColor: chromaColor ?? undefined,
        transition: "background-color 0.5s ease, border-color 0.5s ease",
        borderColor: chromaColor ? "rgba(255,255,255,0.2)" : undefined,
        position: 'relative'
      }}
    >
      <div className="room-member-skin">
        <img
          src={displayedSkin}
          alt={isOccupied ? member!.name : "Empty slot"}
          className="room-member-skin-img"
          onError={handleImgError}
        />
      </div>

      {isOccupied ? (
        <div className="room-member-name-wrapper">
          <span className="room-member-name">{member!.name}</span>
        </div>
      ) : (
        <div className="room-member-placeholder">Empty slot</div>
      )}

      {/* Skin held badge — visible to everyone, neutral wording so it reads as
          a status pill rather than a flag. */}
      {isOccupied && member!.lockedSkin && (
        <span
          title="Skin held for this match"
          aria-label="Skin held for this match"
          className="absolute left-2 top-2 z-[5] flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/80 backdrop-blur"
        >
          <Lock className="h-3 w-3" aria-hidden />
        </span>
      )}

      {/* Owner crown — visible to everyone so the leader is recognizable at
          a glance. Sits opposite the lock badge when both are present. */}
      {isOccupied && isOwner && (
        <span
          title="Room owner"
          aria-label="Room owner"
          className="absolute right-2 top-2 z-[5] flex h-6 w-6 items-center justify-center rounded-full border border-amber-300/40 bg-amber-500/25 text-amber-200 backdrop-blur"
        >
          <Crown className="h-3 w-3" aria-hidden />
        </span>
      )}

      {/* Kick button — only the room owner sees it, only on other members'
          cards. Triggers a confirmation modal upstream rather than removing
          immediately. */}
      {isOccupied && onKick && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onKick(member!);
          }}
          title={`Remove ${member!.name}`}
          aria-label={`Remove ${member!.name}`}
          className="absolute bottom-2 right-2 z-[6] flex h-7 w-7 items-center justify-center rounded-full border border-rose-300/30 bg-rose-500/30 text-rose-100 opacity-0 transition-opacity duration-150 hover:bg-rose-500/55 group-hover/card:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60"
        >
          <UserMinus className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}

      {/* Suggestion Badge (Owner only) */}
      {suggestedChromaId && onApplySuggestion && suggestionColor && (
        <button
          className="suggestion-badge"
          onClick={(e) => {
            e.stopPropagation();
            onApplySuggestion();
          }}
          title="Click to accept suggestion"
          style={{
            position: 'absolute',
            top: -10,
            right: -10,
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: suggestionColor,
            border: '2px solid white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            zIndex: 10,
            animation: 'pulse 2s infinite'
          }}
        >
           {/* Maybe a small icon inside? */}
        </button>
      )}
    </div>
  );
}
