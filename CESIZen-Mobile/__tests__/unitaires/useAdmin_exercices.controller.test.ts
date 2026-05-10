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
  },
}));

const { useAdminExercices } = require('@/controllers/useAdmin_exercices');

describe('useAdminExercices - tests unitaires', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockOrder.mockResolvedValue({
      data: [
        {
          id_exer: '1',
          nom_exer: 'Respiration calme',
          description_exer: 'Exercice simple',
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

  afterEach(() => {
    jest.useRealTimers();
  });

  it('charge les exercices au démarrage', async () => {
    // On vérifie l’appel de chargement initial du hook.
    const { result } = renderHook(() => useAdminExercices());

    await waitFor(() => {
      expect(result.current.chargement).toBe(false);
    });

    expect(result.current.exercices).toHaveLength(1);
  });

  it('refuse un formulaire sans nom', async () => {
    // Ici on teste une validation simple du formulaire.
    const { result } = renderHook(() => useAdminExercices());

    await act(async () => {
      await result.current.validerFormulaire();
    });

    expect(result.current.message).toBe('⚠️ Nom requis');
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('prépare un exercice pour modification', () => {
    // Ce test vérifie que le formulaire se remplit avec l’exercice choisi.
    const { result } = renderHook(() => useAdminExercices());

    act(() => {
      result.current.preparerModification({
        id_exer: '10',
        nom_exer: 'Box breathing',
        description_exer: 'Respiration carrée',
        duree_inspiration_defaut_exer: 4,
        duree_apnee_defaut_exer: 4,
        duree_expiration_defaut_exer: 4,
      });
    });

    expect(result.current.idEnCoursEdition).toBe('10');
    expect(result.current.form.nom_exer).toBe('Box breathing');
  });
});
