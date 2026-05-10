const mockSingle = jest.fn<any, any>();
const mockEqSingle = jest.fn<any, any>(() => ({
  single: mockSingle,
}));

const mockOrder = jest.fn<any, any>();
const mockSelectForList = jest.fn<any, any>(() => ({
  order: mockOrder,
}));

const mockInsertSingle = jest.fn<any, any>();
const mockInsertSelect = jest.fn<any, any>(() => ({
  single: mockInsertSingle,
}));
const mockInsert = jest.fn<any, any>(() => ({
  select: mockInsertSelect,
}));

const mockUpdateSelect = jest.fn<any, any>();
const mockUpdateEq = jest.fn<any, any>(() => ({
  select: mockUpdateSelect,
}));
const mockUpdate = jest.fn<any, any>(() => ({
  eq: mockUpdateEq,
}));

const mockDeleteSelect = jest.fn<any, any>();
const mockDeleteEq = jest.fn<any, any>(() => ({
  select: mockDeleteSelect,
}));
const mockDelete = jest.fn<any, any>(() => ({
  eq: mockDeleteEq,
}));

const mockFrom = jest.fn<any, any>((table: string) => {
  if (table === 'utilisateur') {
    return {
      select: jest.fn(() => ({
        eq: mockEqSingle,
      })),
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

describe('admin_ressources.model - tests unitaires', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('récupère le rôle d’un utilisateur', async () => {
    // Test ciblé : vérifier que le model sait lire le rôle.
    mockSingle.mockResolvedValue({
      data: { type_util: 'Administrateur' },
      error: null,
    });

    const role = await getRoleUtilisateur('admin-1');

    expect(mockFrom).toHaveBeenCalledWith('utilisateur');
    expect(mockEqSingle).toHaveBeenCalledWith('id_util', 'admin-1');
    expect(role).toBe('Administrateur');
  });

  it('liste toutes les ressources admin', async () => {
    // Test ciblé : vérifier la lecture des ressources côté admin.
    mockOrder.mockResolvedValue({
      data: [{ id_ress: '1', titre_ress: 'Ressource test' }],
      error: null,
    });

    const result = await getAllRessources();

    expect(mockFrom).toHaveBeenCalledWith('ressource');
    expect(result).toHaveLength(1);
  });

  it('insère une ressource admin', async () => {
    // Test ciblé : vérifier l’insert.
    const form = {
      titre_ress: 'Titre',
      contenu_ress: 'Contenu',
      categorie_ress: 'Stress',
      statut_ress: 'publie',
    };

    mockInsertSingle.mockResolvedValue({
      data: { id_ress: '1', ...form },
      error: null,
    });

    const result = await insertRessource(form);

    expect(mockInsert).toHaveBeenCalledWith([form]);
    expect(result.titre_ress).toBe('Titre');
  });

  it('modifie une ressource admin', async () => {
    // Test ciblé : vérifier l’update.
    mockUpdateSelect.mockResolvedValue({
      data: [{ id_ress: '1' }],
      error: null,
    });

    const result = await updateRessource('1', {
      titre_ress: 'Titre modifié',
      contenu_ress: 'Contenu',
      categorie_ress: 'Stress',
      statut_ress: 'publie',
    });

    expect(mockUpdateEq).toHaveBeenCalledWith('id_ress', '1');
    expect(result).toBe(true);
  });

  it('supprime une ressource admin', async () => {
    // Test ciblé : vérifier le delete.
    mockDeleteSelect.mockResolvedValue({
      data: [{ id_ress: '1' }],
      error: null,
    });

    const result = await deleteRessource('1');

    expect(mockDeleteEq).toHaveBeenCalledWith('id_ress', '1');
    expect(result).toBe(true);
  });
});
