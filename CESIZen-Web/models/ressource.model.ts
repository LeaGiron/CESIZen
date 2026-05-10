import { supabase } from "../lib/supabase/supabase";
// Interface TypeScript de la table "ressource" de la base de données

export interface Ressource {
    id_ress: string,
    titre_ress: string,
    contenu_ress: string,
    categorie_ress: 'Stress' | 'Sommeil' | 'Autre',
    statut_ress: 'publie' | 'brouillon' | 'archive',
    date_creation_ress: string,
    date_modification_ress: string, 
    id_util_auteur: string | null,
}

export async function getRessourceById(id_ress: string) {

    const { data, error } = await supabase
        .from("ressource")
        .select("*")
        .eq("id_ress", id_ress)
        .single()

    if (error) {
        throw error
    }

    return data
}

export async function getAllRessources() {
    const { data, error } = await supabase
        .from("ressource")
        .select("*")
    
    // Affiche l'erreur complète si elle existe
    if (error) {
        console.error("Erreur getAllRessources :", error);
        throw new Error(`${error.code} - ${error.message} - ${error.details} - ${error.hint}`);
    }
    
    return data
}

export async function getRessourcesByCategorie(categorie_ress: 'Stress' | 'Sommeil' | 'Autre') {
    const { data, error } = await supabase
        .from("ressource")
        .select("*")
        .eq("categorie_ress", categorie_ress)

    // le modèle remonte l'erreur au contrôleur qui l'affiche à l'utilisateur
    if (error) {
        throw error
    }

    return data
}

export async function getAllCategories() {
    // Récupérer la colonne categorie_ress de toutes les ressources
    const { data, error } = await supabase
        .from("ressource")
        .select("categorie_ress")
    if (error) throw error
    // data.map() extraire la valeur de categorie_ress de chaque ressource
    // new Set() supprimer les doublons
    const categoriesUniques = [...new Set(data.map((r: { categorie_ress: string }) => r.categorie_ress))]
    return categoriesUniques
}

export async function createRessource(ressource: {
    titre_ress: string,
    contenu_ress: string,
    categorie_ress: 'Stress' | 'Sommeil' | 'Autre',
    statut_ress: 'publie' | 'brouillon' | 'archive',
    date_creation_ress: string,
    date_modification_ress: string,
    id_util_auteur: string | null,
}) {

    const { data, error } = await supabase
        .from("ressource")
        .insert(ressource)
        .select("*") // récupérer la ressource créée

    if (error) {
        throw error
    }

    return data
}

export async function updateRessource(
    id_ress: string,
    modifications: Partial<Ressource> // utilitaire TypeScript qui rend tous les champs optionnels -> maj des champs souhaités uniquement, TypeScript vérifie juste que les champs existent.
) {

    const { data, error } = await supabase
        .from("ressource")
        .update(modifications)
        .eq("id_ress", id_ress)
        .select("*") // récupérer la ressource créée

    if (error) {
        throw error
    }

    return data
}

export async function deleteRessource(id_ress: string) {

    const { data, error } = await supabase
        .from("ressource")
        .delete()
        .eq("id_ress", id_ress)

    if (error) {
        throw error
    }

    return data
}





