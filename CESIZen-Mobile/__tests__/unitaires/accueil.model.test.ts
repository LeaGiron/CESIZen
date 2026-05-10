const { AccueilModel } = require('@/models/accueil.model');

describe('AccueilModel - tests unitaires', () => {
  it('contient une description pour la page d’accueil', () => {
    // Test unitaire simple : on vérifie une donnée précise du model.
    expect(AccueilModel.description).toBeDefined();
    expect(typeof AccueilModel.description).toBe('string');
  });

  it('contient les labels principaux de navigation', () => {
    // Ces labels servent aux boutons de l’accueil.
    expect(AccueilModel.labels.connexion).toBeDefined();
    expect(AccueilModel.labels.inscription).toBeDefined();
    expect(AccueilModel.labels.invite).toBeDefined();
  });
});
