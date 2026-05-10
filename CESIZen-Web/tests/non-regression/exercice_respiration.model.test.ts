import { EXERCICES, INDEX_CUSTOM, PHASE_METADATA } from "../../models/exercice_respiration.model";

describe("exercice_respiration.model - tests de non-régression", () => {
  test("les exercices et les phases principales doivent rester présents", () => {
    // Ce test protège les valeurs de base utilisées par la respiration.
    expect(EXERCICES[INDEX_CUSTOM].label).toContain("Personnalisé");
    expect(PHASE_METADATA.inspiration.label).toBe("Inspirez");
    expect(PHASE_METADATA.expiration.label).toBe("Expirez");
    expect(PHASE_METADATA.repos.label).toBe("Terminé");
  });
});
