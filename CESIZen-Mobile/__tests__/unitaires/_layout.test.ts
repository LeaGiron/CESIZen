const React = require('react');
const { render } = require('@testing-library/react-native');

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

  const MockStack = ({ children }: any) =>
    React.createElement(React.Fragment, null, children);

  MockStack.Screen = () => null;

  return {
    ErrorBoundary: () => null,
    Stack: MockStack,
    useRouter: () => ({
      replace: jest.fn(),
    }),
  };
});

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() =>
        Promise.resolve({
          data: {
            session: null,
          },
        })
      ),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() =>
            Promise.resolve({
              data: null,
              error: null,
            })
          ),
        })),
      })),
    })),
  },
}));

const Layout = require('@/app/_layout').default;

describe('_layout - tests unitaires', () => {
  it('rend le layout sans faire planter l’application', () => {
    // Test unitaire simple : le layout doit pouvoir être rendu.
    const result = render(React.createElement(Layout));

    expect(result).toBeTruthy();
  });
});
