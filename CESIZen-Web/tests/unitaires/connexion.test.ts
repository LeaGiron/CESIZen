import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ConnexionPage from "../../app/connexion/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@supabase/ssr", () => ({
  createBrowserClient: () => ({
    auth: {
      signOut: jest.fn(),
    },
  }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

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

jest.mock("@/components/Separateur", () => ({
  Separateur: () => "Séparateur",
}));

jest.mock("@/controllers/auth.controller", () => ({
  useConnexion: () => ({
    email_util: "",
    setEmail: jest.fn(),
    mot_de_passe_util: "",
    setMotDePasse: jest.fn(),
    handleConnexion: jest.fn(),
    messageErreur: "",
  }),
}));

describe("connexion/page - test unitaire simple", () => {
  test("doit afficher le titre de la page connexion", async () => {
    // Vérification du chargement de la page

    render(React.createElement(ConnexionPage));

    await waitFor(() => {
      expect(screen.getByText("Bon retour sur CESI")).toBeTruthy();
      expect(screen.getByText("Zen")).toBeTruthy();
    });
  });

  test("doit afficher les champs du formulaire", async () => {
    // Vérification des champs nécessaires pour se connecter

    render(React.createElement(ConnexionPage));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Adresse e-mail")).toBeTruthy();
      expect(screen.getByPlaceholderText("Mot de passe")).toBeTruthy();
    });
  });

  test("doit afficher le bouton de connexion", async () => {
    // Vérification de la présence du bouton principal

    render(React.createElement(ConnexionPage));

    await waitFor(() => {
      expect(screen.getByText("Se connecter")).toBeTruthy();
    });
  });
});