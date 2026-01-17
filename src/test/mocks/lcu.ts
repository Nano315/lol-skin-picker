import { vi } from 'vitest';

export const mockLcu = {
  getSummoner: vi.fn().mockResolvedValue({ displayName: 'TestPlayer' }),
  getOwnedSkins: vi.fn().mockResolvedValue([]),
  applySkinId: vi.fn().mockResolvedValue(true),
  getGameflowPhase: vi.fn().mockResolvedValue('None'),
};
