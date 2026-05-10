import type {
  Utilisateur,
  ConnexionPayload,
  InscriptionPayload,
} from '@/models/utilisateur.model';

describe('utilisateur.model - tests unitaires', () => {
  it('décrit correctement un utilisateur connecté', () => {
    // Ce model contient surtout des types : on vérifie un exemple concret.
    const utilisateur: Utilisateur = {
      token: 'token-test',
      prenom_util: 'Léa',
      nom_util: 'Dupont',
      email_util: 'lea@test.fr',
    };

    expect(utilisateur.token).toBe('token-test');
    expect(utilisateur.email_util).toBe('lea@test.fr');
  });

  it('décrit correctement un payload de connexion', () => {
    const payload: ConnexionPayload = {
      email_util: 'lea@test.fr',
      mot_de_passe_util: 'Motdepasse123!',
    };

    expect(payload.email_util).toContain('@');
    expect(payload.mot_de_passe_util.length).toBeGreaterThan(0);
  });

  it('décrit correctement un payload d’inscription', () => {
    const payload: InscriptionPayload = {
      nom_util: 'Dupont',
      prenom_util: 'Léa',
      email_util: 'lea@test.fr',
      mot_de_passe_util: 'Motdepasse123!',
    };

    expect(payload.nom_util).toBe('Dupont');
    expect(payload.prenom_util).toBe('Léa');
  });
});
