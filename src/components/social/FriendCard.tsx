// src/components/social/FriendCard.tsx
import type { OnlineFriend } from "@/features/types";
import styles from "./FriendCard.module.css";

interface FriendCardProps {
  friend: OnlineFriend;
  showInvite: boolean;
  onInvite?: () => void;
}

export function FriendCard({ friend, showInvite, onInvite }: FriendCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <span className={styles.onlineIndicator} aria-label="Online" />
        <span className={styles.name}>{friend.summonerName}</span>
      </div>

      {showInvite && onInvite && (
        <button
          className={styles.inviteButton}
          onClick={onInvite}
          title={`Invite ${friend.summonerName} to your room`}
        >
          Invite
        </button>
      )}
    </div>
  );
}
