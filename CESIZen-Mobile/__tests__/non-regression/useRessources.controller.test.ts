const { act, renderHook, waitFor } = require('@testing-library/react-native');

const mockListerToutesLesRessources = jest.fn();

jest.mock('@/models/ressource.model', () => ({
  listerToutesLesRessources: mockListerToutesLesRessources,
}));

const { useRessources } = require('@/controllers/useRessources');

describe('useRessources - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockListerToutesLesRessources.mockResolvedValue({
      success: true,
      data: [
        { id_ress: '1', titre_ress: 'Gérer le stress', categorie_ress: 'Stress', statut_ress: 'publie' },
        { id_ress: '2', titre_ress: 'Respiration calme', categorie_ress: 'Respiration', statut_ress: 'publie' },
        { id_ress: '3', titre_ress: 'Brouillon caché', categorie_ress: 'Stress', statut_ress: 'brouillon' },
      ],
    });
  });

  it('charge uniquement les ressources publiées et prépare les catégories', async () => {
    // Le controller appelle le model, puis garde uniquement les ressources publiées.
    const { result } = renderHook(() => useRessources());

    await waitFor(() => {
      expect(result.current.chargement).toBe(false);
    });

    expect(mockListerToutesLesRessources).toHaveBeenCalled();
    expect(result.current.ressourcesFiltrees).toHaveLength(2);
    expect(result.current.categories).toEqual(['Toutes', 'Stress', 'Respiration']);
  });

  it('filtre les ressources avec la barre de recherche', async () => {
    const { result } = renderHook(() => useRessources());

    await waitFor(() => {
      expect(result.current.chargement).toBe(false);
    });

    act(() => {
      result.current.setRecherche('respiration');
    });

    expect(result.current.ressourcesFiltrees).toHaveLength(1);
    expect(result.current.ressourcesFiltrees[0].titre_ress).toBe('Respiration calme');
  });
});
