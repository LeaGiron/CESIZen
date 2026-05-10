import { renderHook, waitFor } from "@testing-library/react";
import { useRespiration } from "../../controllers/useRespiration";

jest.mock("../../controllers/dashboard.controller", () => ({
  useDashboard: () => ({ estConnecte: true }),
}));

describe("useRespiration - tests de non-régression", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ json: async () => ({ data: [] }) }) as jest.Mock;
  });

  test("doit toujours proposer un exercice personnalisé", async () => {
    // Même sans exercice en base, l'utilisateur doit avoir une option de respiration.
    const { result } = renderHook(() => useRespiration());

    await waitFor(() => expect(result.current.chargement).toBe(false));

    expect(result.current.exercices).toContainEqual({
      label: "🎛️ Personnalisé",
      inspiration: 4,
      apnee: 0,
      expiration: 4,
    });
  });
});
