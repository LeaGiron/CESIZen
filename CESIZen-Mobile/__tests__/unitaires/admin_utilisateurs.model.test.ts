const mockOrder = jest.fn<any, any>();
const mockSelect = jest.fn<any, any>(() => ({
  order: mockOrder,
}));

const mockUpdateEq = jest.fn<any, any>();
const mockUpdate = jest.fn<any, any>(() => ({
  eq: mockUpdateEq,
}));

const mockFrom = jest.fn<any, any>(() => ({
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

describe('admin_utilisateurs.model - tests unitaires', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('liste les utilisateurs', async () => {
    // Test ciblé : vérifier la récupération des utilisateurs.
    mockOrder.mockResolvedValue({
      data: [{ id_util: 'u1', email_util: 'lea@test.fr' }],
      error: null,
    });

    const result = await getAllUtilisateurs();

    expect(mockFrom).toHaveBeenCalledWith('utilisateur');
    expect(result).toHaveLength(1);
  });

  it('modifie un utilisateur', async () => {
    // Test ciblé : vérifier les champs réellement envoyés à Supabase.
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

  it('déverrouille un utilisateur', async () => {
    // Test ciblé : vérifier la remise à zéro du verrouillage.
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
