// src/features/presence/presenceStore.ts
/**
 * Global store for managing online friends presence state.
 * Uses a pub/sub pattern to notify React components of changes.
 * Follows the same pattern as invitationStore.ts (Story 4.5).
 */

import type { OnlineFriend } from "../types";

export type SocketConnectionStatus = "connected" | "connecting" | "disconnected";

type Listener = () => void;

class PresenceStore {
  private onlineFriends = new Map<string, OnlineFriend>();
  private listeners = new Set<Listener>();
  private _isIdentified = false;
  private _connectionStatus: SocketConnectionStatus = "disconnected";

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  getOnlineFriends(): OnlineFriend[] {
    return Array.from(this.onlineFriends.values());
  }

  getOnlineFriendCount(): number {
    return this.onlineFriends.size;
  }

  isIdentified(): boolean {
    return this._isIdentified;
  }

  setIdentified(value: boolean): void {
    this._isIdentified = value;
    this.notify();
  }

  getConnectionStatus(): SocketConnectionStatus {
    return this._connectionStatus;
  }

  setConnectionStatus(status: SocketConnectionStatus): void {
    if (this._connectionStatus !== status) {
      this._connectionStatus = status;
      this.notify();
    }
  }

  setOnlineFriends(friends: OnlineFriend[]): void {
    this.onlineFriends.clear();
    for (const friend of friends) {
      this.onlineFriends.set(friend.puuid, friend);
    }
    this.notify();
  }

  addFriend(friend: OnlineFriend): void {
    // Avoid duplicates
    if (this.onlineFriends.has(friend.puuid)) {
      return;
    }
    this.onlineFriends.set(friend.puuid, friend);
    this.notify();
  }

  removeFriend(puuid: string): void {
    if (this.onlineFriends.delete(puuid)) {
      this.notify();
    }
  }

  clear(): void {
    this.onlineFriends.clear();
    this._isIdentified = false;
    this._connectionStatus = "disconnected";
    this.notify();
  }
}

// Singleton instance
export const presenceStore = new PresenceStore();
