// src/components/RoomMemberCard.tsx
import { useChromaColor } from "@/features/hooks/useChromaColor";
import type { RoomMember } from "@/features/roomsClient";
import fallbackSkin from "/fallback-skin.png?url";

type Props = {
  member?: RoomMember;
  slotIndex: number;
};

export function RoomMemberCard({ member }: Props) {
  const isOccupied = !!member;

  // Valeurs "safe" pour les hooks & calculs
  const championId = member?.championId ?? 0;
  const skinId = member?.skinId ?? 0;
  const chromaId = member?.chromaId ?? 0;
  const championAlias = member?.championAlias ?? "";

  // Hook toujours appelé, jamais conditionnel
  const chromaColor = useChromaColor({
    championId,
    skinId,
    chromaId,
    championAlias,
    locked: false,
  });

  // --- Portrait type loading screen ---
  // DDragon : /cdn/img/champion/loading/Ahri_0.jpg
  let portraitUrl = "";
  if (championId && skinId && championAlias) {
    const skinIndex = skinId - championId * 1000;
    portraitUrl = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championAlias}_${skinIndex}.jpg`;
  }

  const displayedSkin = portraitUrl || fallbackSkin;

  return (
    <div className="room-member-card">
      <div
        className="room-member-skin"
        style={
          chromaColor ? { boxShadow: `0 0 30px ${chromaColor}` } : undefined
        }
      >
        <img
          src={displayedSkin}
          alt={isOccupied ? member!.name : "Empty slot"}
          className="room-member-skin-img"
        />
      </div>

      {/* Pseudo seulement si la carte est occupée */}
      {isOccupied && <div className="room-member-name">{member!.name}</div>}
    </div>
  );
}
