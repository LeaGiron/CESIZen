const { act, renderHook, waitFor } = require('@testing-library/react-native');

const mockListerToutesLesRessources = jest.fn();

jest.mock('@/models/ressource.model', () => ({
  listerToutesLesRessources: mockListerToutesLesRessources,
}));

const { useRessources } = require('@/controllers/useRessources');

describe('useRessources - tests unitaires', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockListerToutesLesRessources.mockResolvedValue({
      success: true,
      data: [
        { id_ress: '1', titre_ress: 'Stress', categorie_ress: 'Bien-être', statut_ress: 'publie' },
        { id_ress: '2', titre_ress: 'Sommeil', categorie_ress: 'Repos', statut_ress: 'publie' },
        { id_ress: '3', titre_ress: 'Brouillon', categorie_ress: 'Admin', statut_ress: 'brouillon' },
      ],
    });
  });

  it('garde seulement les ressources publiées', async () => {
    // Ce test vérifie uniquement la règle de filtrage sur le statut.
    const { result } = renderHook(() => useRessources());

    await waitFor(() => {
      expect(result.current.chargement).toBe(false);
    });

    expect(result.current.ressourcesFiltrees).toHaveLength(2);
  });

  it('filtre une ressource par recherche', async () => {
    // On teste une seule action utilisateur : écrire dans la recherche.
    const { result } = renderHook(() => useRessources());

    await waitFor(() => {
      expect(result.current.chargement).toBe(false);
    });

    act(() => {
      result.current.setRecherche('stress');
    });

    expect(result.current.ressourcesFiltrees).toHaveLength(1);
    expect(result.current.ressourcesFiltrees[0].titre_ress).toBe('Stress');
  });
});
