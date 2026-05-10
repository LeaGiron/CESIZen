// ============================================================
// TESTS UNITAIRES — Module Comptes Utilisateurs
// Fichier : passwordValidation.test.ts
// Correspondance cahier : T-FUNC-01, T-FUNC-02, T-FUNC-05
// ============================================================

import { describe, it, expect } from 'vitest'
import {
  validatePassword,
  validateEmail,
  isAccountLocked,
  shouldLockAccount,
} from '../../src/utils/authValidation'

// ─── Validation du mot de passe ────────────────────────────────────────────
describe('validatePassword', () => {
  it('UT-01 : accepte un mot de passe valide (≥12 car, maj, min, chiffre, spécial)', () => {
    // Données : TestCESIZenJean1234@ (utilisé dans T-FUNC-01)
    expect(validatePassword('TestCESIZenJean1234@')).toBe(true)
  })

  it('UT-02 : rejette un mot de passe trop court (< 12 caractères)', () => {
    // Données : 1234 (scénario 6 de T-FUNC-01)
    expect(validatePassword('1234')).toBe(false)
  })

  it('UT-03 : rejette un mot de passe sans majuscule', () => {
    expect(validatePassword('testcesizen1234@')).toBe(false)
  })

  it('UT-04 : rejette un mot de passe sans minuscule', () => {
    expect(validatePassword('TESTCESIZEN1234@')).toBe(false)
  })

  it('UT-05 : rejette un mot de passe sans chiffre', () => {
    expect(validatePassword('TestCESIZenAbcd@')).toBe(false)
  })

  it('UT-06 : rejette un mot de passe sans caractère spécial', () => {
    expect(validatePassword('TestCESIZen1234')).toBe(false)
  })

  it('UT-07 : accepte exactement 12 caractères valides', () => {
    expect(validatePassword('TestCesi12@!')).toBe(true)
  })

  it('UT-08 : rejette une chaîne vide', () => {
    expect(validatePassword('')).toBe(false)
  })
})

// ─── Validation de l'email ────────────────────────────────────────────────
describe('validateEmail', () => {
  it('UT-09 : accepte un email valide', () => {
    // Données : jean.dupont@mail.com (utilisé dans T-FUNC-01)
    expect(validateEmail('jean.dupont@mail.com')).toBe(true)
  })

  it('UT-10 : rejette un email sans @', () => {
    // Données : testmail.com (scénario 5 de T-FUNC-01)
    expect(validateEmail('testmail.com')).toBe(false)
  })

  it('UT-11 : rejette un email sans domaine', () => {
    expect(validateEmail('jean.dupont@')).toBe(false)
  })

  it('UT-12 : rejette une chaîne vide', () => {
    expect(validateEmail('')).toBe(false)
  })

  it('UT-13 : accepte un email avec sous-domaine', () => {
    expect(validateEmail('contact@mail.cesizen.fr')).toBe(true)
  })
})

// ─── Verrouillage du compte ───────────────────────────────────────────────
describe('isAccountLocked', () => {
  it('UT-14 : compte non verrouillé si date_verrouillage est null', () => {
    // Règle : compte verrouillé 15 minutes après 5 tentatives échouées
    expect(isAccountLocked(null)).toBe(false)
  })

  it('UT-15 : compte verrouillé si le verrou date de moins de 15 minutes', () => {
    const recent = new Date(Date.now() - 5 * 60 * 1000) // il y a 5 min
    expect(isAccountLocked(recent)).toBe(true)
  })

  it('UT-16 : compte déverrouillé automatiquement après 15 minutes', () => {
    const old = new Date(Date.now() - 20 * 60 * 1000) // il y a 20 min
    expect(isAccountLocked(old)).toBe(false)
  })
})

describe('shouldLockAccount', () => {
  it('UT-17 : verrouille le compte après 5 tentatives échouées', () => {
    // Scénario 3 de T-FUNC-02
    expect(shouldLockAccount(5)).toBe(true)
  })

  it('UT-18 : ne verrouille pas avant 5 tentatives', () => {
    expect(shouldLockAccount(4)).toBe(false)
  })

  it('UT-19 : verrouille aussi au-delà de 5 tentatives', () => {
    expect(shouldLockAccount(6)).toBe(true)
  })
})
