import {
  afficherExercices,
  creerExercice,
  modifierExercice,
  supprimerExercice,
} from "../../controllers/exercice_respiration.controller";
import {
  getAllExercices,
  saveExercice,
  deleteExercice,
} from "../../models/exercice.model";

jest.mock("../../models/exercice.model", () => ({
  getAllExercices: jest.fn(),
  saveExercice: jest.fn(),
  deleteExercice: jest.fn(),
}));

describe("exercice_respiration.controller - tests unitaires", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("afficherExercices doit retourner la liste des exercices", async () => {
    // On simule la réponse du modèle pour ne pas appeler la vraie base de données.
    (getAllExercices as jest.Mock).mockResolvedValue([
      { id_exer: "1", nom_exer: "Respiration calme" },
    ]);

    const resultat = await afficherExercices();

    expect(resultat.success).toBe(true);
    expect(resultat.data).toHaveLength(1);
    expect(getAllExercices).toHaveBeenCalledTimes(1);
  });

  test("creerExercice doit sauvegarder un nouvel exercice", async () => {
    // Ici, on vérifie que le controller transmet bien les données au modèle.
    const exercice = {
      nom_exer: "Cohérence cardiaque",
      description_exer: "Exercice simple pour se calmer",
      duree_inspiration_defaut_exer: 5,
      duree_apnee_defaut_exer: 0,
      duree_expiration_defaut_exer: 5,
    };

    (saveExercice as jest.Mock).mockResolvedValue({ id_exer: "1", ...exercice });

    const resultat = await creerExercice("utilisateur-1", exercice);

    expect(resultat.success).toBe(true);
    expect(saveExercice).toHaveBeenCalledWith(exercice);
  });

  test("modifierExercice doit ajouter l'id avant la sauvegarde", async () => {
    // Pour une modification, le controller doit envoyer l'id avec le formulaire.
    const exercice = {
      nom_exer: "Respiration modifiée",
      description_exer: "Description mise à jour",
      duree_inspiration_defaut_exer: 4,
      duree_apnee_defaut_exer: 2,
      duree_expiration_defaut_exer: 6,
    };

    (saveExercice as jest.Mock).mockResolvedValue({ id_exer: "10", ...exercice });

    const resultat = await modifierExercice("10", "utilisateur-1", exercice);

    expect(resultat.success).toBe(true);
    expect(saveExercice).toHaveBeenCalledWith({ id_exer: "10", ...exercice });
  });

  test("supprimerExercice doit appeler le modèle de suppression", async () => {
    // On vérifie uniquement l'action importante : demander la suppression.
    (deleteExercice as jest.Mock).mockResolvedValue(undefined);

    const resultat = await supprimerExercice("10", "utilisateur-1");

    expect(resultat.success).toBe(true);
    expect(deleteExercice).toHaveBeenCalledWith("10");
  });
});
