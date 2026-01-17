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

describe('suggestColor', () => {
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

  describe('precondition validation', () => {
    it('should return error when socket is not connected', async () => {
      const result = await roomsClient.suggestColor(1001, 101);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Socket not connected');
    });

    it('should return error when not in a room', async () => {
      const mockSocket = { connected: true, emit: vi.fn() };
      (roomsClient as unknown as { socket: typeof mockSocket }).socket = mockSocket;

      const result = await roomsClient.suggestColor(1001, 101);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not in a room');
    });

    it('should return error when no member ID', async () => {
      const mockSocket = { connected: true, emit: vi.fn() };
      (roomsClient as unknown as { socket: typeof mockSocket }).socket = mockSocket;
      (roomsClient as unknown as { roomId: string }).roomId = 'test-room';

      const result = await roomsClient.suggestColor(1001, 101);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No member ID');
    });

    it('should return error when socket is disconnected', async () => {
      const mockSocket = { connected: false, emit: vi.fn() };
      (roomsClient as unknown as { socket: typeof mockSocket }).socket = mockSocket;
      (roomsClient as unknown as { roomId: string }).roomId = 'test-room';
      (roomsClient as unknown as { memberId: string }).memberId = 'test-member';

      const result = await roomsClient.suggestColor(1001, 101);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Socket disconnected');
    });
  });

  describe('successful suggestion', () => {
    it('should emit suggest-color event with correct payload', async () => {
      const mockEmit = vi.fn((event, payload, callback) => {
        if (callback) callback({ success: true });
      });
      const mockSocket = { connected: true, emit: mockEmit };

      (roomsClient as unknown as { socket: typeof mockSocket }).socket = mockSocket;
      (roomsClient as unknown as { roomId: string }).roomId = 'test-room';
      (roomsClient as unknown as { memberId: string }).memberId = 'test-member';

      const result = await roomsClient.suggestColor(1001, 101);

      expect(mockEmit).toHaveBeenCalledWith(
        'suggest-color',
        {
          roomId: 'test-room',
          memberId: 'test-member',
          skinId: 1001,
          chromaId: 101,
        },
        expect.any(Function)
      );
      expect(result.success).toBe(true);
    });

    it('should handle server acknowledgment success', async () => {
      const mockEmit = vi.fn((event, payload, callback) => {
        if (callback) callback({ success: true });
      });
      const mockSocket = { connected: true, emit: mockEmit };

      (roomsClient as unknown as { socket: typeof mockSocket }).socket = mockSocket;
      (roomsClient as unknown as { roomId: string }).roomId = 'test-room';
      (roomsClient as unknown as { memberId: string }).memberId = 'test-member';

      const result = await roomsClient.suggestColor(1001, 101);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should handle server acknowledgment failure', async () => {
      const mockEmit = vi.fn((event, payload, callback) => {
        if (callback) callback({ success: false, error: 'Room not found' });
      });
      const mockSocket = { connected: true, emit: mockEmit };

      (roomsClient as unknown as { socket: typeof mockSocket }).socket = mockSocket;
      (roomsClient as unknown as { roomId: string }).roomId = 'test-room';
      (roomsClient as unknown as { memberId: string }).memberId = 'test-member';

      const result = await roomsClient.suggestColor(1001, 101);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Room not found');
    });

    it('should timeout after 5 seconds if no acknowledgment', async () => {
      vi.useFakeTimers();

      const mockEmit = vi.fn(() => {});
      const mockSocket = { connected: true, emit: mockEmit };

      (roomsClient as unknown as { socket: typeof mockSocket }).socket = mockSocket;
      (roomsClient as unknown as { roomId: string }).roomId = 'test-room';
      (roomsClient as unknown as { memberId: string }).memberId = 'test-member';

      const resultPromise = roomsClient.suggestColor(1001, 101);

      vi.advanceTimersByTime(5000);

      const result = await resultPromise;

      expect(result.success).toBe(false);
      expect(result.error).toBe('Request timed out');

      vi.useRealTimers();
    });
  });
});
