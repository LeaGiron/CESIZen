const { act, renderHook, waitFor } = require('@testing-library/react-native');

const mockGetSession = jest.fn();
const mockOrder = jest.fn();
const mockSelect = jest.fn(() => ({ order: mockOrder }));
const mockFrom = jest.fn(() => ({ select: mockSelect }));

jest.mock('@/controllers/useDashboard', () => ({
  useDashboard: jest.fn(() => ({
    estConnecte: true,
  })),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
    auth: {
      getSession: mockGetSession,
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

const { useRespiration } = require('@/controllers/useRespiration');

describe('useRespiration - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-1' },
        },
      },
    });

    mockOrder.mockResolvedValue({
      data: [
        {
          nom_exer: 'Cohérence cardiaque',
          duree_inspiration_defaut_exer: 4,
          duree_apnee_defaut_exer: 0,
          duree_expiration_defaut_exer: 6,
        },
      ],
      error: null,
    });
  });

  it('charge les exercices et ajoute l’option personnalisée', async () => {
    // Le controller transforme les exercices Supabase pour l’interface mobile.
    const { result } = renderHook(() => useRespiration());

    await waitFor(() => {
      expect(result.current.chargement).toBe(false);
    });

    expect(result.current.exercices).toHaveLength(2);
    expect(result.current.exercices[0].label).toBe('Cohérence cardiaque');
    expect(result.current.exercices[1].label).toBe('Personnalisé');
  });

  it('démarre une séance de respiration', async () => {
    const { result } = renderHook(() => useRespiration());

    await waitFor(() => {
      expect(result.current.chargement).toBe(false);
    });

    act(() => {
      result.current.demarrer();
    });

    expect(result.current.actif).toBe(true);
    expect(result.current.pause).toBe(false);
    expect(result.current.phase).toBe('inspiration');
    expect(result.current.cyclesRestants).toBe(result.current.nbCycles);
  });

  it('arrête une séance de respiration', async () => {
    const { result } = renderHook(() => useRespiration());

    await waitFor(() => {
      expect(result.current.chargement).toBe(false);
    });

    act(() => {
      result.current.demarrer();
      result.current.arreter();
    });

    expect(result.current.actif).toBe(false);
    expect(result.current.phase).toBe('inspiration');
  });
});
