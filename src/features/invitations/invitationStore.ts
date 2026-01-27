// src/features/invitations/invitationStore.ts
/**
 * Global store for managing invitation state across components.
 * Uses a pub/sub pattern to notify subscribers of changes.
 * Extended in Story 4.10 to handle sent/failed events.
 */

import type { InviteFailureReason } from "../types";

export interface Invitation {
  fromPuuid: string;
  fromName: string;
  roomCode: string;
  receivedAt: number;
}

export interface SentInviteResult {
  targetPuuid: string;
  success: boolean;
  error?: InviteFailureReason;
  timestamp: number;
}

type Listener = () => void;

const RATE_LIMIT_MS = 30000; // 30 seconds

class InvitationStore {
  private invitations: Invitation[] = [];
  private listeners = new Set<Listener>();
  // Track sent invites: puuid -> timestamp (Story 4.10)
  private sentInvites = new Map<string, number>();
  // Track last result for UI feedback (Story 4.10)
  private _lastResult: SentInviteResult | null = null;
  // Track pending invite target
  private _pendingTarget: string | null = null;

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  // --- Received Invitations Queue ---

  getInvitations(): Invitation[] {
    return this.invitations;
  }

  getCurrentInvitation(): Invitation | null {
    return this.invitations[0] ?? null;
  }

  getQueueLength(): number {
    return this.invitations.length;
  }

  addInvitation(invitation: Invitation): void {
    // Don't add duplicate from same sender
    if (this.invitations.some((i) => i.fromPuuid === invitation.fromPuuid)) {
      return;
    }
    this.invitations = [...this.invitations, invitation];
    this.notify();
  }

  removeInvitation(fromPuuid: string): void {
    this.invitations = this.invitations.filter((i) => i.fromPuuid !== fromPuuid);
    this.notify();
  }

  clearAll(): void {
    this.invitations = [];
    this.notify();
  }

  // --- Sent Invitations Tracking (Story 4.10) ---

  getPendingTarget(): string | null {
    return this._pendingTarget;
  }

  setPendingTarget(targetPuuid: string | null): void {
    this._pendingTarget = targetPuuid;
    this.notify();
  }

  getLastResult(): SentInviteResult | null {
    return this._lastResult;
  }

  /**
   * Record a successfully sent invite
   */
  recordSentInvite(targetPuuid: string): void {
    this.sentInvites.set(targetPuuid, Date.now());
    this._pendingTarget = null;
    this._lastResult = {
      targetPuuid,
      success: true,
      timestamp: Date.now(),
    };
    this.notify();

    // Auto-clear result after 3 seconds
    setTimeout(() => {
      if (this._lastResult?.targetPuuid === targetPuuid && this._lastResult?.success) {
        this._lastResult = null;
        this.notify();
      }
    }, 3000);
  }

  /**
   * Record a failed invite attempt
   */
  recordFailedInvite(targetPuuid: string | null, reason: InviteFailureReason): void {
    const target = targetPuuid || this._pendingTarget;
    this._pendingTarget = null;

    if (target) {
      this._lastResult = {
        targetPuuid: target,
        success: false,
        error: reason,
        timestamp: Date.now(),
      };
      this.notify();

      // Auto-clear result after 3 seconds
      setTimeout(() => {
        if (this._lastResult?.targetPuuid === target && !this._lastResult?.success) {
          this._lastResult = null;
          this.notify();
        }
      }, 3000);
    }
  }

  /**
   * Check if we can invite a specific friend (not rate limited)
   */
  canInvite(targetPuuid: string): boolean {
    const lastSent = this.sentInvites.get(targetPuuid);
    if (!lastSent) return true;
    return Date.now() - lastSent >= RATE_LIMIT_MS;
  }

  /**
   * Get seconds remaining until we can invite again
   */
  getTimeUntilCanInvite(targetPuuid: string): number {
    const lastSent = this.sentInvites.get(targetPuuid);
    if (!lastSent) return 0;
    const remaining = RATE_LIMIT_MS - (Date.now() - lastSent);
    return Math.max(0, Math.ceil(remaining / 1000));
  }

  /**
   * Check if an invite is currently pending for a target
   */
  isPending(targetPuuid: string): boolean {
    return this._pendingTarget === targetPuuid;
  }
}

// Singleton instance
export const invitationStore = new InvitationStore();
