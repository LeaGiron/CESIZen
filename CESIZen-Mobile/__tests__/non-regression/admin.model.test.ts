import type { RessourceAdmin, NouvelleRessource } from '@/models/admin.model';

describe('admin.model - tests de non-régression', () => {
  it('respecte la structure attendue pour une ressource admin', () => {
    // Ce model contient surtout des types TypeScript.
    // Le test sert donc à garder un exemple clair de la structure attendue.
    const ressource: RessourceAdmin = {
      id: 1,
      titre: 'Ressource admin',
      categorie: 'Stress',
    };

    expect(ressource.id).toBe(1);
    expect(ressource.titre).toBe('Ressource admin');
    expect(ressource.categorie).toBe('Stress');
  });

  it('respecte la structure attendue pour une nouvelle ressource', () => {
    const nouvelleRessource: NouvelleRessource = {
      titre: 'Nouvelle ressource',
      categorie: 'Sommeil',
    };

    expect(nouvelleRessource).toEqual({
      titre: 'Nouvelle ressource',
      categorie: 'Sommeil',
    });
  });
});
