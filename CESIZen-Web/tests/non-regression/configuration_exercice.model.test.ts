import { supabaseMock, resetSupabaseMock, mockSelectAll } from "../mocks/supabase.mock";
import { getAllConfigurationExercice } from "../../models/configuration_exercice.model";

jest.mock("../../lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("configuration_exercice.model - tests de non-régression", () => {
  beforeEach(() => resetSupabaseMock());

  test("la lecture de la liste doit garder un format stable", async () => {
    // Ce test évite qu'une modification casse le retour principal du model.
    const liste = [{ id_config: "1" }];
    mockSelectAll(liste);

    await expect(getAllConfigurationExercice()).resolves.toEqual(liste);
  });
});
