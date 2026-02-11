// src/__tests__/invitation-components.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { InvitationModal } from "../components/social/InvitationModal";
import { invitationStore, type Invitation } from "../features/invitations/invitationStore";

// Mock invitation data
const mockInvitation: Invitation = {
  fromPuuid: "puuid-123",
  fromName: "TestPlayer",
  roomCode: "ABC123",
  receivedAt: Date.now(),
};

describe("InvitationModal", () => {
  it("renders invitation with player name", () => {
    const onAccept = vi.fn();
    const onDismiss = vi.fn();

    render(
      <InvitationModal
        invitation={mockInvitation}
        onAccept={onAccept}
        onDismiss={onDismiss}
      />
    );

    expect(screen.getByText("TestPlayer")).toBeInTheDocument();
    expect(screen.getByText(/invites you to join/)).toBeInTheDocument();
    expect(screen.getByText("Invitation")).toBeInTheDocument();
  });

  it("calls onAccept when Join button is clicked", () => {
    const onAccept = vi.fn();
    const onDismiss = vi.fn();

    render(
      <InvitationModal
        invitation={mockInvitation}
        onAccept={onAccept}
        onDismiss={onDismiss}
      />
    );

    fireEvent.click(screen.getByText("Join"));
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it("calls onDismiss when Dismiss button is clicked", async () => {
    const onAccept = vi.fn();
    const onDismiss = vi.fn();

    render(
      <InvitationModal
        invitation={mockInvitation}
        onAccept={onAccept}
        onDismiss={onDismiss}
      />
    );

    fireEvent.click(screen.getByText("Dismiss"));

    // Wait for exit animation (200ms)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("calls onDismiss when backdrop is clicked", async () => {
    const onAccept = vi.fn();
    const onDismiss = vi.fn();

    const { container } = render(
      <InvitationModal
        invitation={mockInvitation}
        onAccept={onAccept}
        onDismiss={onDismiss}
      />
    );

    // Find backdrop element (first div with backdrop class)
    const backdrop = container.querySelector('[class*="backdrop"]');
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop!);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("calls onDismiss when Escape key is pressed", async () => {
    const onAccept = vi.fn();
    const onDismiss = vi.fn();

    render(
      <InvitationModal
        invitation={mockInvitation}
        onAccept={onAccept}
        onDismiss={onDismiss}
      />
    );

    fireEvent.keyDown(window, { key: "Escape" });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("shows timer bar when timeRemaining is provided", () => {
    const onAccept = vi.fn();
    const onDismiss = vi.fn();

    const { container } = render(
      <InvitationModal
        invitation={mockInvitation}
        onAccept={onAccept}
        onDismiss={onDismiss}
        timeRemaining={15}
      />
    );

    const timerBar = container.querySelector('[class*="timerBar"]');
    expect(timerBar).toBeInTheDocument();
    expect(timerBar).toHaveStyle({ width: "50%" }); // 15/30 * 100 = 50%
  });
});

describe("invitationStore", () => {
  beforeEach(() => {
    invitationStore.clearAll();
  });

  it("adds invitation to queue", () => {
    expect(invitationStore.getQueueLength()).toBe(0);

    invitationStore.addInvitation(mockInvitation);

    expect(invitationStore.getQueueLength()).toBe(1);
    expect(invitationStore.getCurrentInvitation()).toEqual(mockInvitation);
  });

  it("removes invitation from queue", () => {
    invitationStore.addInvitation(mockInvitation);
    expect(invitationStore.getQueueLength()).toBe(1);

    invitationStore.removeInvitation(mockInvitation.fromPuuid);

    expect(invitationStore.getQueueLength()).toBe(0);
    expect(invitationStore.getCurrentInvitation()).toBeNull();
  });

  it("does not add duplicate invitations from same sender", () => {
    invitationStore.addInvitation(mockInvitation);
    invitationStore.addInvitation({ ...mockInvitation, roomCode: "XYZ789" });

    expect(invitationStore.getQueueLength()).toBe(1);
  });

  it("queues multiple invitations from different senders", () => {
    const invitation1 = { ...mockInvitation, fromPuuid: "puuid-1" };
    const invitation2 = { ...mockInvitation, fromPuuid: "puuid-2" };
    const invitation3 = { ...mockInvitation, fromPuuid: "puuid-3" };

    invitationStore.addInvitation(invitation1);
    invitationStore.addInvitation(invitation2);
    invitationStore.addInvitation(invitation3);

    expect(invitationStore.getQueueLength()).toBe(3);
    expect(invitationStore.getCurrentInvitation()).toEqual(invitation1);

    // Remove first, second should become current
    invitationStore.removeInvitation("puuid-1");
    expect(invitationStore.getCurrentInvitation()).toEqual(invitation2);
    expect(invitationStore.getQueueLength()).toBe(2);

    // Remove second, third should become current
    invitationStore.removeInvitation("puuid-2");
    expect(invitationStore.getCurrentInvitation()).toEqual(invitation3);
    expect(invitationStore.getQueueLength()).toBe(1);
  });

  it("notifies subscribers on changes", () => {
    const listener = vi.fn();
    const unsubscribe = invitationStore.subscribe(listener);

    invitationStore.addInvitation(mockInvitation);
    expect(listener).toHaveBeenCalledTimes(1);

    invitationStore.removeInvitation(mockInvitation.fromPuuid);
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    invitationStore.addInvitation(mockInvitation);
    expect(listener).toHaveBeenCalledTimes(2); // No more calls after unsubscribe
  });

  it("clears all invitations", () => {
    invitationStore.addInvitation({ ...mockInvitation, fromPuuid: "1" });
    invitationStore.addInvitation({ ...mockInvitation, fromPuuid: "2" });
    invitationStore.addInvitation({ ...mockInvitation, fromPuuid: "3" });

    expect(invitationStore.getQueueLength()).toBe(3);

    invitationStore.clearAll();

    expect(invitationStore.getQueueLength()).toBe(0);
  });
});
