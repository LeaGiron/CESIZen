const { act, renderHook } = require('@testing-library/react-native');

const mockReplace = jest.fn();
const mockGetUser = jest.fn();

const mockSingle = jest.fn();
const mockEqUser = jest.fn(() => ({ single: mockSingle }));

const mockOrder = jest.fn();
const mockInsertSelect = jest.fn();
const mockInsert = jest.fn(() => ({ select: mockInsertSelect }));

const mockFrom = jest.fn((table: string) => {
  if (table === 'utilisateur') {
    return {
      select: jest.fn(() => ({ eq: mockEqUser })),
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
    alert: jest.fn(),
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

describe('useAdmin - tests unitaires', () => {
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
      data: [],
      error: null,
    });

    mockInsertSelect.mockResolvedValue({
      data: [{ id: '1', titre: 'Nouvelle ressource', categorie: 'Stress' }],
      error: null,
    });
  });

  it('refuse l’ajout si les champs sont vides', async () => {
    // Test unitaire de validation : pas de titre/catégorie, pas d'insertion.
    const { result } = renderHook(() => useAdmin());

    await act(async () => {
      await result.current.ajouterRessource();
    });

    expect(result.current.message).toBe('❌ Veuillez remplir tous les champs.');
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('met à jour le formulaire avant ajout', () => {
    // On vérifie que les setters exposés par le hook modifient bien l’état local.
    const { result } = renderHook(() => useAdmin());

    act(() => {
      result.current.setNouveauTitre('Respiration');
      result.current.setNouvelleCategorie('Bien-être');
    });

    expect(result.current.nouveauTitre).toBe('Respiration');
    expect(result.current.nouvelleCategorie).toBe('Bien-être');
  });
});
