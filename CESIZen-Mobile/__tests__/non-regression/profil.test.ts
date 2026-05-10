
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

const mockSetForm = jest.fn();
const mockHandleUpdate = jest.fn();
const mockHandleDelete = jest.fn();
const mockHandleLogout = jest.fn();
const mockHandlePasswordReset = jest.fn();

jest.mock('expo-router', () => ({
  Stack: {
    Screen: () => null,
  },
}));

jest.mock('@/models/profil.model', () => ({
  ProfilLabels: {
    titre: '👤 Mon profil',
    sections: {
      infos: 'Informations personnelles',
    },
    inputs: {
      prenom: 'Prénom',
      nom: 'Nom',
      email: 'Email',
    },
    boutons: {
      deconnexion: 'Déconnexion',
      sauvegarder: 'Enregistrer les modifications',
    },
  },
}));

jest.mock('@/controllers/useProfil', () => ({
  useProfil: jest.fn(() => ({
    form: {
      prenom_util: 'Léa',
      nom_util: 'Dupont',
      email_util: 'lea@test.fr',
    },
    setForm: mockSetForm,
    message: '✅ Profil mis à jour !',
    loading: false,
    handleUpdate: mockHandleUpdate,
    handleDelete: mockHandleDelete,
    handleLogout: mockHandleLogout,
    handlePasswordReset: mockHandlePasswordReset,
  })),
}));

const ProfilPage = require('@/app/profil').default;

describe('profil - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche les informations du profil', () => {
    // On vérifie que les infos du hook sont bien affichées dans l’écran.
    const { getByText, getByDisplayValue } = render(React.createElement(ProfilPage));

    expect(getByText('👤 Mon profil')).toBeTruthy();
    expect(getByText('Informations personnelles')).toBeTruthy();
    expect(getByDisplayValue('Léa')).toBeTruthy();
    expect(getByDisplayValue('Dupont')).toBeTruthy();
    expect(getByDisplayValue('lea@test.fr')).toBeTruthy();
    expect(getByText('✅ Profil mis à jour !')).toBeTruthy();
  });

  it('appelle les actions du profil', () => {
    const { getByText } = render(React.createElement(ProfilPage));

    fireEvent.press(getByText('Enregistrer les modifications'));
    fireEvent.press(getByText('Déconnexion'));
    fireEvent.press(getByText('Réinitialiser mon mot de passe'));
    fireEvent.press(getByText('Supprimer mon compte définitivement'));

    expect(mockHandleUpdate).toHaveBeenCalled();
    expect(mockHandleLogout).toHaveBeenCalled();
    expect(mockHandlePasswordReset).toHaveBeenCalled();
    expect(mockHandleDelete).toHaveBeenCalled();
  });
});
