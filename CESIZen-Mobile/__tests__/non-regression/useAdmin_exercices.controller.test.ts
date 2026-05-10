const { act, renderHook, waitFor } = require('@testing-library/react-native');

const mockOrder = jest.fn();
const mockSelect = jest.fn(() => ({ order: mockOrder }));
const mockInsert = jest.fn();
const mockEq = jest.fn();
const mockUpdate = jest.fn(() => ({ eq: mockEq }));
const mockDelete = jest.fn(() => ({ eq: mockEq }));

const mockFrom = jest.fn(() => ({
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
  delete: mockDelete,
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

const { useAdminExercices } = require('@/controllers/useAdmin_exercices');

describe('useAdminExercices - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockOrder.mockResolvedValue({
      data: [
        {
          id_exer: '1',
          nom_exer: 'Cohérence cardiaque',
          description_exer: 'Respiration calme',
          duree_inspiration_defaut_exer: 4,
          duree_apnee_defaut_exer: 0,
          duree_expiration_defaut_exer: 6,
        },
      ],
      error: null,
    });

    mockInsert.mockResolvedValue({ error: null });
    mockEq.mockResolvedValue({ error: null });
  });

  it('charge la liste des exercices de respiration', async () => {
    // Au montage du hook, les exercices sont récupérés depuis Supabase.
    const { result } = renderHook(() => useAdminExercices());

    await waitFor(() => {
      expect(result.current.chargement).toBe(false);
    });

    expect(mockFrom).toHaveBeenCalledWith('exercice_respiration');
    expect(result.current.exercices).toHaveLength(1);
  });

  it('refuse un formulaire sans nom', async () => {
    const { result } = renderHook(() => useAdminExercices());

    await act(async () => {
      await result.current.validerFormulaire();
    });

    expect(result.current.message).toBe('⚠️ Nom requis');
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('prépare un exercice pour modification', () => {
    const { result } = renderHook(() => useAdminExercices());

    act(() => {
      result.current.preparerModification({
        id_exer: '1',
        nom_exer: 'Box breathing',
        description_exer: 'Exercice en carré',
        duree_inspiration_defaut_exer: 4,
        duree_apnee_defaut_exer: 4,
        duree_expiration_defaut_exer: 4,
      });
    });

    expect(result.current.idEnCoursEdition).toBe('1');
    expect(result.current.form.nom_exer).toBe('Box breathing');
  });
});
