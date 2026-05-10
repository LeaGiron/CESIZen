import { supabaseMock, resetSupabaseMock, mockOrder } from "../mocks/supabase.mock";
import { getAllRessources } from "../../models/admin_ressource.model";

jest.mock("@/lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("admin_ressource.model - tests de non-régression", () => {
  beforeEach(() => resetSupabaseMock());

  test("la liste admin des ressources doit garder un retour stable", async () => {
    // Ce test protège l'affichage admin des ressources après modification du code.
    const ressources = [{ id_ress: 1, titre_ress: "Respiration", statut_ress: "publie" }];
    mockOrder(ressources);

    await expect(getAllRessources()).resolves.toEqual(ressources);
  });
});
