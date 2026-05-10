const mockSingle = jest.fn<any, any>();

const mockEq = jest.fn<any, any>(() => ({
  single: mockSingle,
}));

const mockSelect = jest.fn<any, any>(() => ({
  eq: mockEq,
}));

const mockInsertSelect = jest.fn<any, any>();
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

const mockDeleteEq = jest.fn<any, any>();
const mockDelete = jest.fn<any, any>(() => ({
  eq: mockDeleteEq,
}));

const mockFrom = jest.fn<any, any>(() => ({
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
  delete: mockDelete,
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
  },
}));

const {
  listerToutesLesRessources,
  getRessourceById,
  createRessource,
  updateRessource,
  deleteRessource,
} = require('@/models/ressource.model');

describe('ressource.model - tests unitaires', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Par défaut, select() permet la chaîne select().eq().single().
    mockSelect.mockReturnValue({
      eq: mockEq,
    });
  });

  it('liste les ressources', async () => {
    // On teste uniquement la fonction de lecture globale.
    mockSelect.mockResolvedValueOnce({
      data: [{ id_ress: '1', titre_ress: 'Stress' }],
      error: null,
    });

    const result = await listerToutesLesRessources();

    expect(mockFrom).toHaveBeenCalledWith('ressource');
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
  });

  it('récupère une ressource par id', async () => {
    // On teste la chaîne Supabase select().eq().single().
    mockSingle.mockResolvedValue({
      data: { id_ress: '10', titre_ress: 'Sommeil' },
      error: null,
    });

    const result = await getRessourceById('10');

    expect(mockEq).toHaveBeenCalledWith('id_ress', '10');
    expect(result.titre_ress).toBe('Sommeil');
  });

  it('crée une ressource', async () => {
    // On teste uniquement l’appel insert.
    const nouvelleRessource = { titre_ress: 'Nouvelle ressource' };

    mockInsertSelect.mockResolvedValue({
      data: [nouvelleRessource],
      error: null,
    });

    const result = await createRessource(nouvelleRessource);

    expect(mockInsert).toHaveBeenCalledWith([nouvelleRessource]);
    expect(result).toEqual([nouvelleRessource]);
  });

  it('modifie une ressource', async () => {
    // On teste uniquement l’appel update sur l’id demandé.
    mockUpdateSelect.mockResolvedValue({
      data: [{ id_ress: '1', titre_ress: 'Titre modifié' }],
      error: null,
    });

    const result = await updateRessource('1', {
      titre_ress: 'Titre modifié',
    });

    expect(mockUpdate).toHaveBeenCalledWith({
      titre_ress: 'Titre modifié',
    });
    expect(mockUpdateEq).toHaveBeenCalledWith('id_ress', '1');
    expect(result[0].titre_ress).toBe('Titre modifié');
  });

  it('supprime une ressource', async () => {
    // On teste uniquement l’appel delete.
    mockDeleteEq.mockResolvedValue({
      data: [],
      error: null,
    });

    await deleteRessource('1');

    expect(mockDelete).toHaveBeenCalled();
    expect(mockDeleteEq).toHaveBeenCalledWith('id_ress', '1');
  });
});
