// ============================================================
// src/utils/resourceValidation.ts
// Fonctions de validation — Module Informations
// ============================================================

/**
 * Valide le titre d'une ressource (non vide, non uniquement espaces).
 */
export function validateResourceTitle(title: string): boolean {
  return typeof title === 'string' && title.trim().length > 0
}

/**
 * Valide le contenu d'une ressource.
 * Règle CESIZen : max 50 000 caractères.
 */
export function validateResourceContent(content: string): boolean {
  if (!content || content.trim().length === 0) return false
  return content.length <= 50000
}

/**
 * Détermine si une ressource est visible pour un utilisateur donné.
 * Règle : seules les ressources "publication" sont visibles aux visiteurs/utilisateurs.
 * Les administrateurs voient toutes les ressources.
 */
export function isResourceVisible(statut: string, isAdmin: boolean): boolean {
  if (isAdmin) return true
  return statut === 'publication'
}

/**
 * Vérifie si l'utilisateur a le droit de modifier une ressource.
 * Règle : seul un administrateur peut modifier une ressource.
 */
export function canUserModifyResource(role: string | null): boolean {
  return role === 'administrateur'
}
