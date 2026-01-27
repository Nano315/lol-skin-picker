// src/app/InvitationHandler.tsx
import { useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { InvitationModal } from "@/components/social/InvitationModal";
import { useInvitationQueue } from "@/features/hooks/useInvitationQueue";
import { roomsClient } from "@/features/roomsClient";
import { useSummonerName } from "@/features/hooks/useSummonerName";
import { useConnection } from "@/features/hooks/useConnection";
import { useToast } from "@/features/hooks/useToast";

/**
 * Global handler for room invitations.
 * Displays the InvitationModal when invitations are received.
 */
export function InvitationHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { status } = useConnection();
  const summonerName = useSummonerName(status);
  const {
    currentInvitation,
    removeInvitation,
    timeRemaining,
  } = useInvitationQueue();

  const [isJoining, setIsJoining] = useState(false);

  const handleAccept = useCallback(async () => {
    if (!currentInvitation || !summonerName || isJoining) return;

    setIsJoining(true);

    try {
      // Leave current room if already in one
      if (roomsClient.isJoined()) {
        roomsClient.leaveRoom();
      }

      // Join the new room
      await roomsClient.joinRoom(currentInvitation.roomCode, summonerName);
      roomsClient.connect();

      // Remove from queue
      removeInvitation(currentInvitation.fromPuuid);

      // Navigate to rooms page if not already there
      if (location.pathname !== "/rooms") {
        navigate("/rooms");
      }

      showToast({
        type: "success",
        message: `Vous avez rejoint la room de ${currentInvitation.fromName}`,
        duration: 3000,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de rejoindre la room";
      showToast({
        type: "error",
        message: errorMessage,
        duration: 4000,
      });
      // Remove invitation even on error
      removeInvitation(currentInvitation.fromPuuid);
    } finally {
      setIsJoining(false);
    }
  }, [currentInvitation, summonerName, isJoining, removeInvitation, navigate, location.pathname, showToast]);

  const handleDismiss = useCallback(() => {
    if (currentInvitation) {
      removeInvitation(currentInvitation.fromPuuid);
    }
  }, [currentInvitation, removeInvitation]);

  // Don't show modal if no invitation or no summonerName
  if (!currentInvitation || !summonerName) {
    return null;
  }

  return (
    <InvitationModal
      invitation={currentInvitation}
      onAccept={handleAccept}
      onDismiss={handleDismiss}
      timeRemaining={timeRemaining}
    />
  );
}
