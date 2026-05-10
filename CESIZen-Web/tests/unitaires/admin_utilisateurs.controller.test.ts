import { renderHook, waitFor } from "@testing-library/react";
import { useAdminUtilisateurs } from "../../controllers/admin_utilisateurs.controller";
import { getAllUtilisateurs } from "../../models/admin_utilisateur.model";
import { getRoleUtilisateur } from "../../models/admin_ressource.model";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
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

describe("admin_utilisateurs.controller - tests unitaires", () => {
  beforeEach(() => jest.clearAllMocks());

  test("doit charger les utilisateurs pour un administrateur", async () => {
    // On vérifie que l'écran admin charge les comptes sans appeler Supabase réellement.
    (getRoleUtilisateur as jest.Mock).mockResolvedValue("Administrateur");
    (getAllUtilisateurs as jest.Mock).mockResolvedValue([
      { id_util: "u1", prenom_util: "Léa", nom_util: "Test", email_util: "lea@mail.com" },
    ]);

    const { result } = renderHook(() => useAdminUtilisateurs());

    await waitFor(() => expect(result.current.chargement).toBe(false));

    expect(result.current.utilisateurs).toHaveLength(1);
    expect(pushMock).not.toHaveBeenCalled();
  });
});
