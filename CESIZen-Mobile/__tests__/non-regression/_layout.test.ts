const React = require('react');
const { render, waitFor } = require('@testing-library/react-native');

const mockReplace = jest.fn();
const mockGetSession = jest.fn();
const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({ single: mockSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
const mockFrom = jest.fn(() => ({ select: mockSelect }));

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

jest.mock('@react-navigation/native', () => {
  const React = require('react');

  return {
    DarkTheme: { dark: true },
    DefaultTheme: { dark: false },
    ThemeProvider: ({ children }: any) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('expo-router', () => {
  const React = require('react');

  // Dans le fichier _layout, Expo Router utilise <Stack> et <Stack.Screen>.
  // On doit donc mocker les deux pour éviter une erreur au rendu du test.
  const MockStack = ({ children }: any) =>
    React.createElement(React.Fragment, null, children);

  MockStack.Screen = () => null;

  return {
    ErrorBoundary: () => null,
    Stack: MockStack,
    useRouter: () => ({
      replace: mockReplace,
    }),
  };
});

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
    },
    from: mockFrom,
  },
}));

const RootLayout = require('@/app/_layout').default;

describe('_layout - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'admin-1' },
        },
      },
    });

    mockSingle.mockResolvedValue({
      data: { type_util: 'Administrateur' },
      error: null,
    });
  });

  it('redirige un administrateur vers la partie admin', async () => {
    // Ce test protège le comportement important du layout :
    // si une session admin existe, l’app redirige vers /admin.
    render(React.createElement(RootLayout));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/admin');
    });
  });
});
