const { ProfilLabels } = require('@/models/profil.model');

describe('ProfilLabels - tests de non-régression', () => {
  it('contient les textes importants du profil utilisateur', () => {
    // Le but est simple : vérifier que les textes utilisés dans le profil existent encore.
    // C’est utile pour éviter une régression visuelle ou un bouton sans texte.
    expect(ProfilLabels.titre).toBe('👤 Mon profil');

    expect(ProfilLabels.inputs.prenom).toBe('Prénom');
    expect(ProfilLabels.inputs.nom).toBe('Nom');
    expect(ProfilLabels.inputs.email).toBe('Email');

    expect(ProfilLabels.boutons.sauvegarder).toBe('Enregistrer les modifications');
    expect(ProfilLabels.messages.succes).toBe('✅ Profil mis à jour !');
  });
});
