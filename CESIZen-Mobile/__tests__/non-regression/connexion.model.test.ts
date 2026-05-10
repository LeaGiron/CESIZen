const { ConnexionModel } = require('@/models/connexion.model');

describe('ConnexionModel - tests de non-régression', () => {
  it('contient les labels et inputs nécessaires à la connexion', () => {
    // Ici on teste le “contrat” du model de connexion :
    // l’écran doit toujours avoir ses textes principaux.
    expect(ConnexionModel.labels.valider).toBe('Se connecter');
    expect(ConnexionModel.labels.mdpOublie).toBe('Mot de passe oublié ?');

    expect(ConnexionModel.inputs.email).toBe('Adresse e-mail');
    expect(ConnexionModel.inputs.password).toBe('Mot de passe');
  });
});
