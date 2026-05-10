import { supabaseMock, resetSupabaseMock, mockSelectByEq, mockSelectAll, mockInsert, mockUpdate, mockDelete } from "../mocks/supabase.mock";
import { getConfigurationExerciceById, getAllConfigurationExercice, createConfigurationExercice, updateConfigurationExercice, deleteConfigurationExercice } from "../../models/configuration_exercice.model";

jest.mock("../../lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("configuration_exercice.model - tests unitaires", () => {
  beforeEach(() => resetSupabaseMock());

  test("doit récupérer un élément par son identifiant", async () => {
    // On vérifie que le model utilise la bonne table et retourne la donnée simulée.
    const item = { id_config: "1" };
    mockSelectByEq(item);

    const result = await getConfigurationExerciceById("1");

    expect(result).toEqual(item);
    expect(supabaseMock.from).toHaveBeenCalledWith("configuration_exercice");
  });

  test("doit créer, modifier et supprimer un élément", async () => {
    // On teste les actions principales sans toucher à la vraie base Supabase.
    mockInsert([{ id_config: "1" }]);
    await expect(createConfigurationExercice({ duree_inspiration_config: 4, duree_apnee_config: 0, duree_expiration_config: 6, id_util: null, id_exer: null } as any)).resolves.toEqual([{ id_config: "1" }]);

    mockUpdate([{ id_config: "1" }]);
    await expect(updateConfigurationExercice("1", { id_config: "1" } as any)).resolves.toEqual([{ id_config: "1" }]);

    mockDelete();
    await expect(deleteConfigurationExercice("1")).resolves.toBeNull();
  });
});
