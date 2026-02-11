// src/components/social/InvitationModal.tsx
import { useState, useEffect, useCallback } from "react";
import styles from "./InvitationModal.module.css";

export interface Invitation {
  fromPuuid: string;
  fromName: string;
  roomCode: string;
  receivedAt: number;
}

interface InvitationModalProps {
  invitation: Invitation;
  onAccept: () => void;
  onDismiss: () => void;
  timeRemaining?: number; // seconds remaining before auto-dismiss
}

export function InvitationModal({
  invitation,
  onAccept,
  onDismiss,
  timeRemaining,
}: InvitationModalProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    // Wait for exit animation before calling onDismiss
    setTimeout(onDismiss, 200);
  }, [onDismiss]);

  const handleAccept = useCallback(() => {
    setIsAccepting(true);
    onAccept();
  }, [onAccept]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDismiss]);

  // Calculate timer bar width
  const timerWidth = timeRemaining !== undefined ? (timeRemaining / 30) * 100 : 100;

  return (
    <>
      <div className={styles.backdrop} onClick={handleDismiss} />
      <div className={`${styles.modal} ${isExiting ? styles.modalExiting : ""}`}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.icon} role="img" aria-label="Game invite">
              🎮
            </span>
            <h3 className={styles.title}>Invitation</h3>
          </div>
          <button
            className={styles.closeButton}
            onClick={handleDismiss}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.message}>
            <span className={styles.playerName}>{invitation.fromName}</span> invites
            you to join their room!
          </p>
        </div>

        <div className={styles.footer}>
          <button
            className={`${styles.button} ${styles.dismissButton}`}
            onClick={handleDismiss}
          >
            Dismiss
          </button>
          <button
            className={`${styles.button} ${styles.acceptButton}`}
            onClick={handleAccept}
            disabled={isAccepting}
          >
            {isAccepting ? "..." : "Join"}
          </button>
        </div>

        {/* Timer indicator bar */}
        {timeRemaining !== undefined && (
          <div className={styles.timerBar} style={{ width: `${timerWidth}%` }} />
        )}
      </div>
    </>
  );
}
