import { supabase } from "../lib/supabase/supabase";
// Interface TypeScript de la table "log_activité" de la base de données

// Type pour les différentes catégories d'actions loggées
export type TypeActionLog = 
  'connexion' | 'déconnexion' | 'consultation_ressource' | 
  'creation_ressource' | 'modification_ressource' | 
  'configuration_exercice' | 'erreur_authentification' | 
  'creation_compte' | 'suppression_compte' | 'modification_profil' | 
  'consultation_profil' | 'inscription' | 'reinitialisation_mot_de_passe' | 
  'suppression_ressource' | 'archivage_ressource' | 'publication_ressource' | 
  'consultation_exercice' | 'creation_exercice' | 'modification_exercice' | 
  'suppression_exercice' | 'verrouillage_compte' | 'deverrouillage_compte' | 
  'desactivation_compte' | 'token_consulte' | 'token_cree' | 'token_supprime'

export interface LogActivite {
    id_log: string,
    type_action_log: TypeActionLog,
    ip_adresse_log: string | null,
    date_action_log: string,
    statut_log: 'succès' | 'échec' | 'bloque',
    id_util: string | null
}

export async function getLogActiviteById(id_log: string) {

    const { data, error } = await supabase
        .from("log_activite")
        .select("*")
        .eq("id_log", id_log)
        .single()

    if (error) {
        throw error
    }

    return data
}

export async function getLogActiviteByCategorie(type_action_log: TypeActionLog) {

    const { data, error } = await supabase
        .from("log_activite")
        .select("*")
        .eq("type_action_log", type_action_log)

    if (error) {
        throw error
    }

    return data
}


export async function getAllLogActivite() {

    const { data, error } = await supabase
        .from("log_activite")
        .select("*")

    if (error) {
        throw error
    }

    return data
}

export async function getLogActiviteByUtilisateur(id_util: string) {

    const { data, error } = await supabase
        .from("log_activite")
        .select("*")
        .eq("id_util", id_util)

    if (error) {
        throw error
    }

    return data
}

export async function createLogActivite(log_activite: {
    type_action_log: TypeActionLog,
    ip_adresse_log: string | null,
    statut_log: 'succès' | 'échec' | 'bloque',
    id_util: string | null
}) {

    const { data, error } = await supabase
        .from("log_activite")
        .insert(log_activite)
        .select("*")

    if (error) {
        throw error
    }

    return data
}


