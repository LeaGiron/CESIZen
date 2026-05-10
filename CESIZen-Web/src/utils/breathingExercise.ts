// ============================================================
// src/utils/breathingExercise.ts
// Fonctions métier — Module Exercices de Respiration
// ============================================================

type Phase = 'inspiration' | 'apnee' | 'expiration' | string

interface ExerciseConfig {
  inspiration: number
  apnee: number
  expiration: number
  cycles: number
}

interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Calcule la durée totale d'un cycle de respiration en secondes.
 */
export function calculateCycleDuration(
  inspiration: number,
  apnee: number,
  expiration: number
): number {
  return inspiration + apnee + expiration
}

/**
 * Valide une configuration d'exercice personnalisée.
 * Règles CESIZen :
 * - Inspiration et expiration doivent être > 0
 * - Apnée peut être = 0
 * - Le nombre de cycles doit être > 0
 */
export function validateExerciseConfig(config: ExerciseConfig): ValidationResult {
  if (config.inspiration <= 0) {
    return { valid: false, error: 'La durée d\'inspiration doit être positive' }
  }
  if (config.expiration <= 0) {
    return { valid: false, error: 'La durée d\'expiration doit être positive' }
  }
  if (config.apnee < 0) {
    return { valid: false, error: 'La durée d\'apnée ne peut pas être négative' }
  }
  if (config.cycles <= 0) {
    return { valid: false, error: 'Le nombre de cycles doit être supérieur à 0' }
  }
  return { valid: true }
}

/**
 * Retourne la couleur associée à chaque phase de respiration.
 * Charte graphique CESIZen :
 * - Inspiration : #0091EA (bleu)
 * - Apnée       : #FFD600 (jaune)
 * - Expiration  : #00C853 (vert)
 */
export function getPhaseColor(phase: Phase): string {
  const colors: Record<string, string> = {
    inspiration: '#0091EA',
    apnee:       '#FFD600',
    expiration:  '#00C853',
  }
  return colors[phase] ?? '#CCCCCC'
}

/**
 * Valide le nom d'un exercice de respiration.
 * Règle : non vide, non uniquement espaces.
 */
export function validateExerciseName(name: string): boolean {
  return typeof name === 'string' && name.trim().length > 0
}
