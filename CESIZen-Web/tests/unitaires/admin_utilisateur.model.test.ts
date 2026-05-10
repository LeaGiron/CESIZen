import { supabaseMock, resetSupabaseMock, mockOrder, mockUpdateNoSelect } from "../mocks/supabase.mock";
import { getAllUtilisateurs, updateUtilisateur, deverrouillerUtilisateur } from "../../models/admin_utilisateur.model";

jest.mock("@/lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("admin_utilisateur.model - tests unitaires", () => {
  beforeEach(() => resetSupabaseMock());

  test("doit charger la liste des utilisateurs admin", async () => {
    // On vérifie que la liste admin est récupérée sans vraie base de données.
    const utilisateurs = [{ id_util: "u1", email_util: "lea@test.fr" }];
    mockOrder(utilisateurs);

    await expect(getAllUtilisateurs()).resolves.toEqual(utilisateurs);
    expect(supabaseMock.from).toHaveBeenCalledWith("utilisateur");
  });

  test("doit modifier et déverrouiller un utilisateur", async () => {
    // Ces fonctions retournent true quand Supabase ne renvoie pas d'erreur.
    mockUpdateNoSelect(null);
    await expect(updateUtilisateur("u1", { nom_util: "Doe", prenom_util: "Léa", email_util: "lea@test.fr", type_util: "Utilisateur", statut_compte_util: "actif" })).resolves.toBe(true);

    mockUpdateNoSelect(null);
    await expect(deverrouillerUtilisateur("u1")).resolves.toBe(true);
  });
});
