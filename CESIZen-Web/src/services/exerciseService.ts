import { supabase } from '../../lib/supabase/supabase'

export async function getExercises() {
  const { data, error } = await supabase
    .from('exercice_respiration')
    .select('id, nom, description, duree_inspiration_defaut, duree_apnee_defaut, duree_expiration_defaut')
    .order('id', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function saveUserConfig(config: {
  id_util: number; id_exer: number
  duree_inspiration: number; duree_apnee: number; duree_expiration: number
}) {
  const { data, error } = await supabase
    .from('configuration_exercice').insert(config).single()
  if (error) throw error
  return data
}