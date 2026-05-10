import { supabase } from "../lib/supabase/supabase";
// Interface TypeScript de la table "configuration_exercice" de la base de données

export interface ConfigurationExercice {
    id_config: string,
    date_configuration_config: string | null,
    duree_inspiration_config: number,
    duree_apnee_config: number,
    duree_expiration_config: number,
    id_util: string | null,
    id_exer: string | null
}

export async function getConfigurationExerciceById(id_config: string) {

    const { data, error } = await supabase
        .from("configuration_exercice")
        .select("*")
        .eq("id_config", id_config)
        .single()

    if (error) {
        throw error
    }

    return data
}

export async function getAllConfigurationExercice() {

    const { data, error } = await supabase
        .from("configuration_exercice")
        .select("*")

    if (error) {
        throw error
    }

    return data
}

export async function createConfigurationExercice(configuration_exercice: {
    duree_inspiration_config: number,
    duree_apnee_config: number,
    duree_expiration_config: number,
    id_util: string | null,
    id_exer: string | null,
}) {

    const { data, error } = await supabase
        .from("configuration_exercice")
        .insert(configuration_exercice)
        .select("*")

    if (error) {
        throw error
    }

    return data
}

export async function updateConfigurationExercice(
    id_config: string,
    modifications: Partial<ConfigurationExercice>
) {

    const { data, error } = await supabase
        .from("configuration_exercice")
        .update(modifications)
        .eq("id_config", id_config)
        .select("*")

    if (error) {
        throw error
    }

    return data
}

export async function deleteConfigurationExercice(id_config: string) {

    const { data, error } = await supabase
        .from("configuration_exercice")
        .delete()
        .eq("id_config", id_config)

    if (error) {
        throw error
    }

    return data
}



