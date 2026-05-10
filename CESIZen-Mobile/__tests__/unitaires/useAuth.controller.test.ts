const { act, renderHook } = require('@testing-library/react-native');

const mockReplace = jest.fn();
const mockPush = jest.fn();

const mockSignUp = jest.fn();
const mockSignInWithPassword = jest.fn();
const mockResetPasswordForEmail = jest.fn();
const mockSignOut = jest.fn();
const mockGetUser = jest.fn();

const mockRpc = jest.fn();

const mockInsert = jest.fn();
const mockUpsert = jest.fn();

const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({ single: mockSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));

const mockUpdateEq = jest.fn();
const mockUpdate = jest.fn(() => ({ eq: mockUpdateEq }));

const mockFrom = jest.fn(() => ({
  insert: mockInsert,
  upsert: mockUpsert,
  select: mockSelect,
  update: mockUpdate,
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  clear: jest.fn(),
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
    rpc: mockRpc,
    auth: {
      signUp: mockSignUp,
      signInWithPassword: mockSignInWithPassword,
      resetPasswordForEmail: mockResetPasswordForEmail,
      signOut: mockSignOut,
      getUser: mockGetUser,
    },
  },
}));

const {
  inscription,
  connexion,
  useConnexion,
  useMotDePasseOublie,
} = require('@/controllers/useAuth');

describe('useAuth - tests unitaires', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockRpc.mockResolvedValue({ data: 'OK', error: null });
    mockInsert.mockResolvedValue({ error: null });
    mockUpsert.mockResolvedValue({ error: null });
    mockSingle.mockResolvedValue({
      data: { type_util: 'Utilisateur' },
      error: null,
    });
    mockUpdateEq.mockResolvedValue({ error: null });
    mockResetPasswordForEmail.mockResolvedValue({ error: null });
  });

  it('refuse une inscription si le mot de passe est trop faible', async () => {
    // Ici on teste uniquement la règle de validation du mot de passe.
    await expect(
      inscription('lea@test.fr', 'abc', 'Dupont', 'Léa')
    ).rejects.toThrow('Mot de passe incomplet');

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('normalise l’email pendant la connexion', async () => {
    // Ce test vérifie un comportement précis :
    // l’email doit être nettoyé avant d’être envoyé à Supabase.
    mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });

    const result = await connexion('  LEA@TEST.FR ', 'Motdepasse123!');

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'lea@test.fr',
      password: 'Motdepasse123!',
    });
    expect(result.success).toBe(true);
  });

  it('redirige vers le dashboard pour un utilisateur classique', async () => {
    // On teste uniquement la décision de navigation du hook.
    mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });

    const { result } = renderHook(() => useConnexion());

    act(() => {
      result.current.setEmail('lea@test.fr');
      result.current.setMotDePasse('Motdepasse123!');
    });

    await act(async () => {
      await result.current.handleConnexion();
    });

    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('demande un email pour le mot de passe oublié', async () => {
    // Cas unitaire simple : sans email, on ne doit pas appeler Supabase.
    const { result } = renderHook(() => useMotDePasseOublie());

    await act(async () => {
      await result.current.handleReinitialisation();
    });

    expect(result.current.messageErreur).toBe('Email requis');
    expect(mockResetPasswordForEmail).not.toHaveBeenCalled();
  });
});
