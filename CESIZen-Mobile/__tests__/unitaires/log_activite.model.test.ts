const mockSingle = jest.fn<any, any>();
const mockEqSingle = jest.fn<any, any>(() => ({
  single: mockSingle,
}));

const mockEq = jest.fn<any, any>();
const mockSelect = jest.fn<any, any>(() => ({
  eq: mockEq,
}));

const mockInsertSelect = jest.fn<any, any>();
const mockInsert = jest.fn<any, any>(() => ({
  select: mockInsertSelect,
}));

const mockFrom = jest.fn<any, any>(() => ({
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

describe('log_activite.model - tests unitaires', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('récupère un log par id', async () => {
    // Test ciblé : vérifier la lecture d’un log précis.
    mockSelect.mockReturnValueOnce({
      eq: mockEqSingle,
    });

    mockSingle.mockResolvedValue({
      data: { id_log: 'log-1', type_action_log: 'connexion' },
      error: null,
    });

    const result = await getLogActiviteById('log-1');

    expect(mockEqSingle).toHaveBeenCalledWith('id_log', 'log-1');
    expect(result.id_log).toBe('log-1');
  });

  it('récupère les logs par catégorie', async () => {
    // Test ciblé : vérifier le filtre par type d’action.
    mockEq.mockResolvedValue({
      data: [{ id_log: 'log-2', type_action_log: 'connexion' }],
      error: null,
    });

    const result = await getLogActiviteByCategorie('connexion');

    expect(mockEq).toHaveBeenCalledWith('type_action_log', 'connexion');
    expect(result).toHaveLength(1);
  });

  it('récupère tous les logs', async () => {
    // Test ciblé : vérifier la lecture globale.
    mockSelect.mockResolvedValueOnce({
      data: [{ id_log: 'log-1' }],
      error: null,
    });

    const result = await getAllLogActivite();

    expect(result).toHaveLength(1);
  });

  it('récupère les logs d’un utilisateur', async () => {
    // Test ciblé : vérifier le filtre par utilisateur.
    mockEq.mockResolvedValue({
      data: [{ id_log: 'log-3', id_util: 'u1' }],
      error: null,
    });

    const result = await getLogActiviteByUtilisateur('u1');

    expect(mockEq).toHaveBeenCalledWith('id_util', 'u1');
    expect(result[0].id_util).toBe('u1');
  });

  it('crée un log d’activité', async () => {
    // Test ciblé : vérifier l’insertion d’un log.
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
