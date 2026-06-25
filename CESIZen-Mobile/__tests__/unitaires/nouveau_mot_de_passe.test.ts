// Mocks communs pour tester les écrans simplement.
// Les fichiers sont en .ts, donc on évite le JSX dans les tests.
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
const { fireEvent, render } = require('@testing-library/react-native');

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
      updateUser: mockUpdateUser,
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
  },
}));

const NouveauMotDePasse = require('@/app/nouveau_mot_de_passe').default;

describe('nouveau_mot_de_passe - tests unitaires', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('affiche les deux champs de mot de passe', () => {
    // On vérifie que l’écran permet bien de saisir et confirmer un mot de passe.
    const { getByPlaceholderText } = render(
      React.createElement(NouveauMotDePasse)
    );

    expect(getByPlaceholderText('Nouveau mot de passe')).toBeTruthy();
    expect(getByPlaceholderText('Confirmer le mot de passe')).toBeTruthy();
  });

  it('refuse un mot de passe trop court', () => {
    // Test unitaire d’une validation simple côté écran.
    const { getByPlaceholderText, getByText } = render(
      React.createElement(NouveauMotDePasse)
    );

    fireEvent.changeText(getByPlaceholderText('Nouveau mot de passe'), 'court');
    fireEvent.changeText(getByPlaceholderText('Confirmer le mot de passe'), 'court');
    fireEvent.press(getByText('Enregistrer les modifications'));

    expect(Alert.alert).toHaveBeenCalled();
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });
});
