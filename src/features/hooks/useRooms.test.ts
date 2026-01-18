import { renderHook, act } from '@testing-library/react';
import { useRooms } from './useRooms';
import { roomsClient, type RoomState } from '../roomsClient';
import { vi } from 'vitest';

// Mock the roomsClient module
vi.mock('../roomsClient', () => ({
  roomsClient: {
    subscribe: vi.fn(),
    onError: vi.fn(),
    onGroupCombo: vi.fn(),
    onColorSuggestionReceived: vi.fn(),
    isJoined: vi.fn(),
    connect: vi.fn(),
    createRoom: vi.fn(),
    joinRoom: vi.fn(),
    leaveRoom: vi.fn(),
    sendSelection: vi.fn(),
    suggestColor: vi.fn(),
    getMemberId: vi.fn(),
  },
  // We need to export the type for casting
  RoomState: vi.fn(),
}));

const mockSelection = { championId: 1, skinId: 1001, chromaId: 0, championAlias: 'MockChampion', locked: false };
const newRoomState: RoomState = { id: 'room-123', code: 'ABCDEF', members: [], ownerId: 'owner-1' };

describe('useRooms', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Default mock implementations
    vi.mocked(roomsClient.subscribe).mockReturnValue(() => {});
    vi.mocked(roomsClient.onError).mockReturnValue(() => {});
    vi.mocked(roomsClient.onGroupCombo).mockReturnValue(() => {});
    vi.mocked(roomsClient.onColorSuggestionReceived).mockReturnValue(() => {});
  });

  it('should have a null room, no error, and not be loading initially', () => {
    const { result } = renderHook(() => useRooms(mockSelection));
    
    expect(result.current.room).toBeNull();
    expect(result.current.joined).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should call roomsClient.createRoom and update loading state', async () => {
    // We need to capture the callback passed to subscribe, so set up the mock before rendering
    let onRoomUpdate: (nextRoom: RoomState) => void = () => {}; // Initialize to avoid TS errors
    vi.mocked(roomsClient.subscribe).mockImplementation((callback) => {
        onRoomUpdate = callback;
        return () => {}; // Return an unsubscribe function
    });
    
    const { result } = renderHook(() => useRooms(mockSelection));

    // Mock the createRoom API call
    vi.mocked(roomsClient.createRoom).mockResolvedValue({ room: newRoomState });

    // Check initial state
    expect(result.current.isLoading).toBe(false);

    await act(async () => {
        await result.current.create('TestPlayer');
    });

    // Check final state and mock calls
    expect(roomsClient.createRoom).toHaveBeenCalledWith('TestPlayer');
    expect(result.current.isLoading).toBe(false);

    // Now, simulate the server sending a room update
    act(() => {
        onRoomUpdate(newRoomState);
    });

    expect(result.current.room).toEqual(newRoomState);
  });

  it('should call roomsClient.joinRoom and update loading state', async () => {
    let onRoomUpdate: (nextRoom: RoomState) => void = () => {};
    vi.mocked(roomsClient.subscribe).mockImplementation((callback) => {
        onRoomUpdate = callback;
        return () => {};
    });

    const { result } = renderHook(() => useRooms(mockSelection));
    vi.mocked(roomsClient.joinRoom).mockResolvedValue({ room: newRoomState });

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
        await result.current.join('CODE12', 'TestPlayer');
    });

    expect(roomsClient.joinRoom).toHaveBeenCalledWith('CODE12', 'TestPlayer');
    expect(result.current.isLoading).toBe(false);

    const updatedRoomState = { id: 'room-456', code: 'CODE12', members: [], ownerId: 'owner-2' };
    act(() => {
        onRoomUpdate(updatedRoomState);
    });

    expect(result.current.room).toEqual(updatedRoomState);
  });

  it('should cleanup subscriptions on unmount', () => {
    const unsubscribeRoom = vi.fn();
    const unsubscribeError = vi.fn();
    vi.mocked(roomsClient.subscribe).mockReturnValue(unsubscribeRoom);
    vi.mocked(roomsClient.onError).mockReturnValue(unsubscribeError);

    const { unmount } = renderHook(() => useRooms(mockSelection));

    // Unmount the hook
    unmount();

    expect(unsubscribeRoom).toHaveBeenCalledTimes(1);
    expect(unsubscribeError).toHaveBeenCalledTimes(1);
  });
});
