// ============================================================
// jest.setup.js
// Configuration globale pour Jest + Expo + Supabase
// ============================================================

// --- Fix : Erreur "window is not defined" ou "Cannot redefine property: window" ---
// On vérifie si window existe déjà (cas de jest-expo) avant de polyfiller
if (typeof window === 'undefined') {
  global.window = global;
}

// Polyfill pour localStorage (utilisé par Supabase Auth)
if (!global.window.localStorage) {
  global.window.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
}

// --- Mock Global Fetch (Indispensable pour Supabase) ---
global.fetch = require('jest-fetch-mock');
fetch.enableMocks();

// --- Mock AsyncStorage ---
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// --- Mock expo-router ---
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  Link: ({ children }) => children,
  Stack: { Screen: ({ children }) => ({ children }) },
  Tabs: { Screen: ({ children }) => ({ children }) },
  Slot: ({ children }) => ({ children }),
}));

// --- Mock expo-font ---
jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
  loadAsync: jest.fn(),
}));

// --- Mock expo-splash-screen ---
jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn(),
}));

// --- Mock expo-status-bar ---
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

// --- Suppression des logs inutiles durant les tests (Optionnel) ---
jest.spyOn(console, 'warn').mockImplementation(() => {});
// jest.spyOn(console, 'error').mockImplementation(() => {});