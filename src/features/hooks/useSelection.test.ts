import { renderHook, act, waitFor } from '@testing-library/react';
import { useSelection } from './useSelection';
import { api } from '../api';
import { vi } from 'vitest';
import type { Selection } from '../types';

// Mock the api module
vi.mock('../api', () => ({
  api: {
    getSelection: vi.fn(),
    onSelection: vi.fn(),
  },
}));

const mockInitialSelection: Selection = {
  championId: 1,
  championAlias: 'Annie',
  skinId: 1001,
  chromaId: 0,
  locked: false,
};

describe('useSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and set the initial selection on mount', async () => {
    vi.mocked(api.getSelection).mockResolvedValue(mockInitialSelection);
    vi.mocked(api.onSelection).mockReturnValue(() => {});

    const { result } = renderHook(() => useSelection());

    await waitFor(() => {
        expect(result.current[0]).toEqual(mockInitialSelection);
    });
    
    expect(api.getSelection).toHaveBeenCalledTimes(1);
  });

  it('should update the selection when the api broadcasts a change (IPC sync)', async () => {
    let onSelectionCallback: (newSelection: Selection) => void = () => {};
    vi.mocked(api.getSelection).mockResolvedValue(mockInitialSelection);
    vi.mocked(api.onSelection).mockImplementation((callback) => {
        onSelectionCallback = callback;
        return () => {};
    });

    const { result } = renderHook(() => useSelection());

    // Wait for initial state to be set
    await waitFor(() => {
        expect(result.current[0].skinId).toBe(1001);
    });

    const updatedSelection: Selection = { ...mockInitialSelection, skinId: 1002 };
    act(() => {
        onSelectionCallback(updatedSelection);
    });

    expect(result.current[0]).toEqual(updatedSelection);
  });

  it('should call the cleanup function on unmount', () => {
    const cleanupFn = vi.fn();
    vi.mocked(api.getSelection).mockResolvedValue(mockInitialSelection);
    vi.mocked(api.onSelection).mockReturnValue(cleanupFn);

    const { unmount } = renderHook(() => useSelection());

    unmount();

    expect(cleanupFn).toHaveBeenCalledTimes(1);
  });

  // The second element of the tuple is the raw `setSelection` from `useState`
  // so we can test it directly.
  it('should update state when setSelection is called', async () => {
    vi.mocked(api.getSelection).mockResolvedValue(mockInitialSelection);
    vi.mocked(api.onSelection).mockReturnValue(() => {});

    const { result } = renderHook(() => useSelection());

    // Wait for the initial effect to complete and set the state
    await waitFor(() => {
        expect(result.current[0].skinId).toBe(mockInitialSelection.skinId);
    });

    const manualSelection: Selection = { ...mockInitialSelection, skinId: 9999 };
    act(() => {
      result.current[1](manualSelection);
    });

    expect(result.current[0]).toEqual(manualSelection);
  });
});
