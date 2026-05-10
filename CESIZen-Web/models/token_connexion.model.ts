import { supabase } from "../lib/supabase/supabase";
// Interface TypeScript de la table "token_connexion" de la base de données

export interface TokenConnexion {
    id_token: string,
    token_token: string,
    date_creation_token: string,
    date_expiration_token: string,
    est_actif_token: boolean,
    ip_adresse_token: string | null,
    id_util: string | null
}

export async function getTokenConnexionById(id_token: string) {

    const { data, error } = await supabase
        .from("token_connexion")
        .select("*")
        .eq("id_token", id_token)
        .single()

    if (error) {
        throw error
    }

    return data
}

export async function getAllTokenConnexion() {

    const { data, error } = await supabase
        .from("token_connexion")
        .select("*")

    if (error) {
        throw error
    }

    return data
}

export async function createTokenConnexion(token_connexion: {
    token_token: string,
    date_expiration_token: string,
    est_actif_token: boolean,
    ip_adresse_token: string | null,
    id_util: string | null
}) {

    const { data, error } = await supabase
        .from("token_connexion")
        .insert(token_connexion)
        .select("*")

    if (error) {
        throw error
    }

    return data
}

export async function updateTokenConnexion(
    id_token: string,
    modifications: Partial<TokenConnexion>
) {

    const { data, error } = await supabase
        .from("token_connexion")
        .update(modifications)
        .eq("id_token", id_token)
        .select("*")

    if (error) {
        throw error
    }

    return data
}

export async function deleteTokenConnexion(id_token: string) {

    const { data, error } = await supabase
        .from("token_connexion")
        .delete()
        .eq("id_token", id_token)

    if (error) {
        throw error
    }

    return data
}




