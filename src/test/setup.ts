import { vi } from 'vitest';
import { mockLcu } from './mocks/lcu';

// Mock LCU API for Electron context
// @ts-expect-error: Mocking global LCU object for tests
window.lcu = mockLcu;

// Mock fetch for Community Dragon
vi.spyOn(window, 'fetch');
