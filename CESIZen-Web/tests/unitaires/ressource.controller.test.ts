import {
  getRessourceById,
  listerToutesLesRessources,
  filtrerParCategories,
  creerRessource,
  modifierRessource,
  deleteRessource,
  afficherCategories,
} from "../../controllers/ressource.controller";
import * as RessourceModel from "../../models/ressource.model";
import * as LogActiviteModel from "../../models/log_activite.model";

jest.mock("../../models/ressource.model", () => ({
  getRessourceById: jest.fn(),
  getAllRessources: jest.fn(),
  getRessourcesByCategorie: jest.fn(),
  createRessource: jest.fn(),
  updateRessource: jest.fn(),
  deleteRessource: jest.fn(),
  getAllCategories: jest.fn(),
}));

jest.mock("../../models/log_activite.model", () => ({
  createLogActivite: jest.fn(),
}));

describe("ressource.controller - tests unitaires", () => {
  beforeEach(() => jest.clearAllMocks());

  test("getRessourceById doit retourner une ressource existante", async () => {
    // On teste le cas le plus simple : une ressource trouvée.
    const ressource = { id_ress: "1", titre_ress: "Gérer le stress" };
    (RessourceModel.getRessourceById as jest.Mock).mockResolvedValue(ressource);

    const resultat = await getRessourceById("1");

    expect(resultat.success).toBe(true);
    expect(resultat.ressource).toEqual(ressource);
  });

  test("listerToutesLesRessources doit créer un log si l'utilisateur est connecté", async () => {
    // Le log n'est créé que si on connaît l'utilisateur.
    (RessourceModel.getAllRessources as jest.Mock).mockResolvedValue([{ id_ress: "1" }]);

    const resultat = await listerToutesLesRessources("u1");

    expect(resultat.success).toBe(true);
    expect(LogActiviteModel.createLogActivite).toHaveBeenCalledWith(expect.objectContaining({
      type_action_log: "consultation_ressource",
      id_util: "u1",
    }));
  });

  test("filtrerParCategories doit retourner les ressources d'une catégorie", async () => {
    // On vérifie que le filtre est bien transmis au modèle.
    (RessourceModel.getRessourcesByCategorie as jest.Mock).mockResolvedValue([{ id_ress: "2", categorie_ress: "Stress" }]);

    const resultat = await filtrerParCategories("Stress", null);

    expect(resultat.success).toBe(true);
    expect(RessourceModel.getRessourcesByCategorie).toHaveBeenCalledWith("Stress");
  });

  test("creerRessource doit ajouter les informations automatiques", async () => {
    // Le controller complète la ressource avec le statut et les dates.
    (RessourceModel.createRessource as jest.Mock).mockResolvedValue({ id_ress: "1", titre_ress: "Sommeil" });

    const resultat = await creerRessource("u1", {
      titre_ress: "Sommeil",
      contenu_ress: "Conseils simples",
      categorie_ress: "Sommeil",
    });

    expect(resultat.success).toBe(true);
    expect(RessourceModel.createRessource).toHaveBeenCalledWith(expect.objectContaining({
      statut_ress: "brouillon",
      id_util_auteur: "u1",
    }));
  });

  test("modifierRessource doit refuser une ressource inexistante", async () => {
    // Avant de modifier, le controller vérifie que la ressource existe.
    (RessourceModel.getRessourceById as jest.Mock).mockResolvedValue(null);

    const resultat = await modifierRessource("404", "u1", { titre_ress: "Test" });

    expect(resultat.success).toBe(false);
    expect(resultat.message).toBe("La ressource n'existe pas.");
  });

  test("deleteRessource doit supprimer une ressource existante", async () => {
    // La suppression ne doit se faire que si la ressource existe vraiment.
    (RessourceModel.getRessourceById as jest.Mock).mockResolvedValue({ id_ress: "1" });
    (RessourceModel.deleteRessource as jest.Mock).mockResolvedValue(undefined);

    const resultat = await deleteRessource("1", "u1");

    expect(resultat.success).toBe(true);
    expect(RessourceModel.deleteRessource).toHaveBeenCalledWith("1");
  });

  test("afficherCategories doit retourner une liste même si le modèle renvoie null", async () => {
    // Ce test garde un retour simple pour l'interface.
    (RessourceModel.getAllCategories as jest.Mock).mockResolvedValue(null);

    const resultat = await afficherCategories();

    expect(resultat).toEqual({ success: true, data: [] });
  });
});
