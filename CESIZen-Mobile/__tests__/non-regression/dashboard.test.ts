
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

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockUseDashboard = jest.fn();

jest.mock('@/controllers/useDashboard', () => ({
  useDashboard: () => mockUseDashboard(),
}));

const DashboardPage = require('@/app/dashboard').default;

describe('dashboard - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche les informations principales du dashboard connecté', () => {
    // On simule un utilisateur connecté pour vérifier l’affichage attendu.
    mockUseDashboard.mockReturnValue({
      prenom_util: 'Léa',
      estConnecte: true,
      estAdmin: false,
      ressources: [
        {
          id_ress: '1',
          titre_ress: 'Gérer le stress',
          categorie_ress: 'bien-être',
        },
      ],
    });

    const { getByText } = render(React.createElement(DashboardPage));

    expect(getByText('Bonjour Léa !')).toBeTruthy();
    expect(getByText('Dernières ressources')).toBeTruthy();
    expect(getByText('Gérer le stress')).toBeTruthy();
    expect(getByText('Le coin détente')).toBeTruthy();
    expect(getByText('Mon compte')).toBeTruthy();
  });

  it('affiche le mode visiteur si l’utilisateur n’est pas connecté', () => {
    mockUseDashboard.mockReturnValue({
      prenom_util: 'visiteur',
      estConnecte: false,
      estAdmin: false,
      ressources: [],
    });

    const { getByText } = render(React.createElement(DashboardPage));

    expect(getByText('Mode visiteur')).toBeTruthy();

    fireEvent.press(getByText('Se connecter →'));

    expect(mockPush).toHaveBeenCalledWith('/connexion');
  });

  it('redirige vers la respiration quand on appuie sur commencer', () => {
    mockUseDashboard.mockReturnValue({
      prenom_util: 'Léa',
      estConnecte: true,
      estAdmin: false,
      ressources: [],
    });

    const { getByText } = render(React.createElement(DashboardPage));

    fireEvent.press(getByText('Commencer'));

    expect(mockPush).toHaveBeenCalledWith('/respiration');
  });
});
