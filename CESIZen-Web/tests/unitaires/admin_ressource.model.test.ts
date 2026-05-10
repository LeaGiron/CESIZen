import { supabaseMock, resetSupabaseMock, mockSelectByEq, mockOrder, mockInsertSingle, mockUpdate, mockDeleteSelect } from "../mocks/supabase.mock";
import { getRoleUtilisateur, getAllRessources, insertRessource, updateRessource, deleteRessource } from "../../models/admin_ressource.model";

jest.mock("@/lib/supabase/supabase", () => ({ supabase: supabaseMock }));

describe("admin_ressource.model - tests unitaires", () => {
  beforeEach(() => resetSupabaseMock());

  test("doit récupérer le rôle et la liste des ressources", async () => {
    // On simule un administrateur et des ressources déjà présentes.
    mockSelectByEq({ type_util: "Administrateur" });
    await expect(getRoleUtilisateur("u1")).resolves.toBe("Administrateur");

    mockOrder([{ id_ress: 1, titre_ress: "Stress" }]);
    await expect(getAllRessources()).resolves.toEqual([{ id_ress: 1, titre_ress: "Stress" }]);
  });

  test("doit ajouter, modifier et supprimer une ressource admin", async () => {
    // On vérifie le CRUD admin avec des réponses Supabase simulées.
    const form = { titre_ress: "Titre", contenu_ress: "Contenu", categorie_ress: "Stress", statut_ress: "publie" as const };

    mockInsertSingle({ id_ress: 1, ...form });
    await expect(insertRessource(form)).resolves.toEqual({ id_ress: 1, ...form });

    mockUpdate([{ id_ress: 1 }]);
    await expect(updateRessource(1, form)).resolves.toBe(true);

    mockDeleteSelect([{ id_ress: 1 }]);
    await expect(deleteRessource(1)).resolves.toBe(true);
  });
});
