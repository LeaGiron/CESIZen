// ============================================================
// TESTS UNITAIRES — Module Informations (Ressources)
// Fichier : resourceValidation.test.ts
// Correspondance cahier : T-FUNC-07, T-FUNC-08, T-FUNC-09, T-FUNC-10
// ============================================================

import { describe, it, expect } from 'vitest'
import {
  validateResourceTitle,
  validateResourceContent,
  isResourceVisible,
  canUserModifyResource,
} from '../../src/utils/resourceValidation'

// ─── Validation du titre ──────────────────────────────────────────────────
describe('validateResourceTitle', () => {
  it('UT-20 : accepte un titre valide', () => {
    expect(validateResourceTitle('Gérer son stress au quotidien')).toBe(true)
  })

  it('UT-21 : rejette un titre vide', () => {
    expect(validateResourceTitle('')).toBe(false)
  })

  it('UT-22 : rejette un titre uniquement composé d\'espaces', () => {
    expect(validateResourceTitle('   ')).toBe(false)
  })

  it('UT-23 : accepte un titre long (< 100 caractères)', () => {
    const titre = 'A'.repeat(99)
    expect(validateResourceTitle(titre)).toBe(true)
  })
})

// ─── Validation du contenu ────────────────────────────────────────────────
describe('validateResourceContent', () => {
  it('UT-24 : accepte un contenu valide', () => {
    expect(validateResourceContent('Voici des conseils pour gérer le stress...')).toBe(true)
  })

  it('UT-25 : rejette un contenu vide', () => {
    expect(validateResourceContent('')).toBe(false)
  })

  it('UT-26 : rejette un contenu dépassant 50 000 caractères', () => {
    // Règle du cahier des charges : max 50 000 caractères
    const trop_long = 'A'.repeat(50001)
    expect(validateResourceContent(trop_long)).toBe(false)
  })

  it('UT-27 : accepte exactement 50 000 caractères', () => {
    const limite = 'A'.repeat(50000)
    expect(validateResourceContent(limite)).toBe(true)
  })
})

// ─── Visibilité des ressources ────────────────────────────────────────────
describe('isResourceVisible', () => {
  it('UT-28 : une ressource publiée est visible par tous', () => {
    // Règle : seules les ressources "publication" sont visibles aux visiteurs
    expect(isResourceVisible('publication', false)).toBe(true)
  })

  it('UT-29 : une ressource en rédaction est invisible aux visiteurs', () => {
    expect(isResourceVisible('redaction', false)).toBe(false)
  })

  it('UT-30 : une ressource en rédaction est visible à l\'administrateur', () => {
    expect(isResourceVisible('redaction', true)).toBe(true)
  })

  it('UT-31 : une ressource archivée est invisible aux visiteurs', () => {
    expect(isResourceVisible('archivage', false)).toBe(false)
  })

  it('UT-32 : une ressource archivée est visible à l\'administrateur', () => {
    expect(isResourceVisible('archivage', true)).toBe(true)
  })
})

// ─── Droits de modification ───────────────────────────────────────────────
describe('canUserModifyResource', () => {
  it('UT-33 : un administrateur peut modifier une ressource', () => {
    expect(canUserModifyResource('administrateur')).toBe(true)
  })

  it('UT-34 : un utilisateur standard ne peut pas modifier une ressource', () => {
    expect(canUserModifyResource('utilisateur')).toBe(false)
  })

  it('UT-35 : un visiteur anonyme ne peut pas modifier une ressource', () => {
    expect(canUserModifyResource(null)).toBe(false)
  })
})
