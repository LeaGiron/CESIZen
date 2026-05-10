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
const { render } = require('@testing-library/react-native');

jest.mock('expo-router', () => {
  const React = require('react');

  return {
    Stack: {
      Screen: () => null,
    },
    Link: ({ children }: any) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock('@/controllers/useAccueil', () => ({
  useAccueilController: jest.fn(() => ({
    description: 'Une application pour prendre soin de son bien-être.',
    labels: {
      connexion: 'Se connecter',
      inscription: 'Créer un compte',
      invite: 'Continuer sans compte',
    },
  })),
}));

const Accueil = require('@/app/index').default;

describe('index - tests unitaires', () => {
  it('affiche les actions principales de l’accueil', () => {
    // Test unitaire simple du rendu de la page d’accueil.
    const { getByText } = render(React.createElement(Accueil));

    expect(getByText('Une application pour prendre soin de son bien-être.')).toBeTruthy();
    expect(getByText('Se connecter')).toBeTruthy();
    expect(getByText('Créer un compte')).toBeTruthy();
  });
});
