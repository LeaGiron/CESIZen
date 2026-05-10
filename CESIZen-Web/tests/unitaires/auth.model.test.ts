import { supabaseMock, resetSupabaseMock } from "../mocks/supabase.mock";
import { verifierIdentifiants, creerCompte, deconnecterCompte } from "../../models/auth.model";

jest.mock("../../lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("auth.model - tests unitaires", () => {
  beforeEach(() => resetSupabaseMock());

  test("doit connecter un utilisateur avec email et mot de passe", async () => {
    // On simule Supabase pour vérifier uniquement notre fonction de connexion.
    supabaseMock.auth.signInWithPassword.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });

    const result = await verifierIdentifiants("lea@test.fr", "secret");

    expect(result.user.id).toBe("u1");
    expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({ email: "lea@test.fr", password: "secret" });
  });

  test("doit créer puis déconnecter un compte sans erreur", async () => {
    // Ici on vérifie les deux actions simples du model auth.
    supabaseMock.auth.signUp.mockResolvedValue({ data: { user: { id: "u2" } }, error: null });
    supabaseMock.auth.signOut.mockResolvedValue({ error: null });

    const compte = await creerCompte("new@test.fr", "password");
    await deconnecterCompte();

    expect(compte.user.id).toBe("u2");
    expect(supabaseMock.auth.signOut).toHaveBeenCalled();
  });
});
