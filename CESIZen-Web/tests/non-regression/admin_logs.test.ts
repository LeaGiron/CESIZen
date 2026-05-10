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
          prenom_util: "Paul",
          nom_util: "Martin",
          email_util: "paul@test.fr",
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

describe("admin logs/page - test de non-régression simple", () => {
  test("doit toujours afficher les éléments principaux", async () => {
    // Vérification du comportement principal après modification

    render(React.createElement(AdminLogsPage));

    await waitFor(() => {
      expect(screen.getByText("Journaux d'activité")).toBeTruthy();
      expect(screen.getByText("Admin")).toBeTruthy();
      expect(screen.getAllByText("connexion")[0]).toBeTruthy();
      expect(screen.getAllByText("succès")[0]).toBeTruthy();
      expect(screen.getByText(/paul@test.fr/)).toBeTruthy();
    });
  });
});