'use client';

import { useDashboard } from '@/controllers/dashboard.controller';
import { PhaseType } from '@/models/exercice_respiration.model';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface ExerciceUI {
  label: string;
  inspiration: number;
  apnee: number;
  expiration: number;
}

type ExerciceApi = {
  nom_exer: string;
  duree_inspiration_defaut_exer: number;
  duree_apnee_defaut_exer: number;
  duree_expiration_defaut_exer: number;
};

type EtapeRespiration = {
  phase: PhaseType | 'repos';
  duree: number;
  retirerCycle: boolean;
  terminer: boolean;
};

const EXERCICE_CUSTOM: ExerciceUI = {
  label: '🎛️ Personnalisé',
  inspiration: 4,
  apnee: 0,
  expiration: 4,
};

const convertirExercice = (exercice: ExerciceApi): ExerciceUI => ({
  label: exercice.nom_exer,
  inspiration: exercice.duree_inspiration_defaut_exer,
  apnee: exercice.duree_apnee_defaut_exer,
  expiration: exercice.duree_expiration_defaut_exer,
});

const calculerEtapeSuivante = (
  phase: PhaseType | 'repos',
  exercice: ExerciceUI,
  cyclesRestants: number
): EtapeRespiration => {
  if (phase === 'inspiration') {
    return exercice.apnee > 0
      ? { phase: 'apnee', duree: exercice.apnee, retirerCycle: false, terminer: false }
      : { phase: 'expiration', duree: exercice.expiration, retirerCycle: false, terminer: false };
  }

  if (phase === 'apnee') {
    return {
      phase: 'expiration',
      duree: exercice.expiration,
      retirerCycle: false,
      terminer: false,
    };
  }

  if (phase === 'expiration' && cyclesRestants > 1) {
    return {
      phase: 'inspiration',
      duree: exercice.inspiration,
      retirerCycle: true,
      terminer: false,
    };
  }

  return {
    phase: 'repos',
    duree: 0,
    retirerCycle: false,
    terminer: true,
  };
};

export function useRespiration() {
  const { estConnecte } = useDashboard();

  const [exercicesBDD, setExercicesBDD] = useState<ExerciceUI[]>([]);
  const [exerciceIndex, setExerciceIndex] = useState(0);
  const [actif, setActif] = useState(false);
  const [pause, setPause] = useState(false);
  const [phase, setPhase] = useState<PhaseType | 'repos'>('inspiration');
  const [nbCycles, setNbCycles] = useState(5);
  const [cyclesRestants, setCyclesRestants] = useState(0);
  const [dureeCustom, setDureeCustom] = useState({
    inspiration: 4,
    apnee: 0,
    expiration: 4,
  });
  const [chargement, setChargement] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const exercices = useMemo<ExerciceUI[]>(
    () => [...exercicesBDD, EXERCICE_CUSTOM],
    [exercicesBDD]
  );

  const indexCustomReel = exercices.length - 1;
  const estCustom = exerciceIndex === indexCustomReel;

  const exercice = useMemo(() => {
    if (estCustom && estConnecte) {
      return { ...EXERCICE_CUSTOM, ...dureeCustom };
    }

    return exercices[exerciceIndex] ?? exercices[0];
  }, [exerciceIndex, dureeCustom, estConnecte, exercices, estCustom]);

  const [compteur, setCompteur] = useState(exercice.inspiration);

  const nettoyerIntervalle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const chargerExercices = async () => {
    try {
      const res = await fetch('/api/exercices');
      const data = await res.json();
      const liste = Array.isArray(data?.data) ? data.data : [];

      setExercicesBDD(liste.map(convertirExercice));
    } catch {
      console.error('Erreur chargement exercices');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerExercices();
  }, []);

  useEffect(() => {
    if (!estConnecte && estCustom) {
      setExerciceIndex(0);
    }
  }, [estConnecte, estCustom]);

  useEffect(() => {
    if (!actif) {
      setCompteur(exercice.inspiration);
    }
  }, [actif, exercice.inspiration]);

  const demarrer = () => {
    setPhase('inspiration');
    setCompteur(exercice.inspiration);
    setCyclesRestants(nbCycles);
    setActif(true);
    setPause(false);
  };

  const arreter = () => {
    nettoyerIntervalle();
    setActif(false);
    setPhase('inspiration');
    setCompteur(exercice.inspiration);
  };

  const appliquerEtape = (etape: EtapeRespiration) => {
    if (etape.retirerCycle) {
      setCyclesRestants((cycles) => cycles - 1);
    }

    if (etape.terminer) {
      setActif(false);
    }

    setPhase(etape.phase);
  };

  const passerEtapeSuivante = () => {
    const etape = calculerEtapeSuivante(phase, exercice, cyclesRestants);
    appliquerEtape(etape);

    return etape.duree;
  };

  const decrementerCompteur = (valeurActuelle: number) => {
    return valeurActuelle > 1 ? valeurActuelle - 1 : passerEtapeSuivante();
  };

  useEffect(() => {
    if (!actif || pause) {
      nettoyerIntervalle();
      return;
    }

    intervalRef.current = setInterval(() => {
      setCompteur(decrementerCompteur);
    }, 1000);

    return nettoyerIntervalle;
  }, [actif, pause, phase, cyclesRestants, exercice]);

  const colors = useMemo(() => {
    switch (phase) {
      case 'inspiration':
        return { bg: '#dbeafe', text: '#3b82f6', circle: '#bfdbfe' };
      case 'apnee':
        return { bg: '#ffedd5', text: '#f97316', circle: '#fed7aa' };
      case 'expiration':
        return { bg: '#dcfce7', text: '#22c55e', circle: '#bbf7d0' };
      default:
        return { bg: '#f3f4f6', text: '#9ca3af', circle: '#e5e7eb' };
    }
  }, [phase]);

  return {
    exerciceIndex,
    setExerciceIndex,
    actif,
    pause,
    setPause,
    phase,
    compteur,
    cyclesRestants,
    exercices,
    indexCustomReel,
    estCustom,
    estConnecte,
    dureeCustom,
    setDureeCustom,
    nbCycles,
    setNbCycles,
    demarrer,
    arreter,
    colors,
    chargement,
  };
}