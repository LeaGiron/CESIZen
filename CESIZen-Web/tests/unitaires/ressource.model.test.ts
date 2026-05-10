import { supabaseMock, resetSupabaseMock, mockSelectByEq, mockSelectAll, mockInsert, mockUpdate, mockDelete } from "../mocks/supabase.mock";
import { getRessourceById, getAllRessources, createRessource, updateRessource, deleteRessource } from "../../models/ressource.model";

jest.mock("../../lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("ressource.model - tests unitaires", () => {
  beforeEach(() => resetSupabaseMock());

  test("doit récupérer un élément par son identifiant", async () => {
    // On vérifie que le model utilise la bonne table et retourne la donnée simulée.
    const item = { id_ress: "1" };
    mockSelectByEq(item);

    const result = await getRessourceById("1");

    expect(result).toEqual(item);
    expect(supabaseMock.from).toHaveBeenCalledWith("ressource");
  });

  test("doit créer, modifier et supprimer un élément", async () => {
    // On teste les actions principales sans toucher à la vraie base Supabase.
    mockInsert([{ id_ress: "1" }]);
    await expect(createRessource({ titre_ress: "Respiration", contenu_ress: "Contenu", categorie_ress: "Stress", statut_ress: "publie", date_creation_ress: "2026-01-01", date_modification_ress: "2026-01-01", id_util_auteur: null } as any)).resolves.toEqual([{ id_ress: "1" }]);

    mockUpdate([{ id_ress: "1" }]);
    await expect(updateRessource("1", { id_ress: "1" } as any)).resolves.toEqual([{ id_ress: "1" }]);

    mockDelete();
    await expect(deleteRessource("1")).resolves.toBeNull();
  });
});


