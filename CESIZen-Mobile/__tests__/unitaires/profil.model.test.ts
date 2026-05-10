const { ProfilLabels } = require('@/models/profil.model');

describe('ProfilLabels - tests unitaires', () => {
  it('contient le titre du profil', () => {
    // Test ciblé sur une constante utilisée par l’écran profil.
    expect(ProfilLabels.titre).toBeDefined();
  });

  it('contient les champs du formulaire profil', () => {
    // Ces champs sont essentiels pour modifier un profil.
    expect(ProfilLabels.inputs.prenom).toBeDefined();
    expect(ProfilLabels.inputs.nom).toBeDefined();
    expect(ProfilLabels.inputs.email).toBeDefined();
  });

  it('contient le message de succès', () => {
    // Ce message est affiché après une modification réussie.
    expect(ProfilLabels.messages.succes).toBeDefined();
  });
});
