import { supabase } from "@/lib/supabase/supabase";

export interface Exercice {
  id_exer: string;
  nom_exer: string;
  description_exer: string;
  duree_inspiration_defaut_exer: number;
  duree_apnee_defaut_exer: number;
  duree_expiration_defaut_exer: number;
}

// Récupérer tous les exercices
export const getAllExercices = async (): Promise<Exercice[]> => {
  const { data, error } = await supabase.from('exercice_respiration').select('*').order('nom_exer');
  if (error) throw error;
  return data || [];
};

// Ajouter ou Modifier (Upsert)
export const saveExercice = async (exercice: Partial<Exercice>) => {
  const { data, error } = await supabase.from('exercice_respiration').upsert(exercice).select();
  if (error) throw error;
  return data[0];
};

// Supprimer
export const deleteExercice = async (id: string) => {
  const { error } = await supabase.from('exercice_respiration').delete().eq('id_exer', id);
  if (error) throw error;
  return true;
};