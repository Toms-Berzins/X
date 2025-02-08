import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { jest } from '@jest/globals';

// Mock environment variables
global.import = {
  meta: {
    env: {
      VITE_FIREBASE_API_KEY: 'mock-api-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'mock-domain.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'mock-project',
      VITE_FIREBASE_STORAGE_BUCKET: 'mock-project.appspot.com',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '000000000000',
      VITE_FIREBASE_APP_ID: '0:000000000000:web:0000000000000000000000',
      VITE_FIREBASE_MEASUREMENT_ID: 'G-0000000000'
    }
  }
};

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Set up a basic DOM environment
const html = `
<!DOCTYPE html>
<html>
  <head></head>
  <body></body>
</html>
`;
document.documentElement.innerHTML = html;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

// Set up fetch mock
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
); 