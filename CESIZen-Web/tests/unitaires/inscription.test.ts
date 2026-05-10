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

describe("inscription/page - test unitaire simple", () => {
  test("doit afficher le titre de la page inscription", async () => {
    // Vérification du chargement de la page

    render(React.createElement(InscriptionPage));

    await waitFor(() => {
      expect(screen.getByText("Bienvenue sur CESI")).toBeTruthy();
      expect(screen.getByText("Zen")).toBeTruthy();
    });
  });

  test("doit afficher les champs du formulaire", async () => {
    // Vérification des champs nécessaires pour créer un compte

    render(React.createElement(InscriptionPage));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Nom")).toBeTruthy();
      expect(screen.getByPlaceholderText("Prénom")).toBeTruthy();
      expect(screen.getByPlaceholderText("Adresse e-mail")).toBeTruthy();
      expect(screen.getByPlaceholderText("Mot de passe")).toBeTruthy();
    });
  });

  test("doit afficher le bouton inscription", async () => {
    // Vérification de la présence du bouton principal

    render(React.createElement(InscriptionPage));

    await waitFor(() => {
      expect(screen.getByText("S'inscrire")).toBeTruthy();
    });
  });
});