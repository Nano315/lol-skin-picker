// src/components/RoomMemberCard.tsx
import { useChromaColor } from "@/features/hooks/useChromaColor";
import type { RoomMember } from "@/features/roomsClient";

type Props = {
  member: RoomMember;
};

export function RoomMemberCard({ member }: Props) {
  const auraColor = useChromaColor({
    championId: member.championId,
    skinId: member.skinId,
    chromaId: member.chromaId,
    championAlias: "",
    locked: false,
  });

  return (
    <div className="room-member-card">
      <div
        className="room-member-skin"
        style={{
          boxShadow: `0 0 30px ${auraColor}`,
        }}
      >
        {/* TODO plus tard : afficher vraiment le splash/champion */}
        <span>{member.championId ? `#${member.championId}` : "No champ"}</span>
      </div>
      <div className="room-member-name">{member.name}</div>
    </div>
  );
}
