import { afficherProfil } from "../../controllers/utilisateur.controller";
import * as UtilisateurModel from "../../models/utilisateur.model";

jest.mock("../../models/utilisateur.model", () => ({
  getUtilisateurById: jest.fn(),
}));

jest.mock("../../models/log_activite.model", () => ({
  createLogActivite: jest.fn(),
}));

describe("utilisateur.controller - tests de non-régression", () => {
  test("afficherProfil doit conserver le format success/data", async () => {
    // Ce format est important pour les pages qui consomment le controller.
    const utilisateur = { id_util: "u1", prenom_util: "Léa" };
    (UtilisateurModel.getUtilisateurById as jest.Mock).mockResolvedValue(utilisateur);

    const resultat = await afficherProfil("u1");

    expect(resultat).toEqual({ success: true, data: utilisateur });
  });
});
