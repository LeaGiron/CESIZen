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

const fauxLog = {
  id_log: '1',
  type_action_log: 'connexion',
  statut_log: 'succès',
  adresse_ip_log: '127.0.0.1',
  date_log: '2025-01-01',
  utilisateur: {
    email_util: 'lea@test.fr',
  },
};

jest.mock('@/controllers/useAdmin_logs', () => ({
  // Ces constantes sont utilisées directement par la page avec .map().
  // Elles doivent donc être exportées par le mock, pas seulement dans le retour du hook.
  FILTRES_STATUT: ['Tous', 'succès', 'erreur'],
  FILTRES_ACTION: ['Tous', 'connexion'],

  useAdminLogs: jest.fn(() => ({
    logs: [fauxLog],
    logsFiltres: [fauxLog],
    recherche: '',
    setRecherche: jest.fn(),
    filtreStatut: 'Tous',
    setFiltreStatut: jest.fn(),
    filtreAction: 'Tous',
    setFiltreAction: jest.fn(),
    chargement: false,
    rafraichir: jest.fn(),
    total: 1,
  })),
}));

const LogsAdmin = require('@/app/admin/logs_admin').default;

describe('logs_admin - tests unitaires', () => {
  it('affiche un log admin', () => {
    // On vérifie que l’écran affiche les données fournies par le controller mocké.
    const { getByText } = render(React.createElement(LogsAdmin));

    expect(getByText('connexion')).toBeTruthy();
  });
});
