import { vi } from 'vitest';

export const mockSocket = {
  id: 'test-socket-id',
  on: vi.fn(),
  emit: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
};

const io = () => mockSocket;

export default io;
