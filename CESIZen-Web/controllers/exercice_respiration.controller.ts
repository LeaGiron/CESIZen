import { getAllExercices, saveExercice, deleteExercice } from '@/models/exercice.model';

export async function afficherExercices() {
  try {
    const data = await getAllExercices();
    return { success: true, data };
  } catch (error: any) {
    console.error('afficherExercices error:', error);
    return { success: false, message: error.message };
  }
}

export async function creerExercice(id_util: string, exercice: {
  nom_exer: string;
  description_exer: string;
  duree_inspiration_defaut_exer: number;
  duree_apnee_defaut_exer: number;
  duree_expiration_defaut_exer: number;
}) {
  try {
    const data = await saveExercice(exercice);
    return { success: true, data };
  } catch (error: any) {
    console.error('creerExercice error:', error);
    return { success: false, message: error.message };
  }
}

export async function modifierExercice(id_exer: string, id_util: string, exercice: {
  nom_exer: string;
  description_exer: string;
  duree_inspiration_defaut_exer: number;
  duree_apnee_defaut_exer: number;
  duree_expiration_defaut_exer: number;
}) {
  try {
    const data = await saveExercice({ id_exer, ...exercice });
    return { success: true, data };
  } catch (error: any) {
    console.error('modifierExercice error:', error);
    return { success: false, message: error.message };
  }
}

export async function supprimerExercice(id_exer: string, id_util: string) {
  try {
    await deleteExercice(id_exer);
    return { success: true };
  } catch (error: any) {
    console.error('supprimerExercice error:', error);
    return { success: false, message: error.message };
  }
}
