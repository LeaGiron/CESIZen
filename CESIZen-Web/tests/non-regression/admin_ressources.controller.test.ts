import { renderHook, waitFor } from "@testing-library/react";
import { useAdminRessources } from "../../controllers/admin_ressources.controller";
import { getAllRessources, getRoleUtilisateur } from "../../models/admin_ressource.model";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("../../lib/supabase/supabase", () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: "admin-1" } }, error: null }),
    },
  },
}));

jest.mock("../../models/admin_ressource.model", () => ({
  getAllRessources: jest.fn(),
  insertRessource: jest.fn(),
  updateRessource: jest.fn(),
  deleteRessource: jest.fn(),
  getRoleUtilisateur: jest.fn(),
}));

describe("admin_ressources.controller - tests de non-régression", () => {
  test("le formulaire de ressource doit garder ses valeurs par défaut", async () => {
    // Ces valeurs évitent un formulaire vide ou incohérent côté admin.
    (getRoleUtilisateur as jest.Mock).mockResolvedValue("Administrateur");
    (getAllRessources as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useAdminRessources());

    await waitFor(() => expect(result.current.chargement).toBe(false));

    expect(result.current.form).toEqual({
      titre_ress: "",
      contenu_ress: "",
      categorie_ress: "Stress",
      statut_ress: "brouillon",
    });
  });
});
