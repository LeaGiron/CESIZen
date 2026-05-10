import { supabase } from '../../lib/supabase/supabase'

export async function getUserById(id: number) {
  const { data, error } = await supabase
    .from('utilisateur')
    .select('id, nom, prenom, email, type, statut_compte, tentatives_connexion, date_verrouillage')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createUser(payload: {
  nom: string; prenom: string; email: string; mot_de_passe: string
}) {
  const { data, error } = await supabase
    .from('utilisateur').insert(payload).single()
  if (error) throw error
  return data
}

export async function deleteUser(id: number) {
  const { error } = await supabase.from('utilisateur').delete().eq('id', id)
  if (error) throw error
}