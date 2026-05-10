// ============================================================
// src/utils/authValidation.ts
// Fonctions de validation — Module Comptes Utilisateurs
// ============================================================

/**
 * Valide la complexité du mot de passe selon les règles CESIZen :
 * - Minimum 12 caractères
 * - Au moins une majuscule
 * - Au moins une minuscule
 * - Au moins un chiffre
 * - Au moins un caractère spécial (@$!%*?&)
 */
export function validatePassword(password: string): boolean {
  if (!password || password.length < 12) return false
  const hasUpperCase   = /[A-Z]/.test(password)
  const hasLowerCase   = /[a-z]/.test(password)
  const hasNumber      = /[0-9]/.test(password)
  const hasSpecialChar = /[@$!%*?&]/.test(password)
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
}

/**
 * Valide le format d'une adresse email.
 */
export function validateEmail(email: string): boolean {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Détermine si un compte est verrouillé.
 * Règle : verrouillé pendant 15 minutes après 5 tentatives échouées.
 */
export function isAccountLocked(lockedAt: Date | null): boolean {
  if (!lockedAt) return false
  const LOCK_DURATION_MS = 15 * 60 * 1000 // 15 minutes
  return Date.now() - lockedAt.getTime() < LOCK_DURATION_MS
}

/**
 * Détermine si le compte doit être verrouillé.
 * Règle : verrouillage après 5 tentatives échouées.
 */
export function shouldLockAccount(failedAttempts: number): boolean {
  return failedAttempts >= 5
}
