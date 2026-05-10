import { renderHook, waitFor } from "@testing-library/react";
import { useAdminRessources } from "../../controllers/admin_ressources.controller";
import { getAllRessources, getRoleUtilisateur } from "../../models/admin_ressource.model";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
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

describe("admin_ressources.controller - tests unitaires", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("doit charger les ressources si l'utilisateur est administrateur", async () => {
    // On simule un admin connecté pour tester uniquement la logique du hook.
    (getRoleUtilisateur as jest.Mock).mockResolvedValue("Administrateur");
    (getAllRessources as jest.Mock).mockResolvedValue([
      { id_ress: 1, titre_ress: "Stress", contenu_ress: "Texte", categorie_ress: "Stress", statut_ress: "brouillon" },
    ]);

    const { result } = renderHook(() => useAdminRessources());

    await waitFor(() => expect(result.current.chargement).toBe(false));

    expect(result.current.ressources).toHaveLength(1);
    expect(pushMock).not.toHaveBeenCalled();
  });
});
