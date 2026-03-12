import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
  configurable: true,
});

if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== "function") {
  const store = new Map();
  const mockLocalStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => {
      store.set(String(key), String(value));
    },
    removeItem: (key) => {
      store.delete(String(key));
    },
    clear: () => {
      store.clear();
    },
  };

  Object.defineProperty(globalThis, "localStorage", {
    value: mockLocalStorage,
    configurable: true,
  });
}

if (!globalThis.DOMMatrix) {
  class MockDOMMatrix {
    multiply() {
      return this;
    }
  }

  globalThis.DOMMatrix = MockDOMMatrix;
}
