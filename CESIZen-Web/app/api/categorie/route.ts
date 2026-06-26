import { NextResponse } from "next/server"; // Next.js : gérer les requêtes et les réponses
import * as RessourceController from "../../../controllers/ressource.controller"; // Controller pour appeler les fonctions métier

// Lister les catégories
export async function GET() {
    try {
        // 1 Appelle le controller pour récupérer les catégories
        const result = await RessourceController.afficherCategories()

        // 2 Retourne la réponse au frontend
        return NextResponse.json(result, { status: result.success ? 200 : 400 });
    } catch (error) {
        // 3 Erreur serveur
        console.error("Erreur GET /api/categorie :", error);
        // 4 Message d'erreur au frontend
        return NextResponse.json(
            { success: false, message: "Erreur serveur lors de l'affichage des catégories." },
            { status: 500 }
        )
    }
}
