export const errorMessages: Record<string, string> = {
  ROOM_NOT_FOUND: "Cette room n'existe plus. Elle a peut-être été fermée.",
  MEMBER_NOT_FOUND: "Vous n'êtes plus membre de cette room.",
  INVALID_PAYLOAD: "Une erreur s'est produite. Veuillez réessayer.",
  UNAUTHORIZED: "Vous n'êtes pas autorisé à effectuer cette action.",
  INTERNAL_ERROR: "Une erreur inattendue s'est produite.",
  NETWORK_ERROR: "Problème de connexion. Vérifiez votre réseau.",
};

export const inviteErrorMessages: Record<string, string> = {
  not_identified: "Vous n'êtes pas identifié",
  not_friend: "Ce joueur n'est pas dans votre liste d'amis",
  rate_limited: "Veuillez patienter avant de renvoyer une invitation",
  friend_offline: "Ce joueur est hors ligne",
  already_in_room: "Ce joueur est déjà dans la room",
};
