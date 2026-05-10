import { listerToutesLesRessources } from "../../controllers/ressource.controller";
import * as RessourceModel from "../../models/ressource.model";

jest.mock("../../models/ressource.model", () => ({
  getAllRessources: jest.fn(),
}));

jest.mock("../../models/log_activite.model", () => ({
  createLogActivite: jest.fn(),
}));

describe("ressource.controller - tests de non-régression", () => {
  test("listerToutesLesRessources doit garder le format success/data", async () => {
    // L'écran des ressources dépend de ce format simple.
    const ressources = [{ id_ress: "1", titre_ress: "Gérer le stress" }];
    (RessourceModel.getAllRessources as jest.Mock).mockResolvedValue(ressources);

    const resultat = await listerToutesLesRessources(null);

    expect(resultat).toEqual({ success: true, data: ressources });
  });
});
