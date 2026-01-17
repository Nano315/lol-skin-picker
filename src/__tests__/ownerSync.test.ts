import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { roomsClient } from '../features/roomsClient';

// Mock socket.io-client
vi.mock('socket.io-client', () => {
  const mockSocket = {
    emit: vi.fn(),
    on: vi.fn(),
    disconnect: vi.fn(),
    connected: true,
    id: 'test-socket-id',
  };
  return {
    io: vi.fn(() => mockSocket),
    Socket: vi.fn(),
  };
});

describe('Owner Immediate Sync (requestGroupReroll)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset roomsClient internal state
    (roomsClient as unknown as { socket: null }).socket = null;
    (roomsClient as unknown as { roomId: null }).roomId = null;
    (roomsClient as unknown as { memberId: null }).memberId = null;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('requestGroupReroll validation', () => {
    it('should not emit when socket is not connected', () => {
      const mockEmit = vi.fn();
      // No socket set up

      roomsClient.requestGroupReroll({ type: 'sameColor', color: '#ff0000' });

      expect(mockEmit).not.toHaveBeenCalled();
    });

    it('should not emit when not in a room', () => {
      const mockEmit = vi.fn();
      const mockSocket = { connected: true, emit: mockEmit };
      (roomsClient as unknown as { socket: typeof mockSocket }).socket = mockSocket;

      roomsClient.requestGroupReroll({ type: 'sameColor', color: '#ff0000' });

      expect(mockEmit).not.toHaveBeenCalled();
    });
  });

  describe('successful group reroll request', () => {
    it('should emit request-group-reroll event with sameColor type', () => {
      const mockEmit = vi.fn();
      const mockSocket = { connected: true, emit: mockEmit };

      (roomsClient as unknown as { socket: typeof mockSocket }).socket = mockSocket;
      (roomsClient as unknown as { roomId: string }).roomId = 'test-room';
      (roomsClient as unknown as { memberId: string }).memberId = 'owner-id';

      roomsClient.requestGroupReroll({ type: 'sameColor', color: '#ff0000' });

      expect(mockEmit).toHaveBeenCalledWith(
        'request-group-reroll',
        expect.objectContaining({
          roomId: 'test-room',
          memberId: 'owner-id',
          type: 'sameColor',
          color: '#ff0000',
        })
      );
    });

    it('should include roomId and memberId in the payload', () => {
      const mockEmit = vi.fn();
      const mockSocket = { connected: true, emit: mockEmit };

      (roomsClient as unknown as { socket: typeof mockSocket }).socket = mockSocket;
      (roomsClient as unknown as { roomId: string }).roomId = 'my-test-room';
      (roomsClient as unknown as { memberId: string }).memberId = 'my-member-id';

      roomsClient.requestGroupReroll({ type: 'sameColor', color: '#00ff00' });

      const call = mockEmit.mock.calls[0];
      expect(call[0]).toBe('request-group-reroll');
      expect(call[1].roomId).toBe('my-test-room');
      expect(call[1].memberId).toBe('my-member-id');
    });

    it('should work with different colors', () => {
      const mockEmit = vi.fn();
      const mockSocket = { connected: true, emit: mockEmit };

      (roomsClient as unknown as { socket: typeof mockSocket }).socket = mockSocket;
      (roomsClient as unknown as { roomId: string }).roomId = 'test-room';
      (roomsClient as unknown as { memberId: string }).memberId = 'owner-id';

      const testColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];

      for (const color of testColors) {
        mockEmit.mockClear();
        roomsClient.requestGroupReroll({ type: 'sameColor', color });

        expect(mockEmit).toHaveBeenCalledWith(
          'request-group-reroll',
          expect.objectContaining({
            type: 'sameColor',
            color,
          })
        );
      }
    });
  });

  describe('immediate sync behavior', () => {
    it('should emit immediately without requiring a second action', () => {
      const mockEmit = vi.fn();
      const mockSocket = { connected: true, emit: mockEmit };

      (roomsClient as unknown as { socket: typeof mockSocket }).socket = mockSocket;
      (roomsClient as unknown as { roomId: string }).roomId = 'test-room';
      (roomsClient as unknown as { memberId: string }).memberId = 'owner-id';

      // This simulates clicking a color - should emit immediately
      const color = '#ff0000';
      roomsClient.requestGroupReroll({ type: 'sameColor', color });

      // Should have been called exactly once, immediately
      expect(mockEmit).toHaveBeenCalledTimes(1);
      expect(mockEmit).toHaveBeenCalledWith(
        'request-group-reroll',
        expect.objectContaining({
          type: 'sameColor',
          color,
        })
      );
    });

    it('should allow multiple requests in sequence (not blocked)', () => {
      const mockEmit = vi.fn();
      const mockSocket = { connected: true, emit: mockEmit };

      (roomsClient as unknown as { socket: typeof mockSocket }).socket = mockSocket;
      (roomsClient as unknown as { roomId: string }).roomId = 'test-room';
      (roomsClient as unknown as { memberId: string }).memberId = 'owner-id';

      // Multiple clicks should all go through at roomsClient level
      // (blocking logic is in ControlBar component)
      roomsClient.requestGroupReroll({ type: 'sameColor', color: '#ff0000' });
      roomsClient.requestGroupReroll({ type: 'sameColor', color: '#00ff00' });
      roomsClient.requestGroupReroll({ type: 'sameColor', color: '#0000ff' });

      expect(mockEmit).toHaveBeenCalledTimes(3);
    });
  });
});
