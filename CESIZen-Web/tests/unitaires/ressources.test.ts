import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import RessourcesPage from "../../app/ressources/page";

const getUserMock = jest.fn();
const fromMock = jest.fn();

jest.mock("@supabase/ssr", () => ({
  createBrowserClient: () => ({
    auth: {
      getUser: getUserMock,
    },
    from: fromMock,
  }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

jest.mock("@/components/Footer", () => ({
  FooterNav: () => "Footer",
}));

describe("ressources/page - test unitaire simple", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Simulation d’un utilisateur non connecté
    getUserMock.mockResolvedValue({
      data: { user: null },
    });

    // Simulation d’une ressource publiée renvoyée par Supabase
    fromMock.mockReturnValue({
      select: jest.fn(() => ({
        order: jest.fn(() =>
          Promise.resolve({
            data: [
              {
                id_ress: "1",
                titre_ress: "Gérer son stress",
                categorie_ress: "Stress",
                statut_ress: "publie",
              },
            ],
            error: null,
          })
        ),
      })),
    });
  });

  test("doit afficher le titre de la page ressources", () => {
    // Vérification du chargement de la page

    render(React.createElement(RessourcesPage));

    expect(screen.getByText("📚 Ressources")).toBeTruthy();
  });

  test("doit afficher une ressource publiée", async () => {
    // Vérification de l’affichage d’une ressource simple

    render(React.createElement(RessourcesPage));

    await waitFor(() => {
      expect(screen.getByText("Gérer son stress")).toBeTruthy();
    });
  });
});