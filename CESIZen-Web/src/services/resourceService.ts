import { supabase } from '../../lib/supabase/supabase'

export async function getPublishedResources() {
  const { data, error } = await supabase
    .from('ressource')
    .select('id, titre, statut, categorie, date_creation')
    .eq('statut', 'publication')
    .order('date_creation', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createResource(payload: {
  titre: string; contenu: string; categorie: string
  statut: string; id_util_auteur: number
}) {
  const { data, error } = await supabase
    .from('ressource').insert(payload).single()
  if (error) throw error
  return data
}