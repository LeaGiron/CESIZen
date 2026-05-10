const mockSingle = jest.fn();
const mockEqSingle = jest.fn(() => ({ single: mockSingle }));

const mockOrder = jest.fn();
const mockSelectForList = jest.fn(() => ({ order: mockOrder }));

const mockInsertSingle = jest.fn();
const mockInsertSelect = jest.fn(() => ({ single: mockInsertSingle }));
const mockInsert = jest.fn(() => ({ select: mockInsertSelect }));

const mockUpdateSelect = jest.fn();
const mockUpdateEq = jest.fn(() => ({ select: mockUpdateSelect }));
const mockUpdate = jest.fn(() => ({ eq: mockUpdateEq }));

const mockDeleteSelect = jest.fn();
const mockDeleteEq = jest.fn(() => ({ select: mockDeleteSelect }));
const mockDelete = jest.fn(() => ({ eq: mockDeleteEq }));

const mockFrom = jest.fn((table) => {
  if (table === 'utilisateur') {
    return {
      select: jest.fn(() => ({ eq: mockEqSingle })),
    };
  }

  return {
    select: mockSelectForList,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  };
});

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
  },
}));

const {
  getRoleUtilisateur,
  getAllRessources,
  insertRessource,
  updateRessource,
  deleteRessource,
} = require('@/models/admin_ressources.model');

describe('admin_ressources.model - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('récupère le rôle d’un utilisateur', async () => {
    // On vérifie que le model lit bien la table utilisateur pour connaître le rôle.
    mockSingle.mockResolvedValue({
      data: { type_util: 'Administrateur' },
      error: null,
    });

    const role = await getRoleUtilisateur('admin-1');

    expect(mockFrom).toHaveBeenCalledWith('utilisateur');
    expect(mockEqSingle).toHaveBeenCalledWith('id_util', 'admin-1');
    expect(role).toBe('Administrateur');
  });

  it('retourne null si le rôle ne peut pas être récupéré', async () => {
    // En cas d’erreur Supabase, le model reste propre : il retourne null.
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: 'Erreur rôle' },
    });

    const role = await getRoleUtilisateur('admin-1');

    expect(role).toBeNull();
  });

  it('liste les ressources admin', async () => {
    mockOrder.mockResolvedValue({
      data: [{ id_ress: 1, titre_ress: 'Ressource admin' }],
      error: null,
    });

    const ressources = await getAllRessources();

    expect(mockFrom).toHaveBeenCalledWith('ressource');
    expect(mockOrder).toHaveBeenCalledWith('id_ress', { ascending: false });
    expect(ressources).toHaveLength(1);
  });

  it('insère une nouvelle ressource', async () => {
    const form = {
      titre_ress: 'Titre',
      contenu_ress: 'Contenu',
      categorie_ress: 'Stress',
      statut_ress: 'publie',
    };

    mockInsertSingle.mockResolvedValue({
      data: { id_ress: 1, ...form },
      error: null,
    });

    const result = await insertRessource(form);

    expect(mockInsert).toHaveBeenCalledWith([form]);
    expect(result.titre_ress).toBe('Titre');
  });

  it('retourne true si la modification touche une ressource', async () => {
    mockUpdateSelect.mockResolvedValue({
      data: [{ id_ress: 1 }],
      error: null,
    });

    const result = await updateRessource(1, {
      titre_ress: 'Titre modifié',
      contenu_ress: 'Contenu',
      categorie_ress: 'Stress',
      statut_ress: 'publie',
    });

    expect(mockUpdateEq).toHaveBeenCalledWith('id_ress', 1);
    expect(result).toBe(true);
  });

  it('retourne true si la suppression touche une ressource', async () => {
    mockDeleteSelect.mockResolvedValue({
      data: [{ id_ress: 1 }],
      error: null,
    });

    const result = await deleteRessource(1);

    expect(mockDeleteEq).toHaveBeenCalledWith('id_ress', 1);
    expect(result).toBe(true);
  });
});
