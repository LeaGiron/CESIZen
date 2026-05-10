const { renderHook, waitFor } = require('@testing-library/react-native');

const mockGetUser = jest.fn();
const mockOnAuthStateChange = jest.fn(() => ({
  data: {
    subscription: {
      unsubscribe: jest.fn(),
    },
  },
}));

const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({ single: mockSingle }));

const mockLimit = jest.fn();
const mockOrder = jest.fn(() => ({ limit: mockLimit }));

const mockFrom = jest.fn((table: string) => {
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

describe('useDashboard - tests unitaires', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: {
        user: { id: 'user-1' },
      },
    });

    mockSingle.mockResolvedValue({
      data: {
        prenom_util: 'Léa',
        type_util: 'Administrateur',
      },
      error: null,
    });

    mockLimit.mockResolvedValue({
      data: [
        { id_ress: '1', titre_ress: 'Stress' },
      ],
      error: null,
    });
  });

  it('identifie un utilisateur administrateur', async () => {
    // On teste le résultat calculé par le hook : connecté + admin.
    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.prenom_util).toBe('Léa');
    });

    expect(result.current.estConnecte).toBe(true);
    expect(result.current.estAdmin).toBe(true);
  });
});
