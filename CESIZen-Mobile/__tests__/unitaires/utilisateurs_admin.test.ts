// Mocks communs sans JSX pour rester compatible avec des fichiers .ts.
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

jest.mock('@/components/AdminFooter', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    AdminFooter: () => React.createElement(Text, null, 'Footer admin'),
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

jest.mock('expo-router', () => {
  const React = require('react');

  return {
    usePathname: jest.fn(() => '/admin'),
    useRouter: jest.fn(() => ({
      push: jest.fn(),
      replace: jest.fn(),
    })),
    Link: ({ children }: any) =>
      React.createElement(React.Fragment, null, children),
  };
});

const React = require('react');
const { render } = require('@testing-library/react-native');

jest.mock('@/controllers/useAdmin_utilisateurs', () => ({
  useAdminUtilisateurs: jest.fn(() => ({
    utilisateurs: [
      {
        id_util: 'u1',
        nom_util: 'Dupont',
        prenom_util: 'Léa',
        email_util: 'lea@test.fr',
        type_util: 'Administrateur',
        statut_compte_util: 'actif',
      },
    ],
    form: {
      nom_util: '',
      prenom_util: '',
      email_util: '',
      type_util: 'Utilisateur',
      statut_compte_util: 'actif',
    },
    setForm: jest.fn(),
    chargement: false,
    message: '',
    idEnCoursEdition: null,
    scrollToTopRef: { current: null },
    preparerModification: jest.fn(),
    annulerEdition: jest.fn(),
    validerModification: jest.fn(),
    supprimerUtilisateur: jest.fn(),
    deverrouiller: jest.fn(),
  })),
}));

const UtilisateursAdmin = require('@/app/admin/utilisateurs_admin').default;

describe('utilisateurs_admin - tests unitaires', () => {
  it('affiche un utilisateur admin', () => {
    // On mocke le controller, puis on vérifie que l’écran affiche l’utilisateur.
    const { getByText } = render(React.createElement(UtilisateursAdmin));

    expect(getByText('lea@test.fr')).toBeTruthy();
  });
});
