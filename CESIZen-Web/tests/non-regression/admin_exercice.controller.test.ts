import { renderHook, waitFor } from "@testing-library/react";
import { useAdminExercices } from "../../controllers/admin_exercice.controller";

jest.mock("@supabase/ssr", () => ({
  createBrowserClient: jest.fn(() => ({
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: "admin-1" } } }) },
    from: jest.fn(() => ({ insert: jest.fn().mockResolvedValue({ error: null }) })),
  })),
}));

describe("admin_exercice.controller - tests de non-régression", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [] }) as jest.Mock;
  });

  test("le formulaire doit garder ses valeurs par défaut", async () => {
    // Ce formulaire vide sert de base à la création d'un exercice.
    const { result } = renderHook(() => useAdminExercices());

    await waitFor(() => expect(result.current.chargement).toBe(false));

    expect(result.current.form).toEqual({
      nom_exer: "",
      description_exer: "",
      duree_inspiration_defaut_exer: 0,
      duree_apnee_defaut_exer: 0,
      duree_expiration_defaut_exer: 0,
    });
  });
});
