import {
  afficherProfil,
  modifierProfil,
  supprimerProfil,
} from "../../controllers/utilisateur.controller";
import * as UtilisateurModel from "../../models/utilisateur.model";
import * as LogActiviteModel from "../../models/log_activite.model";

jest.mock("../../models/utilisateur.model", () => ({
  getUtilisateurById: jest.fn(),
  updateUtilisateur: jest.fn(),
  deleteUtilisateur: jest.fn(),
}));

jest.mock("../../models/log_activite.model", () => ({
  createLogActivite: jest.fn(),
}));

describe("utilisateur.controller - tests unitaires", () => {
  beforeEach(() => jest.clearAllMocks());

  test("afficherProfil doit retourner le profil quand l'utilisateur existe", async () => {
    // On simule un utilisateur trouvé dans le modèle.
    const utilisateur = { id_util: "u1", prenom_util: "Léa", email_util: "lea@mail.com" };
    (UtilisateurModel.getUtilisateurById as jest.Mock).mockResolvedValue(utilisateur);

    const resultat = await afficherProfil("u1");

    expect(resultat.success).toBe(true);
    expect(resultat.data).toEqual(utilisateur);
    expect(LogActiviteModel.createLogActivite).toHaveBeenCalledWith({
      type_action_log: "consultation_profil",
      statut_log: "succès",
      id_util: "u1",
      ip_adresse_log: null,
    });
  });

  test("afficherProfil doit retourner une erreur si le compte n'existe pas", async () => {
    // Ce cas évite d'afficher un profil vide à l'utilisateur.
    (UtilisateurModel.getUtilisateurById as jest.Mock).mockResolvedValue(null);

    const resultat = await afficherProfil("inconnu");

    expect(resultat.success).toBe(false);
    expect(resultat.message).toBe("Le compte n'existe pas.");
  });

  test("modifierProfil doit modifier les informations puis créer un log", async () => {
    // Le controller vérifie d'abord l'existence, puis lance la modification.
    (UtilisateurModel.getUtilisateurById as jest.Mock).mockResolvedValue({ id_util: "u1" });
    (UtilisateurModel.updateUtilisateur as jest.Mock).mockResolvedValue({ id_util: "u1", prenom_util: "Léa" });

    const resultat = await modifierProfil("u1", { prenom_util: "Léa" } as any);

    expect(resultat.success).toBe(true);
    expect(UtilisateurModel.updateUtilisateur).toHaveBeenCalledWith("u1", { prenom_util: "Léa" });
    expect(LogActiviteModel.createLogActivite).toHaveBeenCalledWith(expect.objectContaining({
      type_action_log: "modification_profil",
      statut_log: "succès",
    }));
  });

  test("supprimerProfil doit supprimer le compte si l'utilisateur existe", async () => {
    // On vérifie que la suppression est demandée au modèle.
    (UtilisateurModel.getUtilisateurById as jest.Mock).mockResolvedValue({ id_util: "u1" });
    (UtilisateurModel.deleteUtilisateur as jest.Mock).mockResolvedValue(undefined);

    const resultat = await supprimerProfil("u1");

    expect(resultat.success).toBe(true);
    expect(UtilisateurModel.deleteUtilisateur).toHaveBeenCalledWith("u1");
  });
});
