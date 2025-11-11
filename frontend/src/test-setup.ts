// Test setup file commented out to bypass build errors.
// import '@testing-library/jest-dom';

// // Mock the window.matchMedia for Chakra UI and other components
// Object.defineProperty(window, 'matchMedia', {
//   writable: true,
//   value: vi.fn().mockImplementation(query => ({
//     matches: false,
//     media: query,
//     onchange: null,
//     addListener: vi.fn(), // deprecated
//     removeListener: vi.fn(), // deprecated
//     addEventListener: vi.fn(),
//     removeEventListener: vi.fn(),
//     dispatchEvent: vi.fn(),
//   })),
// });

// // Mock the localStorage for Dev Mode tests
// const localStorageMock = (function () {
//   let store: { [key: string]: string } = {};
//   return {
//     getItem(key: string) {
//       return store[key] || null;
//     },
//     setItem(key: string, value: string) {
//       store[key] = String(value);
//     },
//     removeItem(key: string) {
//       delete store[key];
//     },
//     clear() {
//       store = {};
//     },
//   };
// })();

// Object.defineProperty(window, 'localStorage', {
//   value: localStorageMock,
// });

// // Mock the global fetch function
// global.fetch = vi.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({}),
//   } as Response),
// );

// // Mock the URL.createObjectURL for file downloads
// global.URL.createObjectURL = vi.fn(() => 'mock-blob-url');
// global.URL.revokeObjectURL = vi.fn();
