import { FILTRES_STATUT } from "../../controllers/admin_logs.controller";

describe("admin_logs.controller - tests de non-régression", () => {
  test("les filtres de statut doivent garder les valeurs attendues", () => {
    // Si une valeur change, le filtre de l'écran admin peut ne plus fonctionner.
    expect(FILTRES_STATUT).toEqual(["Tous", "succès", "échec", "bloque"]);
  });
});
