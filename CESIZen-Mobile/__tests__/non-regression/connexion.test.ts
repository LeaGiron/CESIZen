
// Mocks simples des composants visuels.
// Important : les fichiers sont en .ts, donc on évite le JSX ici.
// On utilise React.createElement pour que Jest puisse lire le fichier sans erreur.
jest.mock('@/components/Bouton', () => {
  const React = require('react');
  const { Text, TouchableOpacity } = require('react-native');

  return {
    Bouton: ({ label, onPress, disabled }: any) =>
      React.createElement(
        TouchableOpacity,
        { onPress, disabled },
        React.createElement(Text, null, label)
      ),
  };
});

jest.mock('@/components/Bouton_retour', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return function BoutonRetour() {
    return React.createElement(Text, null, 'Bouton retour');
  };
});

jest.mock('@/components/Header', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    Header: () => React.createElement(Text, null, 'Header CESIZen'),
  };
});

jest.mock('@/components/Input', () => {
  const React = require('react');
  const { TextInput } = require('react-native');

  return {
    Input: ({ placeholder, value, onChangeText, secureTextEntry }: any) =>
      React.createElement(TextInput, {
        placeholder,
        value,
        onChangeText,
        secureTextEntry,
      }),
  };
});

jest.mock('@/components/Separateur', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    Separateur: () => React.createElement(Text, null, '---'),
  };
});

jest.mock('@/components/Footer', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    FooterNav: () => React.createElement(Text, null, 'Footer navigation'),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    SafeAreaView: ({ children }: any) =>
      React.createElement(View, null, children),
  };
});

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    Ionicons: ({ name }: any) => React.createElement(Text, null, name),
    MaterialCommunityIcons: ({ name }: any) => React.createElement(Text, null, name),
  };
});

const React = require('react');
const { fireEvent, render } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockHandleConnexion = jest.fn();
const mockSetEmail = jest.fn();
const mockSetMotDePasse = jest.fn();

jest.mock('expo-router', () => ({
  Stack: {
    Screen: () => null,
  },
}));

jest.mock('@/controllers/useAuth', () => ({
  useConnexion: jest.fn(() => ({
    email_util: '',
    setEmail: mockSetEmail,
    mot_de_passe_util: '',
    setMotDePasse: mockSetMotDePasse,
    handleConnexion: mockHandleConnexion,
    messageErreur: 'Identifiants incorrects',
    router: {
      push: mockPush,
    },
  })),
}));

const ConnexionPage = require('@/app/connexion').default;

describe('connexion - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le formulaire de connexion et le message d’erreur', () => {
    // On vérifie que l’écran contient les champs minimums pour se connecter.
    const { getByPlaceholderText, getByText } = render(React.createElement(ConnexionPage));

    expect(getByPlaceholderText('Adresse e-mail')).toBeTruthy();
    expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
    expect(getByText('Se connecter')).toBeTruthy();
    expect(getByText('Identifiants incorrects')).toBeTruthy();
  });

  it('appelle la connexion quand on appuie sur le bouton', () => {
    const { getByText } = render(React.createElement(ConnexionPage));

    fireEvent.press(getByText('Se connecter'));

    expect(mockHandleConnexion).toHaveBeenCalled();
  });

  it('redirige vers mot de passe oublié', () => {
    const { getByText } = render(React.createElement(ConnexionPage));

    fireEvent.press(getByText('Mot de passe oublié ?'));

    expect(mockPush).toHaveBeenCalledWith('/mot_de_passe_oublie');
  });
});
