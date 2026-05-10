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

jest.mock('@/controllers/useAdmin_exercices', () => ({
  useAdminExercices: jest.fn(() => ({
    exercices: [
      {
        id_exer: '1',
        nom_exer: 'Respiration calme',
        description_exer: 'Exercice simple',
        duree_inspiration_defaut_exer: 4,
        duree_apnee_defaut_exer: 0,
        duree_expiration_defaut_exer: 6,
      },
    ],
    form: {
      nom_exer: '',
      description_exer: '',
      duree_inspiration_defaut_exer: 4,
      duree_apnee_defaut_exer: 0,
      duree_expiration_defaut_exer: 6,
    },
    setForm: jest.fn(),
    message: '',
    chargement: false,
    idEnCoursEdition: null,
    validerFormulaire: jest.fn(),
    preparerModification: jest.fn(),
    annulerEdition: jest.fn(),
    supprimerExercice: jest.fn(),
  })),
}));

const ExerciceAdmin = require('@/app/admin/exercice_admin').default;

describe('exercice_admin - tests unitaires', () => {
  it('affiche un exercice admin', () => {
    // Le footer admin est mocké pour rester sur un vrai test unitaire de l’écran.
    const { getByText } = render(React.createElement(ExerciceAdmin));

    expect(getByText('Respiration calme')).toBeTruthy();
  });
});
