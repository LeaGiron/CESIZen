const { act, renderHook, waitFor } = require('@testing-library/react-native');

const mockReplace = jest.fn();
const mockSetItem = jest.fn();
const mockClear = jest.fn();
const mockAlert = jest.fn();

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
    alert: mockAlert,
  },
}));

jest.mock('@/controllers/useAuth', () => ({
  supprimerCompteDefinitivement: jest.fn(),
}));

jest.mock('@/models/profil.model', () => ({
  ProfilLabels: {
    messages: {
      succes: '✅ Profil mis à jour',
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
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

const { useProfil } = require('@/controllers/useProfil');

describe('useProfil - tests de non-régression', () => {
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

  it('charge les informations du profil connecté', async () => {
    // Le profil est chargé automatiquement au montage du hook.
    const { result } = renderHook(() => useProfil());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.form.prenom_util).toBe('Léa');
    expect(result.current.form.nom_util).toBe('Dupont');
    expect(result.current.form.email_util).toBe('lea@test.fr');
  });

  it('refuse la mise à jour si l’email est invalide', async () => {
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
