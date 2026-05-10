const { act, renderHook, waitFor } = require('@testing-library/react-native');

const mockReplace = jest.fn();

const mockGetUser = jest.fn();
const mockGetSession = jest.fn();

const mockGetRoleUtilisateur = jest.fn();
const mockGetAllUtilisateurs = jest.fn();
const mockUpdateUtilisateur = jest.fn();
const mockDeverrouillerUtilisateurs = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: mockGetUser,
      getSession: mockGetSession,
    },
    from: jest.fn(() => ({
      delete: jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      })),
    })),
  },
}));

jest.mock('@/models/admin_ressources.model', () => ({
  getRoleUtilisateur: mockGetRoleUtilisateur,
}));

jest.mock('@/models/admin_utilisateurs.model', () => ({
  getAllUtilisateurs: mockGetAllUtilisateurs,
  updateUtilisateur: mockUpdateUtilisateur,
  deverrouillerUtilisateurs: mockDeverrouillerUtilisateurs,
}));

const { useAdminUtilisateurs } = require('@/controllers/useAdmin_utilisateurs');

describe('useAdminUtilisateurs - tests unitaires', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'admin-1' } },
    });

    mockGetSession.mockResolvedValue({
      data: { session: { access_token: 'token-test' } },
    });

    mockGetRoleUtilisateur.mockResolvedValue('Administrateur');

    mockGetAllUtilisateurs.mockResolvedValue([
      {
        id_util: 'u1',
        nom_util: 'Dupont',
        prenom_util: 'Léa',
        email_util: 'lea@test.fr',
        type_util: 'Administrateur',
        statut_compte_util: 'actif',
      },
    ]);
  });

  it('charge les utilisateurs pour un administrateur', async () => {
    // On teste seulement la récupération des utilisateurs après validation du rôle.
    const { result } = renderHook(() => useAdminUtilisateurs());

    await waitFor(() => {
      expect(result.current.chargement).toBe(false);
    });

    expect(result.current.utilisateurs).toHaveLength(1);
  });

  it('prépare un utilisateur pour modification', () => {
    // Le formulaire doit reprendre les informations de l’utilisateur sélectionné.
    const { result } = renderHook(() => useAdminUtilisateurs());

    act(() => {
      result.current.preparerModification({
        id_util: 'u1',
        nom_util: 'Dupont',
        prenom_util: 'Léa',
        email_util: 'lea@test.fr',
        type_util: 'Administrateur',
        statut_compte_util: 'actif',
      });
    });

    expect(result.current.idEnCoursEdition).toBe('u1');
    expect(result.current.form.email_util).toBe('lea@test.fr');
  });

  it('annule une édition', () => {
    // Annuler doit remettre le formulaire à zéro.
    const { result } = renderHook(() => useAdminUtilisateurs());

    act(() => {
      result.current.preparerModification({
        id_util: 'u1',
        nom_util: 'Dupont',
        prenom_util: 'Léa',
        email_util: 'lea@test.fr',
        type_util: 'Utilisateur',
        statut_compte_util: 'actif',
      });

      result.current.annulerEdition();
    });

    expect(result.current.idEnCoursEdition).toBeNull();
    expect(result.current.form.email_util).toBe('');
  });
});
