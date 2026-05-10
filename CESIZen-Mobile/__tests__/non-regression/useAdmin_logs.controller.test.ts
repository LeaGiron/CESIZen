const { act, renderHook, waitFor } = require('@testing-library/react-native');

const mockLimit = jest.fn();
const mockOrder = jest.fn(() => ({ limit: mockLimit }));
const mockSelect = jest.fn(() => ({ order: mockOrder }));

const mockFrom = jest.fn(() => ({
  select: mockSelect,
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
    auth: {
      getUser: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

const { useAdminLogs } = require('@/controllers/useAdmin_logs');

describe('useAdminLogs - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockLimit.mockResolvedValue({
      data: [
        {
          id_log: '1',
          type_action_log: 'connexion',
          date_action_log: '2026-05-03',
          statut_log: 'succès',
          id_util: 'u1',
          utilisateur: {
            prenom_util: 'Léa',
            nom_util: 'Test',
            email_util: 'lea@test.fr',
          },
        },
      ],
      error: null,
    });
  });

  it('récupère les logs depuis Supabase', async () => {
    // Le hook charge les logs automatiquement.
    const { result } = renderHook(() => useAdminLogs());

    await waitFor(() => {
      expect(result.current.logs).toHaveLength(1);
    });

    expect(mockFrom).toHaveBeenCalledWith('log_activite');
    expect(result.current.total).toBe(1);
    expect(result.current.chargement).toBe(false);
  });

  it('filtre les logs avec la recherche', async () => {
    const { result } = renderHook(() => useAdminLogs());

    await waitFor(() => {
      expect(result.current.logs).toHaveLength(1);
    });

    act(() => {
      result.current.setRecherche('lea@test.fr');
    });

    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0].utilisateur.email_util).toBe('lea@test.fr');
  });
});
