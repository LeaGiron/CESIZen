const { act, renderHook, waitFor } = require('@testing-library/react-native');

const mockLimit = jest.fn();
const mockOrder = jest.fn(() => ({ limit: mockLimit }));
const mockSelect = jest.fn(() => ({ order: mockOrder }));
const mockFrom = jest.fn(() => ({ select: mockSelect }));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
  },
}));

const { useAdminLogs } = require('@/controllers/useAdmin_logs');

describe('useAdminLogs - tests unitaires', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockLimit.mockResolvedValue({
      data: [
        {
          id_log: '1',
          type_action_log: 'connexion',
          statut_log: 'succès',
          utilisateur: {
            email_util: 'lea@test.fr',
          },
        },
      ],
      error: null,
    });
  });

  it('charge les logs', async () => {
    // On teste uniquement le chargement des logs depuis Supabase.
    const { result } = renderHook(() => useAdminLogs());

    await waitFor(() => {
      expect(result.current.logs).toHaveLength(1);
    });

    expect(mockFrom).toHaveBeenCalledWith('log_activite');
  });

  it('filtre les logs par recherche', async () => {
    // On vérifie que la recherche garde le bon log.
    const { result } = renderHook(() => useAdminLogs());

    await waitFor(() => {
      expect(result.current.logs).toHaveLength(1);
    });

    act(() => {
      result.current.setRecherche('lea@test.fr');
    });

    expect(result.current.logs[0].utilisateur.email_util).toBe('lea@test.fr');
  });
});
