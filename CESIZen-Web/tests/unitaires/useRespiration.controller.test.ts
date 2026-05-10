import { renderHook, waitFor, act } from "@testing-library/react";
import { useRespiration } from "../../controllers/useRespiration";

jest.mock("../../controllers/dashboard.controller", () => ({
  useDashboard: () => ({ estConnecte: true }),
}));

describe("useRespiration - tests unitaires", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        data: [
          {
            nom_exer: "Respiration calme",
            duree_inspiration_defaut_exer: 4,
            duree_apnee_defaut_exer: 0,
            duree_expiration_defaut_exer: 4,
          },
        ],
      }),
    }) as jest.Mock;
  });

  test("doit charger les exercices de respiration", async () => {
    // On simule l'API pour garder le test rapide et isolé.
    const { result } = renderHook(() => useRespiration());

    await waitFor(() => expect(result.current.chargement).toBe(false));

    expect(result.current.exercices[0].label).toBe("Respiration calme");
    expect(global.fetch).toHaveBeenCalledWith("/api/exercices");
  });

  test("demarrer doit lancer l'exercice avec la phase inspiration", async () => {
    // Ce test vérifie le comportement visible quand l'utilisateur clique sur démarrer.
    const { result } = renderHook(() => useRespiration());

    await waitFor(() => expect(result.current.chargement).toBe(false));

    act(() => {
      result.current.demarrer();
    });

    expect(result.current.actif).toBe(true);
    expect(result.current.phase).toBe("inspiration");
  });
});
