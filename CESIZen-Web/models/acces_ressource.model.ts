import { supabase } from "../lib/supabase/supabase";
// Interface TypeScript de la table "acces_ressource" de la base de données

export interface AccesRessource {
    id_acc: string,
    date_acc: string,
    id_util: string | null,
    id_ress: string | null
}

export async function getAccesRessourceById(id_util: string, id_ress: string) {

    const { data, error } = await supabase
        .from("acces_ressource")
        .select("*")
        .eq("id_util", id_util)
        .eq("id_ress", id_ress)
        .single()

    if (error) {
        throw error
    }

    return data
}

export async function getAllAccesRessource() {

    const { data, error } = await supabase
        .from("acces_ressource")
        .select("*")

    if (error) {
        throw error
    }

    return data
}

export async function createAccesRessource(acces_ressource: {
    id_util: string | null,
    id_ress: string | null
}) {

    const { data, error } = await supabase
        .from("acces_ressource")
        .insert(acces_ressource)
        .select("*")

    if (error) {
        throw error
    }

    return data
}

export async function updateAccesRessource(
    id_util: string,
    id_ress: string,
    modifications: Partial<AccesRessource>
) {

    const { data, error } = await supabase
        .from("acces_ressource")
        .update(modifications)
        .eq("id_util", id_util)
        .eq("id_ress", id_ress)
        .select("*")

    if (error) {
        throw error
    }

    return data
}

export async function deleteAccesRessource(id_util: string, id_ress: string) {

    const { data, error } = await supabase
        .from("acces_ressource")
        .delete()
        .eq("id_util", id_util)
        .eq("id_ress", id_ress)

    if (error) {
        throw error
    }

    return data
}




