import { NextRequest, NextResponse } from "next/server"; // Next.js : gère les requêtes et les réponses
import * as RessourceController from "../../../controllers/ressource.controller"; // Controller pour appeler les fonctions métier

// Lister les ressources
// Reçoit req (requête) contient toutes les infos envoyées par l'utilisateur
export async function GET(req: NextRequest) {
    try {

        // req.url = adresse entière
        // new URL(req.url) et searchParams = extraire la catégorie et l'id de l'utilisateur de l'URL
        const { searchParams } = new URL(req.url);
        const categorie_ress = searchParams.get("categorie_ress");
        const id_util = searchParams.get("id_util");

        // Appeler le controller en donnant catégorie et id de l'utilisateur
        const result = categorie_ress 
        ? await RessourceController.filtrerParCategories(categorie_ress as 'Stress' | 'Sommeil' | 'Autre', id_util)
        : await RessourceController.listerToutesLesRessources(id_util);

        // Envoyer la réponse au navigateur
        return NextResponse.json(result, { status: result.success ? 200 : 400 });

    } catch (error) {
        console.error("Erreur GET /api/ressource :", error);
        return NextResponse.json(
            { success: false, message: "Erreur serveur." },
            { status: 500}
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        // 1 Récupère les données envoyées par le frontend (body JSON)
        const body = await req.json();

        // 2 Récupérer les infos nécessaires pour créer une ressource
        const {
            titre_ress,
            contenu_ress,
            categorie_ress,
            id_util
        } = body;

        // 3 Appelle le controller pour créer une ressource
        const result = await RessourceController.creerRessource(id_util, 
            { titre_ress, contenu_ress, categorie_ress 
        });

        // 4 Retourner la réponse au front
        return NextResponse.json(result, { status: result.success ? 201 : 400 });
    } catch (error) {
        console.error("Erreur POST /api/ressource :", error);
        return NextResponse.json(
            { success: false, message: "Erreur serveur lors de la création de la ressource." },
            { status: 500}
        )
    }
}
