// src/components/social/OnlineFriendsList.tsx
import type { OnlineFriend } from "@/features/types";
import { FriendCard } from "./FriendCard";
import { GlassCard } from "@/components/ui";
import { UserRound, UsersRound, Loader2 } from "lucide-react";

interface OnlineFriendsListProps {
  friends: OnlineFriend[];
  /** Current room code — enables direct invites when set. */
  currentRoomCode?: string;
  /** Names (summonerName) of members already in the current room. Used to
   *  disable the invite action and show "In room" on matching friend cards. */
  roomMemberNames?: string[];
  /** If provided, each FriendCard can trigger an auto-create-and-invite flow
   *  when there is no current room yet. */
  ensureRoom?: () => Promise<string | null>;
  /** Whether the LCU client is connected (Story 4.9) */
  isLcuConnected?: boolean;
}

export function OnlineFriendsList({
  friends,
  currentRoomCode,
  roomMemberNames,
  ensureRoom,
  isLcuConnected = true,
}: OnlineFriendsListProps) {
  const membersSet = new Set(roomMemberNames ?? []);

  // Show waiting message when LCU is not connected (Story 4.9 AC5)
  const renderContent = () => {
    if (!isLcuConnected) {
      return (
        <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-8 text-center">
          <Loader2
            className="h-5 w-5 animate-spin text-muted"
            aria-hidden
          />
          <p className="m-0 text-sm font-medium text-white/70">
            Waiting for League of Legends...
          </p>
          <p className="m-0 text-xs text-white/40">
            Launch the LoL client to see your online friends and send
            invitations.
          </p>
        </div>
      );
    }

    if (friends.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-8 text-center">
          <UserRound className="h-5 w-5 text-muted" aria-hidden />
          <p className="m-0 text-sm font-medium text-white/70">
            No friends online
          </p>
          <p className="m-0 text-xs text-white/40">
            Friends using Skin Picker will appear here
          </p>
        </div>
      );
    }

    return (
      <ul
        className="m-0 flex max-h-80 list-none flex-col gap-2.5 overflow-y-auto p-0 [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:rounded-[3px] [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar]:w-1.5"
      >
        {friends.map((friend) => (
          <li key={friend.puuid}>
            <FriendCard
              friend={friend}
              roomCode={currentRoomCode}
              ensureRoom={ensureRoom}
              isAlreadyInRoom={membersSet.has(friend.summonerName)}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            Social
          </p>
          <h3 className="m-0 mt-1 flex items-center gap-2 text-xl font-bold text-white">
            <UsersRound className="h-5 w-5 text-white/70" aria-hidden />
            Online Friends
            <span className="text-base font-normal text-white/50">
              ({isLcuConnected ? friends.length : "—"})
            </span>
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-2">{renderContent()}</div>
    </GlassCard>
  );
}
