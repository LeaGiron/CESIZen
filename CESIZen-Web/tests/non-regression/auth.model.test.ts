import { supabaseMock, resetSupabaseMock } from "../mocks/supabase.mock";
import { verifierIdentifiants } from "../../models/auth.model";

jest.mock("../../lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("auth.model - tests de non-régression", () => {
  beforeEach(() => resetSupabaseMock());

  test("la connexion doit toujours retourner les données Supabase en cas de succès", async () => {
    // Ce test protège le comportement validé : une connexion réussie retourne les données.
    supabaseMock.auth.signInWithPassword.mockResolvedValue({ data: { session: "ok" }, error: null });

    await expect(verifierIdentifiants("lea@test.fr", "secret")).resolves.toEqual({ session: "ok" });
  });
});
