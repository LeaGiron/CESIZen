const mockSingle = jest.fn();
const mockEqSingle = jest.fn(() => ({ single: mockSingle }));

const mockEq = jest.fn();
const mockSelect = jest.fn(() => ({
  eq: mockEq,
}));

const mockInsertSelect = jest.fn();
const mockInsert = jest.fn(() => ({
  select: mockInsertSelect,
}));

const mockFrom = jest.fn(() => ({
  select: mockSelect,
  insert: mockInsert,
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
  },
}));

const {
  getLogActiviteById,
  getLogActiviteByCategorie,
  getAllLogActivite,
  getLogActiviteByUtilisateur,
  createLogActivite,
} = require('@/models/log_activite.model');

describe('log_activite.model - tests de non-régression', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('récupère un log par son identifiant', async () => {
    // Ce test vérifie la recherche d’un log précis.
    mockSelect.mockReturnValueOnce({ eq: mockEqSingle });
    mockSingle.mockResolvedValue({
      data: { id_log: 'log-1', type_action_log: 'connexion' },
      error: null,
    });

    const result = await getLogActiviteById('log-1');

    expect(mockFrom).toHaveBeenCalledWith('log_activite');
    expect(mockEqSingle).toHaveBeenCalledWith('id_log', 'log-1');
    expect(result.id_log).toBe('log-1');
  });

  it('récupère les logs par catégorie', async () => {
    mockEq.mockResolvedValue({
      data: [{ id_log: 'log-2', type_action_log: 'connexion' }],
      error: null,
    });

    const result = await getLogActiviteByCategorie('connexion');

    expect(mockEq).toHaveBeenCalledWith('type_action_log', 'connexion');
    expect(result).toHaveLength(1);
  });

  it('récupère tous les logs', async () => {
    mockSelect.mockResolvedValueOnce({
      data: [{ id_log: 'log-1' }, { id_log: 'log-2' }],
      error: null,
    });

    const result = await getAllLogActivite();

    expect(result).toHaveLength(2);
  });

  it('récupère les logs d’un utilisateur', async () => {
    mockEq.mockResolvedValue({
      data: [{ id_log: 'log-3', id_util: 'u1' }],
      error: null,
    });

    const result = await getLogActiviteByUtilisateur('u1');

    expect(mockEq).toHaveBeenCalledWith('id_util', 'u1');
    expect(result[0].id_util).toBe('u1');
  });

  it('crée un log d’activité', async () => {
    const log = {
      type_action_log: 'connexion',
      ip_adresse_log: null,
      statut_log: 'succès',
      id_util: 'u1',
    };

    mockInsertSelect.mockResolvedValue({
      data: [{ id_log: 'log-4', ...log }],
      error: null,
    });

    const result = await createLogActivite(log);

    expect(mockInsert).toHaveBeenCalledWith(log);
    expect(result[0].id_log).toBe('log-4');
  });
});
