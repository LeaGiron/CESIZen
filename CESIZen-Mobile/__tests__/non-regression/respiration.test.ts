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

const mockSetExerciceIndex = jest.fn();
const mockSetNbCycles = jest.fn();
const mockDemarrer = jest.fn();
const mockArreter = jest.fn();
const mockSetPause = jest.fn();

jest.mock('@react-native-community/slider', () => {
  const React = require('react');
  const { View } = require('react-native');

  return function Slider() {
    return React.createElement(View);
  };
});

const mockUseRespiration = jest.fn();

jest.mock('@/controllers/useRespiration', () => ({
  useRespiration: () => mockUseRespiration(),
}));

const RespirationPage = require('@/app/respiration').default;

describe('respiration - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRespiration.mockReturnValue({
      exerciceIndex: 0,
      setExerciceIndex: mockSetExerciceIndex,
      actif: false,
      pause: false,
      setPause: mockSetPause,
      phase: 'inspiration',
      compteur: 5,
      cyclesRestants: 3,
      exercices: [
        { label: '5-0-5 (Relaxation)', inspiration: 5, apnee: 0, expiration: 5 },
        { label: 'Personnalisé', inspiration: 4, apnee: 4, expiration: 4 },
      ],
      nbCycles: 3,
      setNbCycles: mockSetNbCycles,
      demarrer: mockDemarrer,
      arreter: mockArreter,
      colors: { bg: '#fff', text: '#000', circle: '#000' },
      estCustom: false,
      dureeCustom: { inspiration: 4, apnee: 4, expiration: 4 },
      setDureeCustom: jest.fn(),
      estConnecte: true,
      chargement: false,
    });
  });

  it('affiche l’écran de respiration prêt à démarrer', () => {
    // On vérifie que l’écran affiche l’exercice, les cycles et le bouton de démarrage.
    const { getByText } = render(React.createElement(RespirationPage));

    expect(getByText('Respiration')).toBeTruthy();
    expect(getByText('5-0-5 (Relaxation)')).toBeTruthy();
    expect(getByText('Cycles')).toBeTruthy();
    expect(getByText('Démarrer')).toBeTruthy();
    expect(getByText('Prêt ?')).toBeTruthy();
  });

  it('lance une séance quand on appuie sur démarrer', () => {
    const { getByText } = render(React.createElement(RespirationPage));

    fireEvent.press(getByText('Démarrer'));

    expect(mockDemarrer).toHaveBeenCalled();
  });

  it('affiche pause et arrêter quand une séance est active', () => {
    mockUseRespiration.mockReturnValue({
      exerciceIndex: 0,
      setExerciceIndex: mockSetExerciceIndex,
      actif: true,
      pause: false,
      setPause: mockSetPause,
      phase: 'inspiration',
      compteur: 5,
      cyclesRestants: 2,
      exercices: [
        { label: '5-0-5 (Relaxation)', inspiration: 5, apnee: 0, expiration: 5 },
      ],
      nbCycles: 3,
      setNbCycles: mockSetNbCycles,
      demarrer: mockDemarrer,
      arreter: mockArreter,
      colors: { bg: '#fff', text: '#000', circle: '#000' },
      estCustom: false,
      dureeCustom: { inspiration: 4, apnee: 4, expiration: 4 },
      setDureeCustom: jest.fn(),
      estConnecte: true,
      chargement: false,
    });

    const { getByText } = render(React.createElement(RespirationPage));

    expect(getByText('Inspirez')).toBeTruthy();
    expect(getByText('Pause')).toBeTruthy();
    expect(getByText('Arrêter')).toBeTruthy();

    fireEvent.press(getByText('Arrêter'));

    expect(mockArreter).toHaveBeenCalled();
  });
});
