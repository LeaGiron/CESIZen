module.exports = {
  preset: 'jest-expo',

  // Fichiers exécutés avant les tests
  setupFiles: ['./jest.setup.js'],

  // Configuration exécutée après l’environnement Jest
  setupFilesAfterEnv: ['./jest.setupAfterFramework.js'],

  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],

  moduleNameMapper: {
    '^@/lib/supabase$': '<rootDir>/__mocks__/lib/supabase.ts',
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Localisation des fichiers de tests
  testMatch: [
    '**/__tests__/**/*.(test|spec).[jt]s?(x)',
    '**/?(*.)+(test|spec).[jt]s?(x)',
  ],

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