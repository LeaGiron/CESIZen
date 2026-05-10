/**
 * Types liés à l'exercice de respiration.
 * L'état 'repos' est ajouté pour gérer l'écran de fin d'exercice.
 */
export type PhaseType = 'inspiration' | 'apnee' | 'expiration' | 'repos';

export interface Exercice {
  label: string;
  inspiration: number;
  apnee: number;
  expiration: number;
}

/**
 * Liste des exercices prédéfinis.
 * On utilise 'as const' pour garantir que ces valeurs ne changeront pas
 * et permettre une meilleure inférence de type si besoin.
 */
export const EXERCICES: Exercice[] = [
  { label: '5-0-5 (Relaxation)', inspiration: 5, apnee: 0, expiration: 5 },
  { label: '4-0-6 (Anti-stress)', inspiration: 4, apnee: 0, expiration: 6 },
  { label: '7-4-8 (Apaisement)', inspiration: 7, apnee: 4, expiration: 8 },
  { label: '🎛️ Personnalisé', inspiration: 4, apnee: 0, expiration: 4 },
];

/**
 * L'index de l'exercice personnalisable dans le tableau ci-dessus.
 */
export const INDEX_CUSTOM = 3;

/**
 * Optionnel : Un objet de configuration pour les textes ou couleurs
 * utilisables directement dans tes composants Web.
 */
export const PHASE_METADATA: Record<PhaseType, { label: string; colorClass: string }> = {
  inspiration: { label: 'Inspirez', colorClass: 'text-blue-500' },
  apnee: { label: 'Retenez', colorClass: 'text-orange-500' },
  expiration: { label: 'Expirez', colorClass: 'text-green-500' },
  repos: { label: 'Terminé', colorClass: 'text-gray-400' },
};