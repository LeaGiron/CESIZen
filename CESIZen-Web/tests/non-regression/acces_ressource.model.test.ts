import { supabaseMock, resetSupabaseMock, mockSelectAll } from "../mocks/supabase.mock";
import { getAllAccesRessource } from "../../models/acces_ressource.model";

jest.mock("../../lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("acces_ressource.model - tests de non-régression", () => {
  beforeEach(() => resetSupabaseMock());

  test("la liste des accès doit rester stable", async () => {
    // On protège le retour attendu pour éviter une régression sur ce model.
    const acces = [{ id_acc: "acc-1", id_util: "u1", id_ress: "r1" }];
    mockSelectAll(acces);

    await expect(getAllAccesRessource()).resolves.toEqual(acces);
  });
});
