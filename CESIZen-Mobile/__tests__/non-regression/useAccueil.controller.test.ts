const { useAccueilController } = require('@/controllers/useAccueil');

jest.mock('@/models/accueil.model', () => ({
  AccueilModel: {
    description: 'Application de bien-être',
    labels: ['Respiration', 'Ressources'],
  },
}));

describe('useAccueilController - tests de non-régression', () => {
  it('retourne la description et les labels de la page accueil', () => {
    // Test simple : le controller doit exposer les infos prévues pour l'accueil.
    const result = useAccueilController();

    expect(result.description).toBe('Application de bien-être');
    expect(result.labels).toEqual(['Respiration', 'Ressources']);
  });
});
