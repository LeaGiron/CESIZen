import * as UtilisateurModel from "../models/utilisateur.model";
import * as LogActiviteModel from "../models/log_activite.model";
import { Utilisateur } from "../models/utilisateur.model";

// Afficher le profil de l'utilisateur
export async function afficherProfil(id_util: string) {
    try {
        // Appeler le modèle
        const user = await UtilisateurModel.getUtilisateurById(id_util);

        // Test 1 : est-ce que l'utilisateur existe ?
        if (!user) {
            return { success: false, message: "Le compte n'existe pas." };
        }

        // Créer un log de consultation du profil
        await LogActiviteModel.createLogActivite({ 
            type_action_log: "consultation_profil", 
            statut_log: "succès", 
            id_util: id_util, 
            ip_adresse_log: null 
        });


        // Retourner le profil
        return { success: true, data: user };

    } catch (error) {
        // Si la bdd est inaccessible
        console.error("Erreur getUtilisateurById :", error);
        return {
            success: false,
            message: "Une erreur technique est survenue. Veuillez réessayer plus tard."
        };
    }
}

// Modifier le profil de l'utilisateur
export async function modifierProfil(id_util: string, nouvellesDonnees: Partial<Utilisateur>) {
    try {
        // Vérifier si l'utilisateur existe
        const user = await UtilisateurModel.getUtilisateurById(id_util);
        if (!user) {
            return { success: false, message: "Le compte n'existe pas." };
        }

        // Modifier le profil
        const utilisateurModifie = await UtilisateurModel.updateUtilisateur(id_util, nouvellesDonnees);

        // Créer un log de modification
        await LogActiviteModel.createLogActivite({ 
            type_action_log: "modification_profil", 
            statut_log: "succès", 
            id_util: id_util, 
            ip_adresse_log: null 
        });

        // Retourner le résultat
        return {
            success: true, data: utilisateurModifie, message: "Les informations de votre profil ont été mises à jour." };

    } catch (error) {
        console.error("Erreur updateUtilisateur :", error);
        return {
            success: false,
            message: "Une erreur technique est survenue. Veuillez réessayer plus tard."
        };
    }
}

// Supprimer un compte
export async function supprimerProfil(id_util: string) {
    try {
        // Vérifier si l'utilisateur existe
        const user = await UtilisateurModel.getUtilisateurById(id_util);
        if (!user) {
            return { success: false, message: "Le compte n'existe pas." };
        }

        // Supprimer le profil
        await UtilisateurModel.deleteUtilisateur(id_util);

        // Créer un log de suppression
        await LogActiviteModel.createLogActivite({ 
            type_action_log: "suppression_compte", 
            statut_log: "succès", 
            id_util: id_util, 
            ip_adresse_log: null 
        });

        // Retourner le résultat
        return { success: true, message: "Le compte a été supprimé avec succès." };


    } catch (error) {
        console.error("Erreur deleteUtilisateur :", error);
        return {
            success: false,
            message: "Une erreur technique est survenue. Veuillez réessayer plus tard."
        };
    }
}
