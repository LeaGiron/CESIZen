import type { RessourceAdmin, NouvelleRessource } from '@/models/admin.model';

describe('admin.model - tests unitaires', () => {
  it('décrit correctement une ressource admin', () => {
    // On vérifie la forme minimale d’une ressource côté admin.
    const ressource: RessourceAdmin = {
      id: 1,
      titre: 'Ressource test',
      categorie: 'Stress',
    };

    expect(ressource.id).toBe(1);
    expect(ressource.titre).toBe('Ressource test');
    expect(ressource.categorie).toBe('Stress');
  });

  it('décrit correctement une nouvelle ressource', () => {
    const nouvelleRessource: NouvelleRessource = {
      titre: 'Nouvelle ressource',
      categorie: 'Bien-être',
    };

    expect(nouvelleRessource.titre).toBe('Nouvelle ressource');
    expect(nouvelleRessource.categorie).toBe('Bien-être');
  });
});
