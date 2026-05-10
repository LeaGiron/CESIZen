import { supabase } from '@/lib/supabase';

export interface Ressource {
  id_ress: string;           
  titre_ress: string;        
  contenu_ress: string;       
  categorie_ress: string;   
  statut_ress: string;          
  date_creation_ress: string;
  id_util_auteur: string | null; 
}

/**
 * 📋 Lister toutes les ressources
 */
export async function listerToutesLesRessources() {
  const { data, error } = await supabase
    .from('ressource')
    .select('*');

  if (error) {
    console.error('Erreur SQL listerToutesLesRessources :', error.message);
    return { success: false, data: [] };
  }
  // On retourne un objet structuré pour que le controller sache si ça a réussi
  return { success: true, data: data || [] };
}

/**
 * 🔍 Obtenir une ressource par ID
 */
export async function getRessourceById(id_ress: string) {
  const { data, error } = await supabase
    .from('ressource')
    .select('*')
    .eq('id_ress', id_ress) 
    .single();

  if (error) throw error;
  return data;
}

/**
 * ➕ Créer une ressource
 */
export async function createRessource(ressource: any) {
  const { data, error } = await supabase
    .from('ressource')
    .insert([ressource])
    .select('*');

  if (error) throw error;
  return data;
}

/**
 * 📝 Modifier une ressource
 */
export async function updateRessource(id_ress: string, modifications: any) {
  const { data, error } = await supabase
    .from('ressource')
    .update(modifications)
    .eq('id_ress', id_ress)
    .select('*');

  if (error) throw error;
  return data;
}

/**
 * 🗑️ Supprimer une ressource
 */
export async function deleteRessource(id_ress: string) {
  const { data, error } = await supabase
    .from('ressource')
    .delete()
    .eq('id_ress', id_ress);

  if (error) throw error;
  return data;
}