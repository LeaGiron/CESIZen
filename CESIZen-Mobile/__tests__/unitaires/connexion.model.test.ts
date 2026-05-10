const { ConnexionModel } = require('@/models/connexion.model');

describe('ConnexionModel - tests unitaires', () => {
  it('contient les champs de saisie du formulaire de connexion', () => {
    // On teste uniquement les placeholders du formulaire.
    expect(ConnexionModel.inputs.email).toBeDefined();
    expect(ConnexionModel.inputs.password).toBeDefined();
  });

  it('contient les actions principales de connexion', () => {
    // Le model doit toujours fournir le texte du bouton et le lien mot de passe oublié.
    expect(ConnexionModel.labels.valider).toBeDefined();
    expect(ConnexionModel.labels.mdpOublie).toBeDefined();
  });
});
