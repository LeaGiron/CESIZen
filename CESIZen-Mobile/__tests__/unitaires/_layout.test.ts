const React = require('react');
const { render } = require('@testing-library/react-native');

const mockReplace = jest.fn();
const mockGetSession = jest.fn(() =>
  Promise.resolve({
    data: { session: null },
  })
);

const mockSingle = jest.fn(() =>
  Promise.resolve({
    data: null,
    error: null,
  })
);

const mockEq = jest.fn(() => ({
  single: mockSingle,
}));

const mockSelect = jest.fn(() => ({
  eq: mockEq,
}));

const mockFrom = jest.fn(() => ({
  select: mockSelect,
}));

const MockThemeProvider = ({ children }: any) =>
  React.createElement(React.Fragment, null, children);

const MockStack = ({ children }: any) =>
  React.createElement(React.Fragment, null, children);

MockStack.Screen = () => null;

jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true, null]),
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('react-native-reanimated', () => ({}));

jest.mock('@expo/vector-icons/FontAwesome', () => ({
  font: {},
}));

jest.mock('@react-navigation/native', () => ({
  DarkTheme: { dark: true },
  DefaultTheme: { dark: false },
  ThemeProvider: MockThemeProvider,
}));

jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('expo-router', () => ({
  ErrorBoundary: () => null,
  Stack: MockStack,
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
    },
    from: mockFrom,
  },
}));

const Layout = require('@/app/_layout').default;

describe('_layout - tests unitaires', () => {
  it('rend le layout sans faire planter l’application', () => {
    const result = render(React.createElement(Layout));

    expect(result).toBeTruthy();
  });
});