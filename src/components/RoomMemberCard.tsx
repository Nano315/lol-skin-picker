// src/components/RoomMemberCard.tsx
import { useChromaColor } from "@/features/hooks/useChromaColor";
import type { RoomMember } from "@/features/roomsClient";
import fallbackSkin from "/fallback-skin.png?url";

type Props = {
  member?: RoomMember;
  /** 0..4 => slot1..slot5 */
  slotIndex: number;
  suggestedChromaId?: number;
  onApplySuggestion?: () => void;
};

export function RoomMemberCard({ 
  member, 
  slotIndex,
  suggestedChromaId,
  onApplySuggestion,
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

  // Calculate suggestion color if present
  const suggestionColor = useChromaColor({
    championId,
    skinId,
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
        <div className="room-member-name">{member!.name}</div>
      ) : (
        <div className="room-member-placeholder">Empty slot</div>
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
