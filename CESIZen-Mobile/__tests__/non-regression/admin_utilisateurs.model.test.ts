const mockOrder = jest.fn();
const mockSelect = jest.fn(() => ({ order: mockOrder }));

const mockUpdateEq = jest.fn();
const mockUpdate = jest.fn(() => ({ eq: mockUpdateEq }));

const mockFrom = jest.fn(() => ({
  select: mockSelect,
  update: mockUpdate,
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
  },
}));

const {
  getAllUtilisateurs,
  updateUtilisateur,
  deverrouillerUtilisateur,
} = require('@/models/admin_utilisateurs.model');

describe('admin_utilisateurs.model - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('liste tous les utilisateurs triés par date de création', async () => {
    // Le model doit demander les utilisateurs du plus récent au plus ancien.
    mockOrder.mockResolvedValue({
      data: [{ id_util: 'u1', email_util: 'lea@test.fr' }],
      error: null,
    });

    const result = await getAllUtilisateurs();

    expect(mockFrom).toHaveBeenCalledWith('utilisateur');
    expect(mockOrder).toHaveBeenCalledWith('date_creation_util', { ascending: false });
    expect(result).toHaveLength(1);
  });

  it('retourne une liste vide en cas d’erreur', async () => {
    mockOrder.mockResolvedValue({
      data: null,
      error: { message: 'Erreur utilisateurs' },
    });

    const result = await getAllUtilisateurs();

    expect(result).toEqual([]);
  });

  it('modifie les informations principales d’un utilisateur', async () => {
    mockUpdateEq.mockResolvedValue({ error: null });

    const result = await updateUtilisateur('u1', {
      nom_util: 'Dupont',
      prenom_util: 'Léa',
      email_util: 'lea@test.fr',
      type_util: 'Administrateur',
      statut_compte_util: 'actif',
    });

    expect(mockUpdate).toHaveBeenCalledWith({
      nom_util: 'Dupont',
      prenom_util: 'Léa',
      type_util: 'Administrateur',
      statut_compte_util: 'actif',
    });
    expect(mockUpdateEq).toHaveBeenCalledWith('id_util', 'u1');
    expect(result).toBe(true);
  });

  it('déverrouille un compte utilisateur', async () => {
    mockUpdateEq.mockResolvedValue({ error: null });

    const result = await deverrouillerUtilisateur('u1');

    expect(mockUpdate).toHaveBeenCalledWith({
      statut_compte_util: 'actif',
      tentatives_connexion_util: 0,
      date_verrouillage_util: null,
    });
    expect(result).toBe(true);
  });
});
