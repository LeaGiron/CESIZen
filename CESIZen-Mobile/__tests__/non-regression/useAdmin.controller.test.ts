const { act, renderHook, waitFor } = require('@testing-library/react-native');

const mockReplace = jest.fn();
const mockAlert = jest.fn();

const mockGetUser = jest.fn();

const mockSingle = jest.fn();
const mockEqUtilisateur = jest.fn(() => ({ single: mockSingle }));

const mockOrder = jest.fn();
const mockInsertSelect = jest.fn();
const mockInsert = jest.fn(() => ({ select: mockInsertSelect }));

const mockFrom = jest.fn((table) => {
  if (table === 'utilisateur') {
    return {
      select: jest.fn(() => ({ eq: mockEqUtilisateur })),
    };
  }

  return {
    select: jest.fn(() => ({ order: mockOrder })),
    insert: mockInsert,
    delete: jest.fn(() => ({ eq: jest.fn().mockResolvedValue({ error: null }) })),
  };
});

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('react-native', () => ({
  Alert: {
    alert: mockAlert,
  },
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  },
}));

const { useAdmin } = require('@/controllers/useAdmin');

describe('useAdmin - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'admin-1' } },
      error: null,
    });

    mockSingle.mockResolvedValue({
      data: { type_util: 'Administrateur' },
      error: null,
    });

    mockOrder.mockResolvedValue({
      data: [{ id: 1, titre: 'Ressource test', categorie: 'Stress' }],
      error: null,
    });

    mockInsertSelect.mockResolvedValue({
      data: [{ id: 2, titre: 'Nouvelle ressource', categorie: 'Sommeil' }],
      error: null,
    });
  });

  it('charge les ressources quand l’utilisateur est administrateur', async () => {
    // Le controller vérifie le rôle admin avant de charger les ressources.
    const { result } = renderHook(() => useAdmin());

    await waitFor(() => {
      expect(result.current.chargement).toBe(false);
    });

    expect(result.current.ressources).toHaveLength(1);
  });

  it('refuse l’ajout si les champs obligatoires sont vides', async () => {
    const { result } = renderHook(() => useAdmin());

    await act(async () => {
      await result.current.ajouterRessource();
    });

    expect(result.current.message).toBe('❌ Veuillez remplir tous les champs.');
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('ajoute une ressource quand le formulaire est valide', async () => {
    const { result } = renderHook(() => useAdmin());

    act(() => {
      result.current.setNouveauTitre('Nouvelle ressource');
      result.current.setNouvelleCategorie('Sommeil');
    });

    await act(async () => {
      await result.current.ajouterRessource();
    });

    expect(mockInsert).toHaveBeenCalled();
    expect(result.current.message).toBe('✅ Ressource ajoutée !');
  });
});
