// ============================================================
// TESTS UNITAIRES — Module Exercices de Respiration
// Fichier : breathingExercise.test.ts
// Correspondance cahier : T-FUNC-11, T-FUNC-12
// ============================================================

import { describe, it, expect } from 'vitest'
import {
  calculateCycleDuration,
  validateExerciseConfig,
  getPhaseColor,
  validateExerciseName,
} from '../../src/utils/breathingExercise'

// ─── Calcul de la durée d'un cycle ───────────────────────────────────────
describe('calculateCycleDuration', () => {
  it('UT-36 : calcule la durée du cycle 748 (7+4+8 = 19s)', () => {
    // Exercice par défaut "748" : 7s inspiration, 4s apnée, 8s expiration
    expect(calculateCycleDuration(7, 4, 8)).toBe(19)
  })

  it('UT-37 : calcule la durée du cycle 55 (5+0+5 = 10s)', () => {
    // Exercice par défaut "55" : 5s inspiration, 0s apnée, 5s expiration
    expect(calculateCycleDuration(5, 0, 5)).toBe(10)
  })

  it('UT-38 : calcule la durée du cycle 46 (4+0+6 = 10s)', () => {
    // Exercice par défaut "46" : 4s inspiration, 0s apnée, 6s expiration
    expect(calculateCycleDuration(4, 0, 6)).toBe(10)
  })

  it('UT-39 : calcule la durée totale pour 2 cycles (T-FUNC-12, scénario 1)', () => {
    const dureeCycle = calculateCycleDuration(7, 4, 8)
    expect(dureeCycle * 2).toBe(38)
  })
})

// ─── Validation de la configuration ──────────────────────────────────────
describe('validateExerciseConfig', () => {
  it('UT-40 : accepte une configuration valide', () => {
    // T-FUNC-12 scénario 2 : rythme 4-4-6
    const result = validateExerciseConfig({
      inspiration: 4,
      apnee: 4,
      expiration: 6,
      cycles: 2,
    })
    expect(result.valid).toBe(true)
  })

  it('UT-41 : accepte une apnée à 0 (exercice "55")', () => {
    const result = validateExerciseConfig({
      inspiration: 5,
      apnee: 0,
      expiration: 5,
      cycles: 1,
    })
    expect(result.valid).toBe(true)
  })

  it('UT-42 : rejette une inspiration négative', () => {
    // Règle : durées d\'inspiration et d\'expiration doivent être positives
    const result = validateExerciseConfig({
      inspiration: -1,
      apnee: 0,
      expiration: 5,
      cycles: 1,
    })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('inspiration')
  })

  it('UT-43 : rejette une expiration à zéro', () => {
    const result = validateExerciseConfig({
      inspiration: 5,
      apnee: 0,
      expiration: 0,
      cycles: 1,
    })
    expect(result.valid).toBe(false)
  })

  it('UT-44 : rejette un nombre de cycles nul', () => {
    const result = validateExerciseConfig({
      inspiration: 5,
      apnee: 0,
      expiration: 5,
      cycles: 0,
    })
    expect(result.valid).toBe(false)
  })
})

// ─── Couleurs des phases ──────────────────────────────────────────────────
describe('getPhaseColor', () => {
  it('UT-45 : inspiration → bleu (#0091EA)', () => {
    // Charte graphique CESIZen : bleu pour l'inspiration
    expect(getPhaseColor('inspiration')).toBe('#0091EA')
  })

  it('UT-46 : apnée → jaune (#FFD600)', () => {
    expect(getPhaseColor('apnee')).toBe('#FFD600')
  })

  it('UT-47 : expiration → vert (#00C853)', () => {
    expect(getPhaseColor('expiration')).toBe('#00C853')
  })

  it('UT-48 : phase inconnue → retourne une valeur par défaut', () => {
    expect(getPhaseColor('inconnu')).toBeDefined()
  })
})

// ─── Validation du nom d'exercice ─────────────────────────────────────────
describe('validateExerciseName', () => {
  it('UT-49 : accepte un nom valide', () => {
    expect(validateExerciseName('Cohérence cardiaque')).toBe(true)
  })

  it('UT-50 : rejette un nom vide', () => {
    // Règle : le nom d'un exercice doit être unique et non vide
    expect(validateExerciseName('')).toBe(false)
  })

  it('UT-51 : rejette un nom uniquement d\'espaces', () => {
    expect(validateExerciseName('   ')).toBe(false)
  })
})
