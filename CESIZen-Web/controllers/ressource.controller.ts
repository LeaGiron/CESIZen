import * as RessourceModel from "../models/ressource.model";  
import * as LogActiviteModel from "../models/log_activite.model";

/**
 * 🔍 RÉCUPÉRER UNE RESSOURCE PAR SON ID
 * Utilisé pour l'affichage de la page de détail interne
 */
export async function getRessourceById(id_ress: string) {
    try {
        const ressource = await RessourceModel.getRessourceById(id_ress);

        if (!ressource) {
            return { success: false, message: "Ressource introuvable." };
        }

        return { success: true, ressource: ressource };

    } catch (error) {
        console.error("Erreur getRessourceById :", error);
        return { success: false, message: "Erreur lors de la récupération de l'article." };
    }
}

/**
 * 📋 LISTER TOUTES LES RESSOURCES
 */
export async function listerToutesLesRessources(id_util: string | null) {
    try {
        const liste = await RessourceModel.getAllRessources();

        if (liste.length === 0) {
            return { success: true, data: [], message: "Aucune ressource disponible." };
        }

        // Trace le log si l'utilisateur est connecté
        if (id_util) {
            await LogActiviteModel.createLogActivite({ 
                type_action_log: "consultation_ressource", 
                statut_log: "succès", 
                id_util: id_util, 
                ip_adresse_log: null 
            });
        }

        return { success: true, data: liste };

    } catch (error) {
        console.error("Erreur listerToutesLesRessources :", error);
        return { success: false, message: "Impossible de charger les ressources." };
    }
}

/**
 * 🎯 FILTRER PAR CATÉGORIE
 */
export async function filtrerParCategories(categorie_ress: 'Stress' | 'Sommeil' | 'Autre', id_util: string | null) {
    try {
        const ressourcesFiltrees = await RessourceModel.getRessourcesByCategorie(categorie_ress);

        if (ressourcesFiltrees.length === 0) {
            return { success: true, data: [], message: "Aucune ressource pour cette catégorie." };
        }

        if (id_util) {
            await LogActiviteModel.createLogActivite({ 
                type_action_log: "consultation_ressource", 
                statut_log: "succès", 
                id_util: id_util, 
                ip_adresse_log: null 
            });
        }

        return { success: true, data: ressourcesFiltrees };

    } catch (error) {
        console.error("Erreur filtrerRessourcesParCategorie :", error);
        return { success: false, message: "Erreur lors du filtrage." };
    }
}

/**
 * ✨ CRÉER UNE RESSOURCE (Admin)
 */
export async function creerRessource(id_util: string, nouvelleRessource: {
    titre_ress: string,
    contenu_ress: string,
    categorie_ress: 'Stress' | 'Sommeil' | 'Autre'
}) {
    try {
        const ressource = await RessourceModel.createRessource({
            ...nouvelleRessource,
            statut_ress: 'brouillon',
            date_creation_ress: new Date().toISOString(),
            date_modification_ress: new Date().toISOString(),
            id_util_auteur: id_util
        });

        await LogActiviteModel.createLogActivite({ 
            type_action_log: "creation_ressource", 
            statut_log: "succès", 
            id_util: id_util, 
            ip_adresse_log: null 
        });

        return { success: true, data: ressource, message: "Ressource créée avec succès." };

    } catch (error) {
        console.error("Erreur creerRessource :", error);
        return { success: false, message: "Erreur lors de la création." };
    }
}

/**
 * 📝 MODIFIER UNE RESSOURCE (Admin)
 */
export async function modifierRessource(id_ress: string, id_util: string, nouvellesDonnees: {
    titre_ress?: string,
    contenu_ress?: string,
    categorie_ress?: 'Stress' | 'Sommeil' | 'Autre'
}) {
    try {
        const ressourceExiste = await RessourceModel.getRessourceById(id_ress);
        if (!ressourceExiste) {
            return { success: false, message: "La ressource n'existe pas." };
        }

        const ressourceModifiee = await RessourceModel.updateRessource(id_ress, {
            ...nouvellesDonnees,
            date_modification_ress: new Date().toISOString()
        });

        await LogActiviteModel.createLogActivite({ 
            type_action_log: "modification_ressource", 
            statut_log: "succès", 
            id_util: id_util, 
            ip_adresse_log: null 
        });

        return { success: true, data: ressourceModifiee, message: "Ressource modifiée avec succès." };

    } catch (error) {
        console.error("Erreur modifierRessource :", error);
        return { success: false, message: "Erreur lors de la modification." };
    }
}

/**
 * 🗑️ SUPPRIMER UNE RESSOURCE (Admin)
 */
export async function deleteRessource(id_ress: string, id_util: string) {
    try {
        const ressourceExiste = await RessourceModel.getRessourceById(id_ress);
        if (!ressourceExiste) {
            return { success: false, message: "La ressource n'existe pas." };
        }

        await RessourceModel.deleteRessource(id_ress);

        await LogActiviteModel.createLogActivite({ 
            type_action_log: "suppression_ressource", 
            statut_log: "succès", 
            id_util: id_util, 
            ip_adresse_log: null 
        });

        return { success: true, message: "Ressource supprimée avec succès." };

    } catch (error) {
        console.error("Erreur deleteRessource :", error);
        return { success: false, message: "Erreur lors de la suppression." };
    }
}

/**
 * 📂 AFFICHER LES CATÉGORIES
 */
export async function afficherCategories() {
    try {
        const categories = await RessourceModel.getAllCategories();
        return { success: true, data: categories || [] };
    } catch (error) {
        console.error("Erreur afficherCategories :", error);
        return { success: false, message: "Erreur lors de la récupération des catégories." };
    }
}