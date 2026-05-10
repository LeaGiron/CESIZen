const mockSingle = jest.fn<any, any>();

const mockEq = jest.fn<any, any>(() => ({
  single: mockSingle,
}));

const mockSelect = jest.fn<any, any>(() => ({
  eq: mockEq,
}));

const mockInsertSelect = jest.fn<any, any>();
const mockInsert = jest.fn<any, any>(() => ({ select: mockInsertSelect }));

const mockUpdateSelect = jest.fn<any, any>();
const mockUpdateEq = jest.fn<any, any>(() => ({ select: mockUpdateSelect }));
const mockUpdate = jest.fn<any, any>(() => ({ eq: mockUpdateEq }));

const mockDeleteEq = jest.fn<any, any>();
const mockDelete = jest.fn<any, any>(() => ({ eq: mockDeleteEq }));

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

describe('ressource.model - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelect.mockReset();
    mockSelect.mockReturnValue({
    eq: mockEq,
    });
  });

  it('liste toutes les ressources avec un retour succès', async () => {
    // On simule Supabase pour vérifier que le model retourne bien un objet exploitable.
    mockSelect.mockResolvedValue({
      data: [{ id_ress: '1', titre_ress: 'Stress' }],
      error: null,
    });

    const result = await listerToutesLesRessources();

    expect(mockFrom).toHaveBeenCalledWith('ressource');
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
  });

  it('retourne success false si Supabase renvoie une erreur', async () => {
    // Ici on vérifie le comportement en cas d’erreur :
    // le model ne doit pas faire planter l’écran qui liste les ressources.
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSelect.mockResolvedValue({
      data: null,
      error: { message: 'Erreur SQL' },
    });

    const result = await listerToutesLesRessources();

    expect(result).toEqual({ success: false, data: [] });
  });

  it('récupère une ressource par son identifiant', async () => {
    // Ici on remet le comportement chaînable attendu :
    // select() -> eq() -> single()
    mockSelect.mockReturnValue({
      eq: mockEq,
    });

    mockSingle.mockResolvedValue({
      data: { id_ress: '10', titre_ress: 'Sommeil' },
      error: null,
    });

  const result = await getRessourceById('10');

  expect(mockEq).toHaveBeenCalledWith('id_ress', '10');
  expect(result.titre_ress).toBe('Sommeil');
});

  it('crée une ressource', async () => {
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
    mockUpdateSelect.mockResolvedValue({
      data: [{ id_ress: '1', titre_ress: 'Titre modifié' }],
      error: null,
    });

    const result = await updateRessource('1', { titre_ress: 'Titre modifié' });

    expect(mockUpdate).toHaveBeenCalledWith({ titre_ress: 'Titre modifié' });
    expect(mockUpdateEq).toHaveBeenCalledWith('id_ress', '1');
    expect(result[0].titre_ress).toBe('Titre modifié');
  });

  it('supprime une ressource', async () => {
    mockDeleteEq.mockResolvedValue({
      data: [],
      error: null,
    });

    await deleteRessource('1');

    expect(mockDelete).toHaveBeenCalled();
    expect(mockDeleteEq).toHaveBeenCalledWith('id_ress', '1');
  });
});
