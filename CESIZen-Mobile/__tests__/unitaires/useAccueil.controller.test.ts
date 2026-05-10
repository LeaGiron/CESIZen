const { useAccueilController } = require('@/controllers/useAccueil');

jest.mock('@/models/accueil.model', () => ({
  AccueilModel: {
    description: 'Application mobile CESIZen',
    labels: {
      connexion: 'Se connecter',
      inscription: 'Créer un compte',
      invite: 'Continuer sans compte',
    },
  },
}));

describe('useAccueilController - tests unitaires', () => {
  it('retourne les données du model accueil', () => {
    // Test unitaire très simple :
    // on vérifie que le controller renvoie bien les informations de l'accueil.
    const result = useAccueilController();

    expect(result.description).toBe('Application mobile CESIZen');
    expect(result.labels.connexion).toBe('Se connecter');
  });
});
