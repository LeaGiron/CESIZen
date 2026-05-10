import { supabaseMock, resetSupabaseMock, mockSelectAll } from "../mocks/supabase.mock";
import { getAllUtilisateurs } from "../../models/utilisateur.model";

jest.mock("../../lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("utilisateur.model - tests de non-régression", () => {
  beforeEach(() => resetSupabaseMock());

  test("la lecture de la liste doit garder un format stable", async () => {
    // Ce test évite qu'une modification casse le retour principal du model.
    const liste = [{ id_util: "1" }];
    mockSelectAll(liste);

    await expect(getAllUtilisateurs()).resolves.toEqual(liste);
  });
});
