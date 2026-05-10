const { EXERCICES, INDEX_CUSTOM } = require('@/models/respiration.model');

describe('respiration.model - tests de non-régression', () => {
  it('contient les exercices de respiration par défaut', () => {
    // Ce test vérifie que les exercices de base sont toujours disponibles.
    // Si un exercice disparaît par erreur, le test échoue.
    expect(EXERCICES).toHaveLength(4);

    expect(EXERCICES[0]).toEqual({
      label: '5-0-5 (Relaxation)',
      inspiration: 5,
      apnee: 0,
      expiration: 5,
    });
  });

  it('garde l’exercice personnalisé au bon index', () => {
    // L’index personnalisé est important car le controller peut s’appuyer dessus.
    expect(INDEX_CUSTOM).toBe(3);
    expect(EXERCICES[INDEX_CUSTOM].label).toBe('Personnalisé');
  });
});
