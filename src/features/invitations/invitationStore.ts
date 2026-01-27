// src/features/invitations/invitationStore.ts
/**
 * Simple store for managing invitation state across components.
 * Uses a pub/sub pattern to notify subscribers of changes.
 */

export interface Invitation {
  fromPuuid: string;
  fromName: string;
  roomCode: string;
  receivedAt: number;
}

type Listener = () => void;

class InvitationStore {
  private invitations: Invitation[] = [];
  private listeners = new Set<Listener>();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

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
}

// Singleton instance
export const invitationStore = new InvitationStore();
