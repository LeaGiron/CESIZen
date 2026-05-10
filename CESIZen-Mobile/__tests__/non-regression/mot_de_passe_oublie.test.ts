
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

const mockSetEmail = jest.fn();
const mockHandleReinitialisation = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  Stack: {
    Screen: () => null,
  },
}));

const mockUseMotDePasseOublie = jest.fn();

jest.mock('@/controllers/useAuth', () => ({
  useMotDePasseOublie: () => mockUseMotDePasseOublie(),
}));

const MotDePasseOubliePage = require('@/app/mot_de_passe_oublie').default;

describe('mot_de_passe_oublie - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le formulaire avant l’envoi du mail', () => {
    // Avant l’envoi, l’utilisateur doit voir le champ email et le bouton d’envoi.
    mockUseMotDePasseOublie.mockReturnValue({
      email_util: '',
      setEmail: mockSetEmail,
      envoye: false,
      handleReinitialisation: mockHandleReinitialisation,
      router: { push: mockPush },
    });

    const { getByPlaceholderText, getByText } = render(React.createElement(MotDePasseOubliePage));

    expect(getByPlaceholderText('Adresse e-mail')).toBeTruthy();
    expect(getByText('Envoyer le lien')).toBeTruthy();

    fireEvent.press(getByText('Envoyer le lien'));

    expect(mockHandleReinitialisation).toHaveBeenCalled();
  });

  it('affiche le message de succès après l’envoi', () => {
    mockUseMotDePasseOublie.mockReturnValue({
      email_util: 'lea@test.fr',
      setEmail: mockSetEmail,
      envoye: true,
      handleReinitialisation: mockHandleReinitialisation,
      router: { push: mockPush },
    });

    const { getByText } = render(React.createElement(MotDePasseOubliePage));

    expect(getByText(/Un e-mail a été envoyé à lea@test.fr/)).toBeTruthy();

    fireEvent.press(getByText('Retour à la connexion'));

    expect(mockPush).toHaveBeenCalledWith('/connexion');
  });
});
