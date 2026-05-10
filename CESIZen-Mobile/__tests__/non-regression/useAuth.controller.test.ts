const { act, renderHook } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();

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
const mockDeleteEq = jest.fn();
const mockDelete = jest.fn(() => ({ eq: mockDeleteEq }));

const mockFrom = jest.fn(() => ({
  insert: mockInsert,
  upsert: mockUpsert,
  select: mockSelect,
  update: mockUpdate,
  delete: mockDelete,
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
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
  connexion,
  inscription,
  useConnexion,
  useMotDePasseOublie,
} = require('@/controllers/useAuth');

describe('useAuth - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockRpc.mockResolvedValue({ data: 'OK', error: null });
    mockInsert.mockResolvedValue({ error: null });
    mockUpsert.mockResolvedValue({ error: null });
    mockSingle.mockResolvedValue({ data: { type_util: 'Utilisateur' }, error: null });
    mockUpdateEq.mockResolvedValue({ error: null });
    mockResetPasswordForEmail.mockResolvedValue({ error: null });
  });

  it('refuse une inscription si le mot de passe est trop faible', async () => {
    // On protège ici une règle de sécurité : pas d'inscription avec un mot de passe faible.
    await expect(
      inscription('lea@test.fr', 'abc', 'Dupont', 'Léa')
    ).rejects.toThrow('Mot de passe incomplet');

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('connecte un utilisateur avec un email normalisé', async () => {
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
    expect(result.role).toBe('Utilisateur');
  });

  it('affiche un message si la connexion échoue dans le hook', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: {},
      error: { message: 'Erreur login' },
    });
    mockRpc.mockResolvedValue({ data: 'OK', error: null });

    const { result } = renderHook(() => useConnexion());

    act(() => {
      result.current.setEmail('lea@test.fr');
      result.current.setMotDePasse('mauvais-mdp');
    });

    await act(async () => {
      await result.current.handleConnexion();
    });

    expect(result.current.messageErreur).toBe('Identifiants incorrects');
    expect(mockReplace).not.toHaveBeenCalledWith('/dashboard');
  });

  it('demande un email pour la réinitialisation du mot de passe', async () => {
    const { result } = renderHook(() => useMotDePasseOublie());

    await act(async () => {
      await result.current.handleReinitialisation();
    });

    expect(result.current.messageErreur).toBe('Email requis');
    expect(mockResetPasswordForEmail).not.toHaveBeenCalled();
  });
});
