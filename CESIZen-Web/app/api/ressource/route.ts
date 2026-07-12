import { NextRequest, NextResponse } from "next/server"; // Next.js : gère les requêtes et les réponses
import { createClient } from "@/lib/supabase/server"; // Client Supabase côté serveur (session lue depuis les cookies)
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
        // 1 Vérifier que l'appelant est authentifié et administrateur (la création de ressource est réservée à l'admin)
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, message: "Non authentifié." },
                { status: 401 }
            );
        }

        const { data: profil, error: profilError } = await supabase
            .from("utilisateur")
            .select("type_util")
            .eq("id_util", user.id)
            .single();

        if (profilError || profil?.type_util !== "Administrateur") {
            return NextResponse.json(
                { success: false, message: "Accès réservé aux administrateurs." },
                { status: 403 }
            );
        }

        // 2 Récupère les données envoyées par le frontend (body JSON)
        const body = await req.json();

        // 3 Récupérer les infos nécessaires pour créer une ressource
        const {
            titre_ress,
            contenu_ress,
            categorie_ress,
        } = body;

        // 4 Appelle le controller pour créer une ressource, avec l'id de l'administrateur réellement connecté
        const result = await RessourceController.creerRessource(user.id,
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
