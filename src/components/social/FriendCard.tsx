// src/components/social/FriendCard.tsx
import type { OnlineFriend } from "@/features/types";
import { useInvitations } from "@/features/hooks/useInvitations";
import styles from "./FriendCard.module.css";

interface FriendCardProps {
  friend: OnlineFriend;
  showInvite: boolean;
  roomCode?: string;
}

export function FriendCard({ friend, showInvite, roomCode }: FriendCardProps) {
  const { sendInvite, canInvite, getTimeUntilCanInvite, getInviteState } =
    useInvitations();

  const inviteState = getInviteState(friend.puuid);
  const canSend = canInvite(friend.puuid);
  const timeRemaining = getTimeUntilCanInvite(friend.puuid);

  const handleInvite = () => {
    if (roomCode && canSend && inviteState.status !== "pending") {
      sendInvite(friend.puuid, roomCode);
    }
  };

  const getButtonText = () => {
    if (inviteState.status === "pending") return "...";
    if (inviteState.status === "sent") return "\u2713"; // checkmark
    if (!canSend && timeRemaining > 0) return `${timeRemaining}s`;
    return "Invite";
  };

  const isDisabled =
    !canSend || inviteState.status === "pending" || inviteState.status === "sent";

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <span className={styles.onlineIndicator} aria-label="Online" />
        <span className={styles.name}>{friend.summonerName}</span>
      </div>

      {showInvite && roomCode && (
        <button
          className={`${styles.inviteButton} ${inviteState.status === "sent" ? styles.inviteButtonSent : ""} ${inviteState.status === "failed" ? styles.inviteButtonFailed : ""}`}
          onClick={handleInvite}
          disabled={isDisabled}
          title={
            inviteState.status === "sent"
              ? "Invitation sent!"
              : inviteState.status === "failed"
                ? `Failed: ${inviteState.error}`
                : `Invite ${friend.summonerName} to your room`
          }
        >
          {getButtonText()}
        </button>
      )}
    </div>
  );
}
