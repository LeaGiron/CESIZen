const { renderHook, waitFor } = require('@testing-library/react-native');

const mockUnsubscribe = jest.fn();
const mockGetUser = jest.fn();
const mockOnAuthStateChange = jest.fn(() => ({
  data: { subscription: { unsubscribe: mockUnsubscribe } },
}));

const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({ single: mockSingle }));
const mockLimit = jest.fn();
const mockOrder = jest.fn(() => ({ limit: mockLimit }));

const mockFrom = jest.fn((table) => {
  if (table === 'utilisateur') {
    return {
      select: jest.fn(() => ({ eq: mockEq })),
    };
  }

  return {
    select: jest.fn(() => ({ order: mockOrder })),
  };
});

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
    auth: {
      getUser: mockGetUser,
      onAuthStateChange: mockOnAuthStateChange,
    },
  },
}));

const { useDashboard } = require('@/controllers/useDashboard');

describe('useDashboard - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'admin-1' } },
    });

    mockSingle.mockResolvedValue({
      data: { prenom_util: 'Léa', type_util: 'Administrateur' },
      error: null,
    });

    mockLimit.mockResolvedValue({
      data: [
        { id_ress: 1, titre_ress: 'Stress', categorie_ress: 'Bien-être' },
        { id_ress: 2, titre_ress: 'Sommeil', categorie_ress: 'Bien-être' },
      ],
      error: null,
    });
  });

  it('charge le prénom, le rôle admin et les dernières ressources', async () => {
    // Le dashboard assemble deux infos : le profil connecté et les dernières ressources.
    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.prenom_util).toBe('Léa');
    });

    expect(result.current.estConnecte).toBe(true);
    expect(result.current.estAdmin).toBe(true);
    expect(result.current.ressources).toHaveLength(2);
  });
});
