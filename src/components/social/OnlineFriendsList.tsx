// src/components/social/OnlineFriendsList.tsx
import type { OnlineFriend } from "@/features/types";
import { FriendCard } from "./FriendCard";
import styles from "./OnlineFriendsList.module.css";

interface OnlineFriendsListProps {
  friends: OnlineFriend[];
  currentRoomCode?: string;
  /** Whether the LCU client is connected (Story 4.9) */
  isLcuConnected?: boolean;
}

export function OnlineFriendsList({
  friends,
  currentRoomCode,
  isLcuConnected = true,
}: OnlineFriendsListProps) {
  const showInviteButton = !!currentRoomCode;

  // Show waiting message when LCU is not connected (Story 4.9 AC5)
  const renderContent = () => {
    if (!isLcuConnected) {
      return (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Waiting for League of Legends...</p>
          <p className={styles.emptySubtext}>
            Launch the LoL client to see your online friends and send
            invitations.
          </p>
        </div>
      );
    }

    if (friends.length === 0) {
      return (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No friends online</p>
          <p className={styles.emptySubtext}>
            Friends using Skin Picker will appear here
          </p>
        </div>
      );
    }

    return (
      <ul className={styles.list}>
        {friends.map((friend) => (
          <li key={friend.puuid}>
            <FriendCard
              friend={friend}
              showInvite={showInviteButton}
              roomCode={currentRoomCode}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className={`card ${styles.container}`}>
      <div className={`card-header ${styles.header}`}>
        <div>
          <p className="eyebrow">SOCIAL</p>
          <h2 className="card-title">
            Online Friends{" "}
            <span className={styles.count}>
              ({isLcuConnected ? friends.length : "-"})
            </span>
          </h2>
        </div>
      </div>

      <div className={styles.content}>{renderContent()}</div>
    </section>
  );
}
