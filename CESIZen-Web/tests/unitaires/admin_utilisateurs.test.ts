import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AdminUtilisateursPage from "../../app/admin/utilisateurs/page";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

jest.mock("@/components/Footer", () => ({
  FooterNav: () => "Footer",
}));

jest.mock("@/components/AdminFooter", () => ({
  AdminFooter: () => "AdminFooter",
}));

jest.mock("@/controllers/admin_utilisateurs.controller", () => ({
  useAdminUtilisateurs: () => ({
    utilisateurs: [
      {
        id_util: "1",
        nom_util: "Doe",
        prenom_util: "Léa",
        email_util: "lea@test.fr",
      },
    ],
    chargement: false,
    form: {
      prenom_util: "",
      nom_util: "",
      email_util: "",
      mot_de_passe_util: "",
      type_util: "Utilisateur",
      statut_compte_util: "actif",
    },
    setForm: jest.fn(),
    validerFormulaire: jest.fn(),
    modifierUtilisateur: jest.fn(),
    deverrouillerUtilisateur: jest.fn(),
  }),
}));

describe("admin utilisateurs/page - test unitaire simple", () => {
  test("doit afficher le titre de la page admin utilisateurs", async () => {
    // Vérification du chargement de la page

    render(React.createElement(AdminUtilisateursPage));

    await waitFor(() => {
      expect(screen.getByText("Membres")).toBeTruthy();
    });
  });

  test("doit afficher un utilisateur", async () => {
    // Vérification de l’affichage d’un utilisateur simulé

    render(React.createElement(AdminUtilisateursPage));

    await waitFor(() => {
      expect(screen.getByText(/Léa/)).toBeTruthy();
      expect(screen.getByText(/Doe/)).toBeTruthy();
    });
  });

  test("doit afficher un email utilisateur", async () => {
    // Vérification de l’affichage de l’email

    render(React.createElement(AdminUtilisateursPage));

    await waitFor(() => {
      expect(screen.getByText("lea@test.fr")).toBeTruthy();
    });
  });
});