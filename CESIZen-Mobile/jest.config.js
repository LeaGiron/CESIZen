module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterFramework: ['./jest.setupAfterFramework.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  moduleNameMapper: {
    // Supabase → mock automatique (doit être AVANT la règle générique @/)
    '^@/lib/supabase$': '<rootDir>/__mocks__/lib/supabase.ts',
    // Résout tous les autres @/ → racine du projet (miroir tsconfig paths)
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathPattern: ['__tests__/.*\\.(test|spec)\\.[jt]sx?$', '.*\\.(test|spec)\\.[jt]sx?$'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};