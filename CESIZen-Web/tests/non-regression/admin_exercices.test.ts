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
        nom_exer: "Cohérence cardiaque",
        description_exer: "Exercice de respiration guidée",
        duree_inspiration_defaut_exer: 5,
        duree_apnee_defaut_exer: 0,
        duree_expiration_defaut_exer: 5,
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

describe("admin exercices/page - test de non-régression simple", () => {
  test("doit toujours afficher les éléments principaux", async () => {
    // Vérification du comportement principal après modification

    render(React.createElement(AdminExercicesPage));

    await waitFor(() => {
      expect(screen.getByText("Exercices de respiration")).toBeTruthy();
      expect(screen.getByText("➕ Ajouter un exercice")).toBeTruthy();
      expect(screen.getByText("Cohérence cardiaque")).toBeTruthy();
      expect(screen.getByText("Créer l'exercice")).toBeTruthy();
    });
  });
});