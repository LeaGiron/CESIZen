import { useDashboard } from '@/controllers/useDashboard';
import { supabase } from '@/lib/supabase';
import { PhaseType } from '@/models/respiration.model';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface ExerciceUI {
  label: string;
  inspiration: number;
  apnee: number;
  expiration: number;
}

const EXERCICE_CUSTOM: ExerciceUI = {
  label: 'Personnalisé',
  inspiration: 4,
  apnee: 0,
  expiration: 4,
};

export function useRespiration() {
  const [estConnecte, setEstConnecte] = useState(false);

  useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setEstConnecte(!!session);
  });
}, []);

  const [exercicesBDD, setExercicesBDD] = useState<ExerciceUI[]>([]);
  const [exerciceIndex, setExerciceIndex] = useState(0);
  const [chargement, setChargement] = useState(true);

  const [actif, setActif] = useState(false);
  const [pause, setPause] = useState(false);
  const [phase, setPhase] = useState<PhaseType | 'repos'>('inspiration');
  const [nbCycles, setNbCycles] = useState(5);
  const [cyclesRestants, setCyclesRestants] = useState(0);
  const [dureeCustom, setDureeCustom] = useState({ inspiration: 4, apnee: 0, expiration: 4 });

  useEffect(() => {
    const charger = async () => {
      try {
        const { data, error } = await supabase
          .from('exercice_respiration')
          .select('nom_exer, duree_inspiration_defaut_exer, duree_apnee_defaut_exer, duree_expiration_defaut_exer')
          .order('nom_exer', { ascending: true });

        if (error) throw error;

        const liste = (data ?? []).map((ex: any) => ({
          label:       ex.nom_exer,
          inspiration: ex.duree_inspiration_defaut_exer,
          apnee:       ex.duree_apnee_defaut_exer,
          expiration:  ex.duree_expiration_defaut_exer,
        }));
        setExercicesBDD(liste);
      } catch (err) {
        console.error('Erreur chargement exercices:', err);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const exercices = useMemo<ExerciceUI[]>(() => [...exercicesBDD, EXERCICE_CUSTOM], [exercicesBDD]);
  
  const indexCustomReel = exercices.length - 1;
  const estCustom = exerciceIndex === indexCustomReel;

  useEffect(() => {
    if (!estConnecte && estCustom) setExerciceIndex(0);
  }, [estConnecte, estCustom]);

  const exercice = useMemo(() => {
    if (estCustom && estConnecte) return { ...EXERCICE_CUSTOM, ...dureeCustom };
    return exercices[exerciceIndex] ?? exercices[0];
  }, [exerciceIndex, dureeCustom, estConnecte, exercices]);

  const [compteur, setCompteur] = useState(exercice.inspiration);

  useEffect(() => {
    if (!actif) setCompteur(exercice.inspiration);
  }, [exercice, actif]);

  const intervalRef = useRef<any>(null);

  const demarrer = () => {
    setPhase('inspiration');
    setCompteur(exercice.inspiration);
    setCyclesRestants(nbCycles);
    setActif(true);
    setPause(false);
  };

  const arreter = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActif(false);
    setPhase('inspiration');
    setCompteur(exercice.inspiration);
  };

  useEffect(() => {
    if (!actif || pause) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCompteur((prev) => {
        if (prev > 1) return prev - 1;

        let prochainePhase: PhaseType | 'repos' = 'inspiration';
        let prochaineDuree = 0;

        if (phase === 'inspiration') {
          if (exercice.apnee > 0) { prochainePhase = 'apnee'; prochaineDuree = exercice.apnee; }
          else { prochainePhase = 'expiration'; prochaineDuree = exercice.expiration; }
        } else if (phase === 'apnee') {
          prochainePhase = 'expiration'; prochaineDuree = exercice.expiration;
        } else if (phase === 'expiration') {
          if (cyclesRestants > 1) {
            setCyclesRestants((c) => c - 1);
            prochainePhase = 'inspiration'; prochaineDuree = exercice.inspiration;
          } else {
            setActif(false);
            prochainePhase = 'repos';
            return 0;
          }
        }
        setPhase(prochainePhase);
        return prochaineDuree;
      });
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [actif, pause, phase, cyclesRestants, exercice]);

  const colors = useMemo(() => {
    switch (phase) {
      case 'inspiration': return { bg: '#dbeafe', text: '#3b82f6', circle: '#bfdbfe' };
      case 'apnee':       return { bg: '#ffedd5', text: '#f97316', circle: '#fed7aa' };
      case 'expiration':  return { bg: '#dcfce7', text: '#22c55e', circle: '#bbf7d0' };
      default:            return { bg: '#f3f4f6', text: '#9ca3af', circle: '#e5e7eb' };
    }
  }, [phase]);

  return {
    exerciceIndex, setExerciceIndex,
    actif, pause, setPause,
    phase, compteur, cyclesRestants,
    exercices, indexCustomReel,
    estCustom, estConnecte,
    nbCycles, setNbCycles,
    dureeCustom, setDureeCustom,
    demarrer, arreter,
    colors, chargement,
  };
}