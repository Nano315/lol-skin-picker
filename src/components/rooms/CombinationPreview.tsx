import type { RoomMember } from "@/features/roomsClient";
import styles from "./CombinationPreview.module.css";

interface CombinationPreviewProps {
  members: RoomMember[];
  picks: Map<string, { skinId: number; chromaId: number }>;
}

export function CombinationPreview({
  members,
  picks,
}: CombinationPreviewProps) {
  const count = members.length;
  const gridClass = `${styles.grid} ${styles[`grid${Math.min(count, 5)}`] ?? ""}`;

  return (
    <div className={gridClass}>
      {members.map((member) => {
        const pick = picks.get(member.id);
        const hasPick = !!pick;

        const skinIndex = pick
          ? pick.skinId - member.championId * 1000
          : member.skinId - member.championId * 1000;

        const splashUrl =
          member.championAlias && (pick?.skinId || member.skinId)
            ? `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${member.championAlias}_${skinIndex}.jpg`
            : "";

        return (
          <div
            key={member.id}
            className={`${styles.card} ${!hasPick ? styles.warning : ""}`}
          >
            {splashUrl ? (
              <img
                src={splashUrl}
                alt={member.name}
                className={styles.splash}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className={styles.placeholder}>
                <span>No preview</span>
              </div>
            )}
            <span className={styles.name}>{member.name}</span>
          </div>
        );
      })}
    </div>
  );
}
