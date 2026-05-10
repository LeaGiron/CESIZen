import { supabaseMock, resetSupabaseMock, mockSelectAll } from "../mocks/supabase.mock";
import { getAllReinitialisationMotDePasse } from "../../models/reinitialisation_mot_de_passe.model";

jest.mock("../../lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("reinitialisation_mot_de_passe.model - tests de non-régression", () => {
  beforeEach(() => resetSupabaseMock());

  test("la lecture de la liste doit garder un format stable", async () => {
    // Ce test évite qu'une modification casse le retour principal du model.
    const liste = [{ id_reinit: "1" }];
    mockSelectAll(liste);

    await expect(getAllReinitialisationMotDePasse()).resolves.toEqual(liste);
  });
});
