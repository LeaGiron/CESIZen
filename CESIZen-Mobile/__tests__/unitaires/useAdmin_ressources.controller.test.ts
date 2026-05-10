const { act, renderHook, waitFor } = require('@testing-library/react-native');

const mockReplace = jest.fn();

const mockGetUser = jest.fn();
const mockGetRoleUtilisateur = jest.fn();
const mockGetAllRessources = jest.fn();
const mockInsertRessource = jest.fn();
const mockUpdateRessource = jest.fn();
const mockDeleteRessource = jest.fn();

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
    },
  },
}));

jest.mock('@/models/admin_ressources.model', () => ({
  getRoleUtilisateur: mockGetRoleUtilisateur,
  getAllRessources: mockGetAllRessources,
  insertRessource: mockInsertRessource,
  updateRessource: mockUpdateRessource,
  deleteRessource: mockDeleteRessource,
}));

const { useAdminRessources } = require('@/controllers/useAdmin_ressources');

describe('useAdminRessources - tests unitaires', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'admin-1' } },
      error: null,
    });

    mockGetRoleUtilisateur.mockResolvedValue('Administrateur');

    mockGetAllRessources.mockResolvedValue([
      {
        id_ress: '1',
        titre_ress: 'Ressource test',
        contenu_ress: 'Contenu',
        categorie_ress: 'Stress',
        statut_ress: 'publie',
      },
    ]);
  });

  it('charge les ressources pour un administrateur', async () => {
    // On vérifie uniquement le chargement initial côté admin.
    const { result } = renderHook(() => useAdminRessources());

    await waitFor(() => {
      expect(result.current.chargement).toBe(false);
    });

    expect(result.current.ressources).toHaveLength(1);
  });

  it('refuse un formulaire sans titre', async () => {
    // Validation unitaire simple : pas de titre, pas d’insertion.
    const { result } = renderHook(() => useAdminRessources());

    await act(async () => {
      await result.current.validerFormulaire();
    });

    expect(result.current.message).toBe('⚠️ Le titre est obligatoire.');
    expect(mockInsertRessource).not.toHaveBeenCalled();
  });

  it('prépare une ressource pour modification', () => {
    // Le formulaire doit être prérempli avec la ressource choisie.
    const { result } = renderHook(() => useAdminRessources());

    act(() => {
      result.current.preparerModification({
        id_ress: '10',
        titre_ress: 'Titre à modifier',
        contenu_ress: 'Texte',
        categorie_ress: 'Sommeil',
        statut_ress: 'brouillon',
      });
    });

    expect(result.current.idEnCoursEdition).toBe('10');
    expect(result.current.form.titre_ress).toBe('Titre à modifier');
  });
});
