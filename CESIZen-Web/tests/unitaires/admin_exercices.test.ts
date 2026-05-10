import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AdminExercicesPage from "../../app/admin/exercices/page";

jest.mock("@/components/AdminFooter", () => ({
  AdminFooter: () => "AdminFooter",
}));

jest.mock("@/controllers/admin_exercice.controller", () => ({
  useAdminExercices: () => ({
    exercices: [
      {
        id_exer: 1,
        nom_exer: "Respiration calme",
        description_exer: "Exercice simple pour se détendre",
        duree_inspiration_defaut_exer: 4,
        duree_apnee_defaut_exer: 4,
        duree_expiration_defaut_exer: 6,
      },
    ],
    form: {
      nom_exer: "",
      description_exer: "",
      duree_inspiration_defaut_exer: 4,
      duree_apnee_defaut_exer: 4,
      duree_expiration_defaut_exer: 6,
    },
    setForm: jest.fn(),
    message: "",
    chargement: false,
    idEnCoursEdition: null,
    validerFormulaire: jest.fn(),
    supprimerExercice: jest.fn(),
    preparerModification: jest.fn(),
    annulerEdition: jest.fn(),
  }),
}));

describe("admin exercices/page - test unitaire simple", () => {
  test("doit afficher le titre de la page admin exercices", async () => {
    // Vérification du chargement de la page

    render(React.createElement(AdminExercicesPage));

    await waitFor(() => {
      expect(screen.getByText("Exercices de respiration")).toBeTruthy();
    });
  });

  test("doit afficher un exercice", async () => {
    // Vérification de l’affichage d’un exercice simulé

    render(React.createElement(AdminExercicesPage));

    await waitFor(() => {
      expect(screen.getByText("Respiration calme")).toBeTruthy();
    });
  });

  test("doit afficher le bouton de création", async () => {
    // Vérification de la présence du bouton principal

    render(React.createElement(AdminExercicesPage));

    await waitFor(() => {
      expect(screen.getByText("Créer l'exercice")).toBeTruthy();
    });
  });
});