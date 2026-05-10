import { supabaseMock, resetSupabaseMock, mockSelectAll } from "../mocks/supabase.mock";
import { getAllRessources } from "../../models/ressource.model";

jest.mock("../../lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("ressource.model - tests de non-régression", () => {
  beforeEach(() => resetSupabaseMock());

  test("la lecture de la liste doit garder un format stable", async () => {
    // Ce test évite qu'une modification casse le retour principal du model.
    const liste = [{ id_ress: "1" }];
    mockSelectAll(liste);

    await expect(getAllRessources()).resolves.toEqual(liste);
  });
});
