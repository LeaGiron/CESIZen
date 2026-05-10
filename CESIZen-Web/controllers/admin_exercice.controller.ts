'use client';

import { useState, useEffect } from 'react';

export interface ExerciceRespiration {
  id_exer: string;
  nom_exer: string;
  description_exer: string;
  duree_inspiration_defaut_exer: number;
  duree_apnee_defaut_exer: number;
  duree_expiration_defaut_exer: number;
}

type FormExercice = Omit<ExerciceRespiration, 'id_exer'>;

const FORM_VIDE: FormExercice = {
  nom_exer: '',
  description_exer: '',
  duree_inspiration_defaut_exer: 0,
  duree_apnee_defaut_exer: 0,
  duree_expiration_defaut_exer: 0,
};

async function logAction(type: string, statut: 'succès' | 'échec') {
  try {
    const { createBrowserClient } = await import('@supabase/ssr');
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('log_activite').insert({
      type_action_log: type,
      statut_log: statut,
      id_util: user?.id ?? null,
    });
  } catch {}
}

export function useAdminExercices() {
  const [exercices, setExercices] = useState<ExerciceRespiration[]>([]);
  const [form, setForm] = useState<FormExercice>(FORM_VIDE);
  const [idEnCoursEdition, setIdEnCoursEdition] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [chargement, setChargement] = useState(true);

  const afficherMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  useEffect(() => {
    chargerExercices();
  }, []);

  const chargerExercices = async () => {
    setChargement(true);
    try {
      const res = await fetch('/api/admin/lister-exercice');
      const data = await res.json();
      if (res.ok) setExercices(data);
      else afficherMessage('❌ Erreur lors du chargement');
    } catch {
      afficherMessage('❌ Erreur réseau');
    } finally {
      setChargement(false);
    }
  };

  const validerFormulaire = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = idEnCoursEdition
      ? '/api/admin/modifier-exercice'
      : '/api/admin/creer-exercice';

    const body = idEnCoursEdition
      ? { id_exer: idEnCoursEdition, ...form }
      : form;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        afficherMessage(`❌ ${data.error}`);
        await logAction('configuration_exercice', 'échec');
        return;
      }

      await logAction('configuration_exercice', 'succès');
      afficherMessage(idEnCoursEdition ? '✅ Exercice modifié' : '✅ Exercice créé');
      annulerEdition();
      await chargerExercices();
    } catch {
      afficherMessage('❌ Erreur réseau');
    }
  };

  const supprimerExercice = async (id: string) => {
    if (!confirm('Supprimer cet exercice ?')) return;

    try {
      const res = await fetch('/api/admin/supprimer-exercice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_exer: id }),
      });

      const data = await res.json();

      if (!res.ok) {
        afficherMessage(`❌ ${data.error}`);
        return;
      }

      afficherMessage('✅ Exercice supprimé');
      setExercices(prev => prev.filter(ex => ex.id_exer !== id));
    } catch {
      afficherMessage('❌ Erreur réseau');
    }
  };

  const preparerModification = (ex: ExerciceRespiration) => {
    setIdEnCoursEdition(ex.id_exer);
    setForm({
      nom_exer: ex.nom_exer,
      description_exer: ex.description_exer,
      duree_inspiration_defaut_exer: ex.duree_inspiration_defaut_exer,
      duree_apnee_defaut_exer: ex.duree_apnee_defaut_exer,
      duree_expiration_defaut_exer: ex.duree_expiration_defaut_exer,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const annulerEdition = () => {
    setIdEnCoursEdition(null);
    setForm(FORM_VIDE);
  };

  return {
    exercices,
    form,
    setForm,
    message,
    chargement,
    idEnCoursEdition,
    validerFormulaire,
    supprimerExercice,
    preparerModification,
    annulerEdition,
  };
}
