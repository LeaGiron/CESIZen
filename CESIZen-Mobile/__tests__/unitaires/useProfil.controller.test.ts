const { act, renderHook, waitFor } = require('@testing-library/react-native');

const mockReplace = jest.fn();
const mockSetItem = jest.fn();
const mockClear = jest.fn();

const mockGetUser = jest.fn();
const mockResetPasswordForEmail = jest.fn();
const mockSignOut = jest.fn();

const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({ single: mockSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));

const mockUpdateEq = jest.fn();
const mockUpdate = jest.fn(() => ({ eq: mockUpdateEq }));

const mockFrom = jest.fn(() => ({
  select: mockSelect,
  update: mockUpdate,
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: mockSetItem,
  clear: mockClear,
}));

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

jest.mock('@/controllers/useAuth', () => ({
  supprimerCompteDefinitivement: jest.fn(),
}));

jest.mock('@/models/profil.model', () => ({
  ProfilLabels: {
    messages: {
      succes: '✅ Profil mis à jour !',
      erreur: '❌ Erreur profil',
    },
  },
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
    auth: {
      getUser: mockGetUser,
      resetPasswordForEmail: mockResetPasswordForEmail,
      signOut: mockSignOut,
    },
  },
}));

const { useProfil } = require('@/controllers/useProfil');

describe('useProfil - tests unitaires', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          email: 'lea@test.fr',
          user_metadata: {},
        },
      },
    });

    mockSingle.mockResolvedValue({
      data: {
        prenom_util: 'Léa',
        nom_util: 'Dupont',
        email_util: 'lea@test.fr',
      },
      error: null,
    });

    mockUpdateEq.mockResolvedValue({ error: null });
    mockSignOut.mockResolvedValue({ error: null });
  });

  it('charge le profil connecté', async () => {
    // Test unitaire du chargement des données du profil.
    const { result } = renderHook(() => useProfil());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.form.prenom_util).toBe('Léa');
    expect(result.current.form.email_util).toBe('lea@test.fr');
  });

  it('refuse un email invalide lors de la modification', async () => {
    // On teste seulement la validation email côté controller.
    const { result } = renderHook(() => useProfil());

    act(() => {
      result.current.setForm({
        prenom_util: 'Léa',
        nom_util: 'Dupont',
        email_util: 'email-invalide',
      });
    });

    await act(async () => {
      await result.current.handleUpdate();
    });

    expect(result.current.message).toBe('❌ Adresse e-mail invalide');
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
