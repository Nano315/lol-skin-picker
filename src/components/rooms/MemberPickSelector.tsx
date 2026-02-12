import type {
  RoomMember,
  SkinLineSynergy,
  ColorSynergy,
} from "@/features/roomsClient";
import styles from "./MemberPickSelector.module.css";

interface MemberPickSelectorProps {
  members: RoomMember[];
  synergy: SkinLineSynergy | ColorSynergy;
  synergyType: "skinLine" | "color";
  picks: Map<string, { skinId: number; chromaId: number }>;
}

export function MemberPickSelector({
  members,
  synergy,
  synergyType,
  picks,
}: MemberPickSelectorProps) {
  const participants = members.filter((m) => synergy.members.includes(m.id));
  const nonParticipants = members.filter(
    (m) => !synergy.members.includes(m.id),
  );

  return (
    <div className={styles.editor}>
      {participants.map((member) => {
        const currentPick = picks.get(member.id);
        const skinIndex = member.skinId - member.championId * 1000;
        const portraitUrl =
          member.championAlias && member.skinId
            ? `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${member.championAlias}_${skinIndex}.jpg`
            : "";

        return (
          <div key={member.id} className={styles.row}>
            <div className={styles.memberInfo}>
              {portraitUrl && (
                <img
                  src={portraitUrl}
                  alt=""
                  className={styles.portrait}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <span className={styles.memberName}>{member.name}</span>
            </div>
            <div className={styles.pickInfo}>
              <span className={styles.pickLabel}>
                Skin {currentPick?.skinId ?? member.skinId}
              </span>
              {synergyType === "skinLine" && (
                <span className={styles.chromaNote}>base skin</span>
              )}
            </div>
          </div>
        );
      })}

      {nonParticipants.length > 0 && (
        <div className={styles.nonParticipants}>
          <span className={styles.nonLabel}>Not matching:</span>
          {nonParticipants.map((m) => (
            <span key={m.id} className={styles.nonName}>
              {m.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
