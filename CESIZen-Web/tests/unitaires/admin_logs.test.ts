import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AdminLogsPage from "../../app/admin/logs/page";

jest.mock("@/components/AdminFooter", () => ({
  AdminFooter: () => "AdminFooter",
}));

jest.mock("@/controllers/admin_logs.controller", () => ({
  FILTRES_STATUT: ["Tous", "succès", "échec"],
  FILTRES_ACTION: ["Tous", "connexion", "déconnexion"],

  useAdminLogs: () => ({
    logs: [
      {
        id_log: "1",
        type_action_log: "connexion",
        statut_log: "succès",
        date_action_log: "2026-05-04T10:00:00.000Z",
        utilisateur: {
          prenom_util: "Léa",
          nom_util: "Doe",
          email_util: "lea@test.fr",
        },
      },
    ],
    chargement: false,
    filtreStatut: "Tous",
    setFiltreStatut: jest.fn(),
    filtreAction: "Tous",
    setFiltreAction: jest.fn(),
    recherche: "",
    setRecherche: jest.fn(),
    total: 1,
  }),
}));

describe("admin logs/page - test unitaire simple", () => {
  test("doit afficher le titre de la page admin logs", async () => {
    // Vérification du chargement de la page

    render(React.createElement(AdminLogsPage));

    await waitFor(() => {
      expect(screen.getByText("Journaux d'activité")).toBeTruthy();
    });
  });

  test("doit afficher un log", async () => {
    // Vérification de l’affichage d’un log simulé

    render(React.createElement(AdminLogsPage));

    await waitFor(() => {
      expect(screen.getAllByText("connexion")[0]).toBeTruthy();
      expect(screen.getAllByText("succès")[0]).toBeTruthy();
    });
  });

  test("doit afficher l’utilisateur du log", async () => {
    // Vérification des informations utilisateur liées au log

    render(React.createElement(AdminLogsPage));

    await waitFor(() => {
      expect(screen.getByText(/Léa/)).toBeTruthy();
      expect(screen.getByText(/Doe/)).toBeTruthy();
      expect(screen.getByText(/lea@test.fr/)).toBeTruthy();
    });
  });
});