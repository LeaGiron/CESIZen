import * as TokenConnexionModel from "../models/token_connexion.model";
import * as LogActiviteModel from "../models/log_activite.model";

// Vérifier un token
export async function afficherTokenConnexion(id_token: string, id_util: string) {
    try {
        // Vérifier qu'il existe au moins 1 token
        const token = await TokenConnexionModel.getTokenConnexionById(id_token);
        if (!token) {
            return { success: false, message: "Il n'y a aucun token de connexion. "};
        }

        // Créer un log d'activité
        await LogActiviteModel.createLogActivite({ 
            type_action_log: "token_consulte",
            statut_log: "succès", 
            id_util: id_util, 
            ip_adresse_log: null 
        });

        // Retourner les tokens
        return {
            success: true, data: token, message: "Voici la liste de l'ensemble des tokens de connexion."
        }
    } catch (error) {
        // Si la bdd est inaccessible
        console.error("Erreur getTokenConnexionById", error);
        return {
            success: false,
            message: "Erreur lors de la récupération des tokens. Veuillez réessayer plus tard."
        };
    }
}

// Créer un token
export async function createTokenConnexion(id_util: string) {
    try {
        // Créer un token
        const token = await TokenConnexionModel.createTokenConnexion({
            token_token: crypto.randomUUID(),
            // Le token expire dans 24h à partir de Date.now()
            date_expiration_token: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            est_actif_token: true,
            ip_adresse_token: null,
            id_util: id_util
        }); 
        if (!token) {
            return { success: false, message: "Token de connexion introuvable." };
        }

        // Créer un log d'activité
        await LogActiviteModel.createLogActivite({ 
            type_action_log: "token_cree",
            statut_log: "succès", 
            id_util: id_util, 
            ip_adresse_log: null 
    });

        // Retourner le token créé
        return {
            success: true, data: token, message: "Token de connexion créé."
        }
    } catch (error) {
        // Si la bdd est inaccessible
        console.error("Erreur createTokenConnexion", error);
        return {
            success: false,
            message: "Erreur lors de la création du token. Veuillez réessayer plus tard."
        };
    }
}

// Supprimer un token
export async function deleteTokenConnexion(id_token: string, id_util: string) {
    try {
        // Supprimer un token
        const token = await TokenConnexionModel.deleteTokenConnexion(id_token)
        if (!token) {
            return { success: false, message: "Token inexistant." };
        }

        // Créer un log d'activité
        await LogActiviteModel.createLogActivite({ 
            type_action_log: "token_supprime", 
            statut_log: "succès", 
            id_util: id_util, 
            ip_adresse_log: null 
    });

        // Retourner le token créé
        return {
            success: true, data: token, message: "Token supprimé."
        }
    } catch (error) {
        // Si la bdd est inaccessible
        console.error("Erreur deleteTokenConnexion", error);
        return {
            success: false,
            message: "Erreur lors de la suppression du token. Veuillez réessayer plus tard."
        };
    }
}


