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
    },
  },
}));

const { useRespiration } = require('@/controllers/useRespiration');

describe('useRespiration - tests unitaires', () => {
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

  it('charge les exercices et ajoute le mode personnalisé', async () => {
    // Le hook transforme les données Supabase en format utilisable par l’écran.
    const { result } = renderHook(() => useRespiration());

    await waitFor(() => {
      expect(result.current.chargement).toBe(false);
    });

    expect(result.current.exercices[0].label).toBe('Cohérence cardiaque');
    expect(result.current.exercices[1].label).toBe('Personnalisé');
  });

  it('démarre une séance', async () => {
    // Test unitaire d’une action : démarrer.
    const { result } = renderHook(() => useRespiration());

    await waitFor(() => {
      expect(result.current.chargement).toBe(false);
    });

    act(() => {
      result.current.demarrer();
    });

    expect(result.current.actif).toBe(true);
    expect(result.current.phase).toBe('inspiration');
    expect(result.current.cyclesRestants).toBe(result.current.nbCycles);
  });

  it('arrête une séance', async () => {
    // Test unitaire d’une action : arrêter.
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
