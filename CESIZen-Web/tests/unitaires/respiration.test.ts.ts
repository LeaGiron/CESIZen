import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import RespirationPage from "../../app/respiration/page";

jest.mock("@/components/Bouton_retour", () => ({
  __esModule: true,
  default: () => "Retour",
}));

jest.mock("@/controllers/useRespiration", () => ({
  useRespiration: () => ({
    actif: false,
    pause: false,
    phase: "repos",
    compteur: 4,
    demarrer: jest.fn(),
    arreter: jest.fn(),
    setPause: jest.fn(),
    colors: {
      circle: "#22c55e",
      bg: "#ffffff",
      text: "#000000",
    },
  }),
}));

describe("respiration/page - test unitaire simple", () => {
  test("doit afficher le titre de la page respiration", async () => {
    // Vérification du chargement de la page

    render(React.createElement(RespirationPage));

    await waitFor(() => {
      expect(screen.getByText("Respiration")).toBeTruthy();
    });
  });

  test("doit afficher l’état de départ de l’exercice", async () => {
    // Vérification du texte affiché avant le démarrage

    render(React.createElement(RespirationPage));

    await waitFor(() => {
      expect(screen.getByText("Prêt ?")).toBeTruthy();
    });
  });
});