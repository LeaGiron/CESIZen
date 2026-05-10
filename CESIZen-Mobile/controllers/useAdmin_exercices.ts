import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

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
  duree_inspiration_defaut_exer: 4,
  duree_apnee_defaut_exer: 4,
  duree_expiration_defaut_exer: 4,
};

export function useAdminExercices() {
  const [exercices, setExercices] = useState<ExerciceRespiration[]>([]);
  const [form, setForm] = useState<FormExercice>(FORM_VIDE);
  const [message, setMessage] = useState('');
  const [chargement, setChargement] = useState(true);
  const [idEnCoursEdition, setIdEnCoursEdition] = useState<string | null>(null);

  const afficherMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const chargerExercices = async () => {
    setChargement(true);
    try {
      const { data, error } = await supabase
        .from('exercice_respiration')
        .select('*')
        .order('nom_exer', { ascending: true });
      if (error) throw error;
      setExercices(data || []);
    } catch (err: any) {
      afficherMessage("❌ Erreur d'enregistrement");
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerExercices();
  }, []);

  const validerFormulaire = async () => {
    if (!form.nom_exer) {
      afficherMessage('⚠️ Nom requis');
      return;
    }

    try {
      if (idEnCoursEdition) {
        const { error } = await supabase
          .from('exercice_respiration')
          .update(form)
          .eq('id_exer', idEnCoursEdition);
        if (error) throw error;
        afficherMessage('✅ Mis à jour !');
      } else {
        const { error } = await supabase
          .from('exercice_respiration')
          .insert(form);
        if (error) throw error;
        afficherMessage('✅ Créé avec succès !');
      }
      annulerEdition();
      await chargerExercices();
    } catch (err: any) {
      afficherMessage("❌ Erreur d'enregistrement");
    }
  };

  const supprimerExercice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('exercice_respiration')
        .delete()
        .eq('id_exer', id);
      if (error) throw error;
      setExercices(prev => prev.filter(ex => ex.id_exer !== id));
      afficherMessage('✅ Supprimé');
    } catch (err) {
      afficherMessage('❌ Erreur suppression');
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
  };

  const annulerEdition = () => {
    setIdEnCoursEdition(null);
    setForm(FORM_VIDE);
  };

  return {
    exercices, form, setForm, message, chargement,
    idEnCoursEdition, validerFormulaire, supprimerExercice,
    preparerModification, annulerEdition
  };
}