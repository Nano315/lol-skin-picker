export const errorMessages: Record<string, string> = {
  ROOM_NOT_FOUND: "This room no longer exists. It may have been closed.",
  MEMBER_NOT_FOUND: "You are no longer a member of this room.",
  INVALID_PAYLOAD: "An error occurred. Please try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  INTERNAL_ERROR: "An unexpected error occurred.",
  NETWORK_ERROR: "Connection issue. Please check your network.",
};

export const inviteErrorMessages: Record<string, string> = {
  not_identified: "You are not identified",
  not_friend: "This player is not in your friend list",
  rate_limited: "Please wait before sending another invite",
  friend_offline: "This player is offline",
  already_in_room: "This player is already in the room",
};
