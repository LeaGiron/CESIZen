import { supabaseMock, resetSupabaseMock, mockSelectByEq, mockSelectAll, mockInsert, mockUpdate, mockDelete } from "../mocks/supabase.mock";
import { getUtilisateurById, getAllUtilisateurs, createUtilisateur, updateUtilisateur, deleteUtilisateur } from "../../models/utilisateur.model";

jest.mock("../../lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("utilisateur.model - tests unitaires", () => {
  beforeEach(() => resetSupabaseMock());

  test("doit récupérer un élément par son identifiant", async () => {
    // On vérifie que le model utilise la bonne table et retourne la donnée simulée.
    const item = { id_util: "1" };
    mockSelectByEq(item);

    const result = await getUtilisateurById("1");

    expect(result).toEqual(item);
    expect(supabaseMock.from).toHaveBeenCalledWith("utilisateur");
  });

  test("doit créer, modifier et supprimer un élément", async () => {
    // On teste les actions principales sans toucher à la vraie base Supabase.
    mockInsert([{ id_util: "1" }]);
    await expect(createUtilisateur({ nom_util: "Doe", prenom_util: "Léa", email_util: "lea@test.fr", type_util: "Utilisateur", statut_compte_util: "actif", tentatives_connexion_util: 0, date_verrouillage_util: null, derniere_connexion_util: null } as any)).resolves.toEqual([{ id_util: "1" }]);

    mockUpdate([{ id_util: "1" }]);
    await expect(updateUtilisateur("1", { id_util: "1" } as any)).resolves.toEqual([{ id_util: "1" }]);

    mockDelete();
    await expect(deleteUtilisateur("1")).resolves.toBeNull();
  });
});
