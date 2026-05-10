import { EXERCICES, INDEX_CUSTOM, PHASE_METADATA } from "../../models/exercice_respiration.model";

describe("exercice_respiration.model - tests unitaires", () => {
  test("doit contenir les exercices de respiration de base", () => {
    // Ce model ne va pas chercher Supabase : on vérifie ses données fixes.
    expect(EXERCICES.length).toBeGreaterThan(0);
    expect(EXERCICES[0]).toHaveProperty("label");
    expect(EXERCICES[0]).toHaveProperty("inspiration");
    expect(EXERCICES[0]).toHaveProperty("expiration");
  });

  test("doit retrouver l'exercice personnalisé", () => {
    // L'index personnalisé est important car il est utilisé côté interface.
    expect(EXERCICES[INDEX_CUSTOM].label).toContain("Personnalisé");
  });
});
