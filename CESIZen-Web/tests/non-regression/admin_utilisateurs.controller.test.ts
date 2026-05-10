import { renderHook, waitFor } from "@testing-library/react";
import { useAdminUtilisateurs } from "../../controllers/admin_utilisateurs.controller";
import { getAllUtilisateurs } from "../../models/admin_utilisateur.model";
import { getRoleUtilisateur } from "../../models/admin_ressource.model";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("../../lib/supabase/supabase", () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: "admin-1" } } }),
    },
  },
}));

jest.mock("../../models/admin_utilisateur.model", () => ({
  getAllUtilisateurs: jest.fn(),
  updateUtilisateur: jest.fn(),
  deverrouillerUtilisateur: jest.fn(),
}));

jest.mock("../../models/admin_ressource.model", () => ({
  getRoleUtilisateur: jest.fn(),
}));

describe("admin_utilisateurs.controller - tests de non-régression", () => {
  test("le formulaire utilisateur doit garder ses valeurs par défaut", async () => {
    // Ces valeurs sont la base de création d'un compte admin.
    (getRoleUtilisateur as jest.Mock).mockResolvedValue("Administrateur");
    (getAllUtilisateurs as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useAdminUtilisateurs());

    await waitFor(() => expect(result.current.chargement).toBe(false));

    expect(result.current.form).toEqual({
      nom_util: "",
      prenom_util: "",
      email_util: "",
      mdp_util: "",
      type_util: "Utilisateur",
      statut_compte_util: "actif",
    });
  });
});
