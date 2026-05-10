// 👉 Type simple pour accepter tableau, objet ou null, comme les réponses Supabase.
type MockData = unknown[] | Record<string, unknown> | null;

// 👉 Crée une fausse réponse Supabase que l'on peut chaîner comme une vraie requête.
const createSupabaseChain = (data: MockData, error: unknown = null): any => {
  const response = { data, error };
  const promise = Promise.resolve(response);

  const chain: any = {};

  chain.then = promise.then.bind(promise);
  chain.catch = promise.catch.bind(promise);
  chain.finally = promise.finally.bind(promise);

  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.order = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve(response));

  return chain;
};

// 👉 Mock principal de Supabase pour remplacer la vraie base dans les tests.
export const supabaseMock: any = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getUser: jest.fn(),
  },
  from: jest.fn(),
};

// 👉 Remet les mocks à zéro avant chaque test pour éviter les effets de bord.
export const resetSupabaseMock = () => {
  jest.clearAllMocks();
};

// 👉 Simule un SELECT simple qui retourne une liste de données.
export const mockSelectAll = (data: MockData) => {
  supabaseMock.from = jest.fn(() => ({
    select: jest.fn(() => createSupabaseChain(data)),
  }));
};

// 👉 Simule un SELECT avec un filtre eq, avec ou sans single selon le model.
export const mockSelectByEq = (data: MockData) => {
  supabaseMock.from = jest.fn(() => ({
    select: jest.fn(() => createSupabaseChain(data)),
  }));
};

// 👉 Simule un SELECT avec deux filtres eq, par exemple utilisateur + ressource.
export const mockSelectByTwoEq = (data: MockData) => {
  supabaseMock.from = jest.fn(() => ({
    select: jest.fn(() => createSupabaseChain(data)),
  }));
};

// 👉 Simule un INSERT qui retourne les données créées.
export const mockInsert = (data: MockData) => {
  supabaseMock.from = jest.fn(() => ({
    insert: jest.fn(() => createSupabaseChain(data)),
  }));
};

// 👉 Simule un INSERT qui retourne un seul élément créé.
export const mockInsertSingle = (data: MockData) => {
  supabaseMock.from = jest.fn(() => ({
    insert: jest.fn(() => createSupabaseChain(data)),
  }));
};

// 👉 Simule un UPSERT, utilisé quand on crée ou modifie avec la même fonction.
export const mockUpsert = (data: MockData) => {
  supabaseMock.from = jest.fn(() => ({
    upsert: jest.fn(() => createSupabaseChain(data)),
  }));
};

// 👉 Simule un UPDATE qui retourne les données modifiées.
export const mockUpdate = (data: MockData) => {
  supabaseMock.from = jest.fn(() => ({
    update: jest.fn(() => createSupabaseChain(data)),
  }));
};

// 👉 Simule un UPDATE avec deux filtres eq.
export const mockUpdateTwoEq = (data: MockData) => {
  supabaseMock.from = jest.fn(() => ({
    update: jest.fn(() => createSupabaseChain(data)),
  }));
};

// 👉 Simule un UPDATE sans select, utilisé quand la fonction retourne seulement true ou false.
export const mockUpdateNoSelect = (_data: MockData) => {
  supabaseMock.from = jest.fn(() => ({
    update: jest.fn(() => createSupabaseChain(null)),
  }));
};

// 👉 Simule un DELETE simple qui réussit sans retourner de données.
export const mockDelete = () => {
  supabaseMock.from = jest.fn(() => ({
    delete: jest.fn(() => createSupabaseChain(null)),
  }));
};

// 👉 Simule un DELETE avec deux filtres eq.
export const mockDeleteTwoEq = () => {
  supabaseMock.from = jest.fn(() => ({
    delete: jest.fn(() => createSupabaseChain(null)),
  }));
};

// 👉 Simule un DELETE qui retourne les données supprimées.
export const mockDeleteSelect = (data: MockData) => {
  supabaseMock.from = jest.fn(() => ({
    delete: jest.fn(() => createSupabaseChain(data)),
  }));
};

// 👉 Simule un SELECT avec un tri order.
export const mockOrder = (data: MockData) => {
  supabaseMock.from = jest.fn(() => ({
    select: jest.fn(() => createSupabaseChain(data)),
  }));
};
