import * as LogActiviteModel from "../models/log_activite.model";
import { TypeActionLog } from "../models/log_activite.model";

// Afficher les logs par utilisateur
export async function afficherLogs(id_util: string) {
    try {

        // Vérifier qu'il existe au moins 1 log
        const logs = await LogActiviteModel.getLogActiviteByUtilisateur(id_util);
        if (logs.length === 0) {
            return { success: false, message: "Il n'y a aucun log. "};
        }

        // Créer un log d'activité sur la consultation
        await LogActiviteModel.createLogActivite({ 
            type_action_log: "consultation_profil", 
            statut_log: "succès", 
            id_util: id_util, 
            ip_adresse_log: null 
        });

        // Retourner les résultats
        return {
            success: true, data: logs, message: "Voici la liste de l'ensemble des logs."
        }

    } catch (error) {
        // Si la bdd est inaccessible
        console.error("Erreur getLogActiviteByUtilisateur", error);
        return {
            success: false,
            message: "Erreur lors de la récupération des logs. Veuillez réessayer plus tard."
        };
    }
}

// Afficher tous les logs (admin uniquement)
export async function getAllLogActivite(id_util: string) {
    try {
        // Récupérer tous les logs
        const logs = await LogActiviteModel.getAllLogActivite();

        // Si aucun log trouvé
        if (logs.length === 0) {
            return { success: true, data: [], message: "Aucun log disponible." };
        }

        // Tracer la consultation dans les logs
        await LogActiviteModel.createLogActivite({ 
            type_action_log: "consultation_profil", 
            statut_log: "succès", 
            id_util: id_util, 
            ip_adresse_log: null 
        });

        return { success: true, data: logs };

    } catch (error) {
        // Si la bdd est inaccessible
        console.error("Erreur getAllLogActivite :", error);
        return { success: false, message: "Erreur lors de la récupération des logs." };
    }
}

// Afficher les logs par catégorie
export async function afficherLogsParCategorie(type_action_log: TypeActionLog, id_util: string) {
    try {
        // Vérifier qu'il existe au moins 1 log
        const logs = await LogActiviteModel.getLogActiviteByCategorie(type_action_log);
        if (logs.length === 0) {
            return { success: false, message: "Il n'y a aucun log. "};
        }

        // Créer un log d'activité
        await LogActiviteModel.createLogActivite({ 
            type_action_log: "consultation_profil", 
            statut_log: "succès", 
            id_util: id_util, 
            ip_adresse_log: null 
        });

        // Retourner le résultat
        return {
            success: true, data: logs, message: "Voici les logs filtrés par catégories."
        }
       
    } catch (error) {
        console.error("Erreur getLogActiviteByCategorie :", error);
        return {
            success: false,
            message: "Erreur lors de la récupération des logs filtrés par catégories. Veuillez réessayer plus tard."
        };
    }
}
