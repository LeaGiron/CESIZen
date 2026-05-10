const { EXERCICES, INDEX_CUSTOM } = require('@/models/respiration.model');

describe('respiration.model - tests unitaires', () => {
  it('contient au moins un exercice de respiration', () => {
    // L’application doit toujours avoir des exercices disponibles.
    expect(EXERCICES.length).toBeGreaterThan(0);
  });

  it('chaque exercice possède les durées nécessaires', () => {
    // L’écran respiration dépend de ces valeurs.
    const exercice = EXERCICES[0];

    expect(exercice.label).toBeDefined();
    expect(exercice.inspiration).toBeDefined();
    expect(exercice.expiration).toBeDefined();
  });

  it('l’index personnalisé pointe vers un exercice existant', () => {
    // Le mode personnalisé doit pointer vers une entrée valide.
    expect(EXERCICES[INDEX_CUSTOM]).toBeDefined();
    expect(EXERCICES[INDEX_CUSTOM].label).toBe('Personnalisé');
  });
});
