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

describe("connexion/page - test de non-régression simple", () => {
  test("doit toujours afficher les éléments principaux de la page", async () => {
    // Vérification des éléments importants après modification du code

    render(React.createElement(ConnexionPage));

    await waitFor(() => {
      expect(screen.getByText("Bon retour sur CESI")).toBeTruthy();
      expect(screen.getByText("Zen")).toBeTruthy();
      expect(screen.getByPlaceholderText("Adresse e-mail")).toBeTruthy();
      expect(screen.getByPlaceholderText("Mot de passe")).toBeTruthy();
      expect(screen.getByText("Se connecter")).toBeTruthy();
      expect(screen.getByText("Mot de passe oublié ?")).toBeTruthy();
      expect(screen.getByText("Continuer sans compte")).toBeTruthy();
    });
  });
});