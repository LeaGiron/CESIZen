import { supabaseMock, resetSupabaseMock, mockOrder } from "../mocks/supabase.mock";
import { getAllUtilisateurs } from "../../models/admin_utilisateur.model";

jest.mock("@/lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("admin_utilisateur.model - tests de non-régression", () => {
  beforeEach(() => resetSupabaseMock());

  test("la liste admin utilisateurs doit rester disponible", async () => {
    // On garde stable le comportement principal du module admin utilisateurs.
    const utilisateurs = [{ id_util: "u1", statut_compte_util: "actif" }];
    mockOrder(utilisateurs);

    await expect(getAllUtilisateurs()).resolves.toEqual(utilisateurs);
  });
});
