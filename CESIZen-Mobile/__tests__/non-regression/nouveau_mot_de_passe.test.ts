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
const { Alert } = require('react-native');
const { fireEvent, render, waitFor } = require('@testing-library/react-native');

const mockReplace = jest.fn();
const mockUpdateUser = jest.fn();

jest.mock('expo-router', () => ({
  Stack: {
    Screen: () => null,
  },
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            access_token: 'fake-token',
            user: { id: 'user-test-123' },
          },
        },
        error: null,
      }),

      updateUser: mockUpdateUser,

      onAuthStateChange: jest.fn().mockReturnValue({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      }),
    },
  },
}));

const NouveauMotDePassePage = require('@/app/nouveau_mot_de_passe').default;

describe('nouveau_mot_de_passe - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('refuse un mot de passe trop court', () => {
    // On vérifie la première validation côté écran.
    const { getByPlaceholderText, getByText } = render(React.createElement(NouveauMotDePassePage));

    fireEvent.changeText(getByPlaceholderText('Nouveau mot de passe'), 'court');
    fireEvent.changeText(getByPlaceholderText('Confirmer le mot de passe'), 'court');
    fireEvent.press(getByText('Enregistrer les modifications'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Mot de passe incomplet',
      'Il manque : 12 caractères minimum, une majuscule, un chiffre, un caractère spécial'
    );
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('refuse deux mots de passe différents', () => {
    const { getByPlaceholderText, getByText } = render(React.createElement(NouveauMotDePassePage));

    fireEvent.changeText(getByPlaceholderText('Nouveau mot de passe'), 'MotDePasse123!');
    fireEvent.changeText(getByPlaceholderText('Confirmer le mot de passe'), 'AutreMotDePasse123!');
    fireEvent.press(getByText('Enregistrer les modifications'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Erreur',
      'Les mots de passe ne correspondent pas.'
    );
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('met à jour le mot de passe si le formulaire est valide', async () => {
    mockUpdateUser.mockResolvedValue({ error: null });

    const { getByPlaceholderText, getByText } = render(React.createElement(NouveauMotDePassePage));

    fireEvent.changeText(getByPlaceholderText('Nouveau mot de passe'), 'MotDePasse123!');
    fireEvent.changeText(getByPlaceholderText('Confirmer le mot de passe'), 'MotDePasse123!');
    fireEvent.press(getByText('Enregistrer les modifications'));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        password: 'MotDePasse123!',
      });
    });
  });
});
