import { afficherExercices } from "../../controllers/exercice_respiration.controller";
import { getAllExercices } from "../../models/exercice.model";

jest.mock("../../models/exercice.model", () => ({
  getAllExercices: jest.fn(),
  saveExercice: jest.fn(),
  deleteExercice: jest.fn(),
}));

describe("exercice_respiration.controller - tests de non-régression", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("afficherExercices doit garder le même format de réponse", async () => {
    // Ce test protège le format utilisé par l'interface.
    // Si le controller change son retour, on le voit tout de suite.
    (getAllExercices as jest.Mock).mockResolvedValue([
      { id_exer: "1", nom_exer: "Respiration calme" },
    ]);

    const resultat = await afficherExercices();

    expect(resultat).toEqual({
      success: true,
      data: [{ id_exer: "1", nom_exer: "Respiration calme" }],
    });
  });
});
