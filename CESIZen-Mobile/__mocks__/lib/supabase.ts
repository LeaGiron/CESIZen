export const mockUser = {
  id: 'user-test-123',
  email: 'lea@test.com',
  user_metadata: { prenom_util: 'Léa', nom_util: 'Dupont' },
};

export const mockSession = {
  access_token: 'fake-token',
  user: mockUser,
};

export const mockProfil = {
  prenom_util: 'Léa',
  nom_util: 'Dupont',
  email_util: 'lea@test.com',
};

const ok = (data: any) => ({ data, error: null });
const err = (msg: string) => ({ data: null, error: { message: msg } });

const makeQuery = (result: any) => {
  const chain: any = {
    select: () => chain,
    insert: () => chain,
    update: () => chain,
    upsert: () => chain,
    delete: () => chain,
    eq: () => chain,
    order: () => chain,
    limit: () => chain,
    single: () => Promise.resolve(result),
  };

  return chain;
};

export const supabase = {
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
    getSession: jest.fn().mockResolvedValue({ data: { session: mockSession }, error: null }),
    signInWithPassword: jest.fn().mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null }),
    signUp: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: jest.fn().mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    }),
  },

  from: jest.fn((table: string) => {
    const defaults: Record<string, any> = {
      utilisateur: ok(mockProfil),
      exercice_respiration: ok([
        { nom_exer: 'Cohérence cardiaque', duree_inspiration_defaut_exer: 5, duree_apnee_defaut_exer: 0, duree_expiration_defaut_exer: 5, id_exer: 'ex-1', description_exer: 'Desc' },
      ]),
      ressource: ok([
        { id_ress: 1, titre_ress: 'Article stress', categorie_ress: 'Stress', statut_ress: 'publie', contenu_ress: 'Contenu', id: 1 },
      ]),
      log_activite: ok([
        { id_log: 'log-1', type_action_log: 'connexion', date_action_log: '2024-01-01T10:00:00', statut_log: 'succès', id_util: 'user-test-123', utilisateur: mockProfil },
      ]),
    };

    const result = defaults[table] ?? ok([]);
    return makeQuery(result);
  }),

  rpc: jest.fn().mockResolvedValue(ok('OK')),
};