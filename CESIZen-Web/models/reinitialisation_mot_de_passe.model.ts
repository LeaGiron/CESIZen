import { supabase } from "../lib/supabase/supabase";
// Interface TypeScript de la table "reinitialisation_mot_de_passe" de la base de données

export interface ReinitialisationMotDePasse {
    id_reinit: string,
    token_reinit: string,
    date_demande_reinit: string,
    id_util: string | null
}

export async function getReinitialisationMotDePasseById(id_reinit: string) {

    const { data, error } = await supabase
        .from("reinitialisation_mot_de_passe")
        .select("*")
        .eq("id_reinit", id_reinit)
        .single()

    if (error) {
        throw error
    }

    return data
}

export async function getAllReinitialisationMotDePasse() {

    const { data, error } = await supabase
        .from("reinitialisation_mot_de_passe")
        .select("*")

    if (error) {
        throw error
    }

    return data
}

export async function createReinitialisationMotDePasse(reinitialisation_mot_de_passe: {
    token_reinit: string,
    id_util: string | null
}) {

    const { data, error } = await supabase
        .from("reinitialisation_mot_de_passe")
        .insert(reinitialisation_mot_de_passe)
        .select("*")

    if (error) {
        throw error
    }

    return data
}

export async function updateReinitialisationMotDePasse(
    id_reinit: string,
    modifications: Partial<ReinitialisationMotDePasse>
) {

    const { data, error } = await supabase
        .from("reinitialisation_mot_de_passe")
        .update(modifications)
        .eq("id_reinit", id_reinit)
        .select("*")

    if (error) {
        throw error
    }

    return data
}

export async function deleteReinitialisationMotDePasse(id_reinit: string) {

    const { data, error } = await supabase
        .from("reinitialisation_mot_de_passe")
        .delete()
        .eq("id_reinit", id_reinit)

    if (error) {
        throw error
    }

    return data
}




