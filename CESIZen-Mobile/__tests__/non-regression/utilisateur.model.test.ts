import type {
  Utilisateur,
  ConnexionPayload,
  InscriptionPayload,
} from '@/models/utilisateur.model';

describe('utilisateur.model - tests de non-régression', () => {
  it('respecte la structure d’un utilisateur connecté', () => {
    // Ce model définit des types. On garde ici un exemple concret,
    // facile à expliquer à l’oral, pour montrer la forme attendue.
    const utilisateur: Utilisateur = {
      token: 'token-test',
      prenom_util: 'Léa',
      nom_util: 'Dupont',
      email_util: 'lea@test.fr',
    };

    expect(utilisateur.email_util).toBe('lea@test.fr');
    expect(utilisateur.token).toBe('token-test');
  });

  it('respecte la structure des données de connexion', () => {
    const payload: ConnexionPayload = {
      email_util: 'lea@test.fr',
      mot_de_passe_util: 'Motdepasse123!',
    };

    expect(payload.email_util).toContain('@');
  });

  it('respecte la structure des données d’inscription', () => {
    const payload: InscriptionPayload = {
      nom_util: 'Dupont',
      prenom_util: 'Léa',
      email_util: 'lea@test.fr',
      mot_de_passe_util: 'Motdepasse123!',
    };

    expect(payload.prenom_util).toBe('Léa');
    expect(payload.mot_de_passe_util.length).toBeGreaterThan(8);
  });
});
