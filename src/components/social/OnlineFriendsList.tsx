// src/components/social/OnlineFriendsList.tsx
import type { OnlineFriend } from "@/features/types";
import { FriendCard } from "./FriendCard";
import styles from "./OnlineFriendsList.module.css";

interface OnlineFriendsListProps {
  friends: OnlineFriend[];
  currentRoomCode?: string;
}

export function OnlineFriendsList({
  friends,
  currentRoomCode,
}: OnlineFriendsListProps) {
  const showInviteButton = !!currentRoomCode;

  return (
    <section className={`card ${styles.container}`}>
      <div className={`card-header ${styles.header}`}>
        <div>
          <p className="eyebrow">SOCIAL</p>
          <h2 className="card-title">
            Online Friends{" "}
            <span className={styles.count}>({friends.length})</span>
          </h2>
        </div>
      </div>

      <div className={styles.content}>
        {friends.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>No friends online</p>
            <p className={styles.emptySubtext}>
              Friends using Skin Picker will appear here
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
}
