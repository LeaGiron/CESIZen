import { renderHook, waitFor } from "@testing-library/react";
import { useAdminExercices } from "../../controllers/admin_exercice.controller";

// Simulation de Supabase pour éviter une vraie connexion à la base de données
jest.mock("@supabase/ssr", () => ({
  createBrowserClient: jest.fn(() => ({
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: "admin-1" } } }) },
    from: jest.fn(() => ({ insert: jest.fn().mockResolvedValue({ error: null }) })),
  })),
}));

describe("admin_exercice.controller - tests unitaires", () => {
  beforeEach(() => {
    // Remise à zéro des mocks avant chaque test
    jest.clearAllMocks();

    // Simulation de l'appel API qui retourne une liste d'exercices
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id_exer: "1", nom_exer: "Respiration calme" }],
    }) as jest.Mock;
  });

  test("doit charger les exercices au démarrage du hook", async () => {
    // Lancement du hook comme il serait utilisé dans une page
    const { result } = renderHook(() => useAdminExercices());

    // Attente de la fin du chargement des données
    await waitFor(() => expect(result.current.chargement).toBe(false));

    // Vérifie qu'un exercice est bien présent dans la liste
    expect(result.current.exercices).toHaveLength(1);

    // Vérifie que la bonne route API est appelée
    expect(global.fetch).toHaveBeenCalledWith("/api/admin/lister-exercice");
  });
});