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

describe("ressources/page - test de non-régression simple", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Simulation stable d’un utilisateur non connecté
    getUserMock.mockResolvedValue({
      data: { user: null },
    });

    // Simulation stable d’une ressource importante de la page
    fromMock.mockReturnValue({
      select: jest.fn(() => ({
        order: jest.fn(() =>
          Promise.resolve({
            data: [
              {
                id_ress: "1",
                titre_ress: "Respiration anti-stress",
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

  test("doit toujours afficher les éléments principaux de la page", async () => {
    // Vérification du comportement principal après modification du code

    render(React.createElement(RessourcesPage));

    expect(screen.getByText("📚 Ressources")).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText("Respiration anti-stress")).toBeTruthy();
    });

    expect(screen.getByText("Lire l'article")).toBeTruthy();
  });
});