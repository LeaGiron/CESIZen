export type PhaseType = 'inspiration' | 'apnee' | 'expiration' | 'repos';

export interface Exercice {
  label: string;
  inspiration: number;
  apnee: number;
  expiration: number;
}

export const EXERCICES: Exercice[] = [
  { label: '5-0-5 (Relaxation)', inspiration: 5, apnee: 0, expiration: 5 },
  { label: '4-0-6 (Anti-stress)', inspiration: 4, apnee: 0, expiration: 6 },
  { label: '7-4-8 (Apaisement)', inspiration: 7, apnee: 4, expiration: 8 },
  { label: 'Personnalisé', inspiration: 4, apnee: 0, expiration: 4 },
];

export const INDEX_CUSTOM = 3;