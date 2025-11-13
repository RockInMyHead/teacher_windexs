/**
 * Test setup and utilities
 */

import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Add jest-dom matchers to vitest
expect.extend(matchers);

// Mock fetch for API tests
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn().mockImplementation((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn().mockImplementation((id) => clearTimeout(id));

// Mock Web Speech API
Object.defineProperty(window, 'SpeechRecognition', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: vi.fn(),
  writable: true,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Setup test environment
beforeEach(() => {
  // Reset all mocks
  vi.clearAllMocks();

  // Reset localStorage/sessionStorage mocks
  localStorageMock.getItem.mockReturnValue(null);
  localStorageMock.setItem.mockImplementation(() => {});
  localStorageMock.removeItem.mockImplementation(() => {});
  localStorageMock.clear.mockImplementation(() => {});

  sessionStorageMock.getItem.mockReturnValue(null);
  sessionStorageMock.setItem.mockImplementation(() => {});
  sessionStorageMock.removeItem.mockImplementation(() => {});
  sessionStorageMock.clear.mockImplementation(() => {});

  // Reset fetch mock
  (global.fetch as any).mockReset();
});

export default {};

