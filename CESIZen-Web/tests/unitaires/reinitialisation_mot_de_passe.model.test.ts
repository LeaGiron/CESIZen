import { supabaseMock, resetSupabaseMock, mockSelectByEq, mockSelectAll, mockInsert, mockUpdate, mockDelete } from "../mocks/supabase.mock";
import { getReinitialisationMotDePasseById, getAllReinitialisationMotDePasse, createReinitialisationMotDePasse, updateReinitialisationMotDePasse, deleteReinitialisationMotDePasse } from "../../models/reinitialisation_mot_de_passe.model";

jest.mock("../../lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("reinitialisation_mot_de_passe.model - tests unitaires", () => {
  beforeEach(() => resetSupabaseMock());

  test("doit récupérer un élément par son identifiant", async () => {
    // On vérifie que le model utilise la bonne table et retourne la donnée simulée.
    const item = { id_reinit: "1" };
    mockSelectByEq(item);

    const result = await getReinitialisationMotDePasseById("1");

    expect(result).toEqual(item);
    expect(supabaseMock.from).toHaveBeenCalledWith("reinitialisation_mot_de_passe");
  });

  test("doit créer, modifier et supprimer un élément", async () => {
    // On teste les actions principales sans toucher à la vraie base Supabase.
    mockInsert([{ id_reinit: "1" }]);
    await expect(createReinitialisationMotDePasse({ token_reinit: "reset-token", id_util: null } as any)).resolves.toEqual([{ id_reinit: "1" }]);

    mockUpdate([{ id_reinit: "1" }]);
    await expect(updateReinitialisationMotDePasse("1", { id_reinit: "1" } as any)).resolves.toEqual([{ id_reinit: "1" }]);

    mockDelete();
    await expect(deleteReinitialisationMotDePasse("1")).resolves.toBeNull();
  });
});
