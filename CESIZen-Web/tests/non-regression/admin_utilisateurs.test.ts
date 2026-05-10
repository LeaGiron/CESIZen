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
        nom_util: "Martin",
        prenom_util: "Paul",
        email_util: "paul@test.fr",
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

describe("admin utilisateurs/page - test de non-régression simple", () => {
  test("doit toujours afficher les éléments principaux", async () => {
    // Vérification du comportement principal après modification

    render(React.createElement(AdminUtilisateursPage));

    await waitFor(() => {
      expect(screen.getByText("Membres")).toBeTruthy();
      expect(screen.getByText(/Paul/)).toBeTruthy();
      expect(screen.getByText(/Martin/)).toBeTruthy();
      expect(screen.getByText("paul@test.fr")).toBeTruthy();
    });
  });
});