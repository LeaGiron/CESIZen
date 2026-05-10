import { supabase } from "../lib/supabase/supabase";
// Interface TypeScript de la table "utilisateur" de la base de données

export interface Utilisateur {
    id_util: string,
    nom_util: string,
    prenom_util: string,
    email_util: string,
    type_util: 'Utilisateur' | 'Administrateur',
    statut_compte_util: 'actif' | 'inactif' | 'verrouillé',
    date_creation_util: string | null,
    tentatives_connexion_util: number | null,
    date_verrouillage_util: string | null,
    derniere_connexion_util: string | null,
}

// export : utiliser la fonction dans d'autres fichiers
// async : fonction asynchrone qui appelle la bdd
// ID: string : la fonction attend un paramètre id de type texte
export async function getUtilisateurById(id_util: string) {

    // supabase retourne les résultats et l'erreur
    const { data, error } = await supabase
        .from("utilisateur")
        .select("*")
        .eq("id_util", id_util)
        .single()

    // si erreur trouvée, elle est renvoyée au controller
    if (error) {
        throw error
    }

    return data

}

export async function getAllUtilisateurs() {

    const { data, error } = await supabase
        .from("utilisateur")
        .select("*")
	// le modèle remonte l'erreur au contrôleur qui l'affiche à l'utilisateur
    if (error) {
        throw error
    }

    return data
}

export async function getUtilisateurByEmail(email_util: string) {

    const { data, error } = await supabase
        .from("utilisateur")
        .select("*")
        .eq("email_util", email_util)
        .single()
// le modèle remonte l'erreur au contrôleur qui l'affiche à l'utilisateur
    if (error) {
        throw error
    }

    return data

}

export async function createUtilisateur(utilisateur: {
    nom_util: string,
    prenom_util: string,
    email_util: string,
    type_util: 'Utilisateur' | 'Administrateur',
    statut_compte_util: 'actif' | 'inactif' | 'verrouillé',
    tentatives_connexion_util: number,
    date_verrouillage_util: string | null,
    derniere_connexion_util: string | null,
}) {
   
    const { data, error } = await supabase
        .from("utilisateur")
        .insert(utilisateur)
        .select() // récupérer l'utilisateur créé

    if (error) {
        throw error
    }

    return data
}

export async function updateUtilisateur(
    id_util: string,
    modifications: Partial<Utilisateur> // utilitaire TypeScript qui rend tous les champs optionnels -> maj des champs souhaités uniquement, TypeScript vérifie juste que les champs existent.
) {

    const { data, error } = await supabase
        .from("utilisateur")
        .update(modifications)
        .eq("id_util", id_util)
        .select("*") // récupérer l'utilisateur mis à jour

    if (error) {
        throw error
    }

    return data
}

export async function deleteUtilisateur(id_util: string) {

    const { data, error } = await supabase
        .from("utilisateur")
        .delete()
        .eq("id_util", id_util)

    if (error) {
        throw error
    }

    return data
}





