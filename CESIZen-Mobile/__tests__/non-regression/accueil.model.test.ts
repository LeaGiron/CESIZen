const { AccueilModel } = require('@/models/accueil.model');

describe('AccueilModel - tests de non-régression', () => {
  it('contient les textes principaux de la page d’accueil', () => {
    // Ce test protège les textes affichés sur l’écran d’accueil.
    // Si quelqu’un change ou supprime une clé importante, le test le verra.
    expect(AccueilModel.description).toContain('ressources validées');

    expect(AccueilModel.labels.connexion).toBe('Se connecter');
    expect(AccueilModel.labels.inscription).toBe('Créer un compte');
    expect(AccueilModel.labels.invite).toBe('Continuer sans compte');
  });
});
