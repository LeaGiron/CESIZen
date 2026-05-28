import { supabase } from '@/lib/supabase';
import { PhaseType } from '@/models/respiration.model';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface ExerciceUI {
  label: string;
  inspiration: number;
  apnee: number;
  expiration: number;
}

type DureeCustom = {
  inspiration: number;
  apnee: number;
  expiration: number;
};

type ExerciceBDD = {
  nom_exer: string;
  duree_inspiration_defaut_exer: number;
  duree_apnee_defaut_exer: number;
  duree_expiration_defaut_exer: number;
};

const EXERCICE_CUSTOM: ExerciceUI = {
  label: 'Personnalisé',
  inspiration: 4,
  apnee: 0,
  expiration: 4,
};

const convertirExercice = (exercice: ExerciceBDD): ExerciceUI => ({
  label: exercice.nom_exer,
  inspiration: exercice.duree_inspiration_defaut_exer,
  apnee: exercice.duree_apnee_defaut_exer,
  expiration: exercice.duree_expiration_defaut_exer,
});

const calculerPhaseSuivante = (
  phase: PhaseType | 'repos',
  exercice: ExerciceUI,
  cyclesRestants: number
) => {
  if (phase === 'inspiration') {
    return exercice.apnee > 0
      ? { phase: 'apnee' as PhaseType, duree: exercice.apnee, terminerCycle: false, stop: false }
      : { phase: 'expiration' as PhaseType, duree: exercice.expiration, terminerCycle: false, stop: false };
  }

  if (phase === 'apnee') {
    return { phase: 'expiration' as PhaseType, duree: exercice.expiration, terminerCycle: false, stop: false };
  }

  if (phase === 'expiration' && cyclesRestants > 1) {
    return { phase: 'inspiration' as PhaseType, duree: exercice.inspiration, terminerCycle: true, stop: false };
  }

  return { phase: 'repos' as const, duree: 0, terminerCycle: false, stop: true };
};

export function useRespiration() {
  const [estConnecte, setEstConnecte] = useState(false);
  const [exercicesBDD, setExercicesBDD] = useState<ExerciceUI[]>([]);
  const [exerciceIndex, setExerciceIndex] = useState(0);
  const [chargement, setChargement] = useState(true);
  const [actif, setActif] = useState(false);
  const [pause, setPause] = useState(false);
  const [phase, setPhase] = useState<PhaseType | 'repos'>('inspiration');
  const [nbCycles, setNbCycles] = useState(5);
  const [cyclesRestants, setCyclesRestants] = useState(0);
  const [dureeCustom, setDureeCustom] = useState<DureeCustom>({
    inspiration: 4,
    apnee: 0,
    expiration: 4,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const verifierSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setEstConnecte(!!session);
    };

    verifierSession();
  }, []);

  useEffect(() => {
    const chargerExercices = async () => {
      try {
        const { data, error } = await supabase
          .from('exercice_respiration')
          .select(
            'nom_exer, duree_inspiration_defaut_exer, duree_apnee_defaut_exer, duree_expiration_defaut_exer'
          )
          .order('nom_exer', { ascending: true });

        if (error) {
          throw error;
        }

        setExercicesBDD((data ?? []).map(convertirExercice));
      } catch {
        setExercicesBDD([]);
      } finally {
        setChargement(false);
      }
    };

    chargerExercices();
  }, []);

  const exercices = useMemo<ExerciceUI[]>(
    () => [...exercicesBDD, EXERCICE_CUSTOM],
    [exercicesBDD]
  );

  const indexCustomReel = exercices.length - 1;
  const estCustom = exerciceIndex === indexCustomReel;

  useEffect(() => {
    if (!estConnecte && estCustom) {
      setExerciceIndex(0);
    }
  }, [estConnecte, estCustom]);

  const exercice = useMemo(() => {
    if (estCustom && estConnecte) {
      return { ...EXERCICE_CUSTOM, ...dureeCustom };
    }

    return exercices[exerciceIndex] ?? exercices[0];
  }, [estCustom, estConnecte, dureeCustom, exercices, exerciceIndex]);

  const [compteur, setCompteur] = useState(exercice.inspiration);

  useEffect(() => {
    if (!actif) {
      setCompteur(exercice.inspiration);
    }
  }, [exercice, actif]);

  const nettoyerIntervalle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

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

  const changerPhase = () => {
    const prochaineEtape = calculerPhaseSuivante(
      phase,
      exercice,
      cyclesRestants
    );

    if (prochaineEtape.terminerCycle) {
      setCyclesRestants((cycles) => cycles - 1);
    }

    if (prochaineEtape.stop) {
      setActif(false);
    }

    setPhase(prochaineEtape.phase);
    return prochaineEtape.duree;
  };

  useEffect(() => {
    if (!actif || pause) {
      nettoyerIntervalle();
      return;
    }

    intervalRef.current = setInterval(() => {
      setCompteur((compteurActuel) => {
        if (compteurActuel > 1) {
          return compteurActuel - 1;
        }

        return changerPhase();
      });
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
    nbCycles,
    setNbCycles,
    dureeCustom,
    setDureeCustom,
    demarrer,
    arreter,
    colors,
    chargement,
  };
}