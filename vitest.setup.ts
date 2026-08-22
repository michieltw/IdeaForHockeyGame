import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

// Mock HTMLMediaElement play/pause
Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  configurable: true,
  get() {
    return () => Promise.resolve();
  }
});
Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  get() {
    return () => {};
  }
});
