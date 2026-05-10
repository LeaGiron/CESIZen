
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

const mockHandleInscription = jest.fn();
const mockSetNom = jest.fn();
const mockSetPrenom = jest.fn();
const mockSetEmail = jest.fn();
const mockSetMotDePasse = jest.fn();
const mockOpenURL = jest.fn();

jest.mock('expo-linking', () => ({
  openURL: mockOpenURL,
}));

jest.mock('@/controllers/useAuth', () => ({
  useInscription: jest.fn(() => ({
    nom_util: '',
    setNom: mockSetNom,
    prenom_util: '',
    setPrenom: mockSetPrenom,
    email_util: '',
    setEmail: mockSetEmail,
    mot_de_passe_util: '',
    setMotDePasse: mockSetMotDePasse,
    handleInscription: mockHandleInscription,
    messageErreur: 'Mot de passe incomplet',
  })),
}));

const InscriptionPage = require('@/app/inscription').default;

describe('inscription - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche les champs du formulaire d’inscription', () => {
    // Le formulaire doit toujours permettre de saisir les infos principales.
    const { getByPlaceholderText, getByText } = render(React.createElement(InscriptionPage));

    expect(getByPlaceholderText('Nom')).toBeTruthy();
    expect(getByPlaceholderText('Prénom')).toBeTruthy();
    expect(getByPlaceholderText('Adresse e-mail')).toBeTruthy();
    expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
    expect(getByText("S'inscrire")).toBeTruthy();
  });

  it('affiche le message d’erreur venant du controller', () => {
    const { getByText } = render(React.createElement(InscriptionPage));

    expect(getByText('Mot de passe incomplet')).toBeTruthy();
  });

  it('appelle l’inscription quand on appuie sur le bouton', () => {
    const { getByText } = render(React.createElement(InscriptionPage));

    fireEvent.press(getByText("S'inscrire"));

    expect(mockHandleInscription).toHaveBeenCalled();
  });
});
