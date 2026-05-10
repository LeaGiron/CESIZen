import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import InscriptionPage from "../../app/inscription/page";

jest.mock("@/components/Header", () => ({
  Header: () => "Header",
}));

jest.mock("@/components/Input", () => ({
  Input: ({ placeholder }: any) =>
    React.createElement("input", { placeholder }),
}));

jest.mock("@/components/Bouton", () => ({
  Bouton: ({ label }: any) =>
    React.createElement("button", {}, label),
}));

jest.mock("@/components/Bouton_retour", () => ({
  __esModule: true,
  default: () => "Retour",
}));

jest.mock("@/controllers/auth.controller", () => ({
  useInscription: () => ({
    nom_util: "",
    setNom: jest.fn(),
    prenom_util: "",
    setPrenom: jest.fn(),
    email_util: "",
    setEmail: jest.fn(),
    mot_de_passe_util: "",
    setMotDePasse: jest.fn(),
    handleInscription: jest.fn(),
    messageErreur: "",
  }),
}));

describe("inscription/page - test de non-régression simple", () => {
  test("doit toujours afficher les éléments principaux de la page", async () => {
    // Vérification des éléments importants après modification du code

    render(React.createElement(InscriptionPage));

    await waitFor(() => {
      expect(screen.getByText("Bienvenue sur CESI")).toBeTruthy();
      expect(screen.getByText("Zen")).toBeTruthy();
      expect(screen.getByPlaceholderText("Adresse e-mail")).toBeTruthy();
      expect(screen.getByPlaceholderText("Mot de passe")).toBeTruthy();
      expect(screen.getByText("S'inscrire")).toBeTruthy();
    });
  });
});