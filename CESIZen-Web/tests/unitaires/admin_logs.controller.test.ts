import { FILTRES_ACTION, FILTRES_STATUT } from "../../controllers/admin_logs.controller";

describe("admin_logs.controller - tests unitaires", () => {
  test("doit proposer un filtre Tous pour les statuts", () => {
    // L'interface doit pouvoir revenir à une vue sans filtre.
    expect(FILTRES_STATUT).toContain("Tous");
  });

  test("doit proposer les actions importantes dans les filtres", () => {
    // Ces valeurs sont utilisées dans l'écran admin des logs.
    expect(FILTRES_ACTION).toContain("connexion");
    expect(FILTRES_ACTION).toContain("creation_compte");
    expect(FILTRES_ACTION).toContain("modification_profil");
  });
});
