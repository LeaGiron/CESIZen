import { inscription, connexion, insererLog } from "../../controllers/auth.controller";
import { createBrowserClient } from "@supabase/ssr";

jest.mock("@supabase/ssr", () => ({
  createBrowserClient: jest.fn(),
}));

const creerSupabaseMock = () => {
  const insert = jest.fn().mockResolvedValue({ error: null });
  const upsert = jest.fn().mockResolvedValue({ error: null });
  const eq = jest.fn().mockResolvedValue({ error: null });
  const update = jest.fn(() => ({ eq }));

  return {
    auth: {
      signUp: jest.fn().mockResolvedValue({ data: { user: { id: "u1" } }, error: null }),
      signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: "u1" } }, error: null }),
    },
    from: jest.fn((table: string) => ({
      insert,
      upsert,
      update,
    })),
    __mocks: { insert, upsert, update, eq },
  };
};

describe("auth.controller - tests unitaires", () => {
  beforeEach(() => jest.clearAllMocks());

  test("insererLog doit ajouter un log dans Supabase", async () => {
    // Ici, Supabase est un mock : aucun vrai appel réseau n'est fait.
    const supabase = creerSupabaseMock();

    await insererLog(supabase, "connexion", "succès", "u1");

    expect(supabase.from).toHaveBeenCalledWith("log_activite");
    expect(supabase.__mocks.insert).toHaveBeenCalledWith({
      type_action_log: "connexion",
      statut_log: "succès",
      id_util: "u1",
    });
  });

  test("inscription doit refuser un mot de passe trop faible", async () => {
    // Le controller protège l'inscription avant même d'appeler Supabase.
    await expect(inscription("lea@mail.com", "abc", "Doe", "Léa"))
      .rejects
      .toThrow("Il manque à votre mot de passe");
  });

  test("inscription doit créer le compte avec un email normalisé", async () => {
    // On vérifie que l'email est trim + lowercase avant l'envoi.
    const supabase = creerSupabaseMock();
    (createBrowserClient as jest.Mock).mockReturnValue(supabase);

    const resultat = await inscription("  LEA@MAIL.COM  ", "Motdepasse123!", "Doe", "Léa");

    expect(resultat.success).toBe(true);
    expect(supabase.auth.signUp).toHaveBeenCalledWith(expect.objectContaining({
      email: "lea@mail.com",
      password: "Motdepasse123!",
    }));
  });

  test("connexion doit créer un log d'échec si l'authentification échoue", async () => {
    // Même en cas d'erreur, on garde une trace dans les logs.
    const supabase = creerSupabaseMock();
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: new Error("Identifiants incorrects"),
    });
    (createBrowserClient as jest.Mock).mockReturnValue(supabase);

    await expect(connexion("lea@mail.com", "mauvais-mdp")).rejects.toThrow("Identifiants incorrects");

    expect(supabase.__mocks.insert).toHaveBeenCalledWith({
      type_action_log: "erreur_authentification",
      statut_log: "échec",
      id_util: null,
    });
  });
});
