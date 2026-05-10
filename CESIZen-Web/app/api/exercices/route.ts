import { NextRequest, NextResponse } from "next/server"; // Next.js : gérer les requêtes et les réponses
import * as ExerciceController from "../../../controllers/exercice_respiration.controller"; // Controller pour appeler les fonctions métier

// Lister les exercices
export async function GET(req: NextRequest) {
    try {
        // 1 Appelle le controller pour récupérer les exercices
        const result = await ExerciceController.afficherExercices()

        // 4️ Retourne la réponse au frontend
        //    Si OK -> status 202
        //    Si NON OK -> status 400
        return NextResponse.json(result, { status: result.success ? 200 : 400 });

        } catch (error) {
        // 5️ Erreurs serveur
        console.error("Erreur GET /api/exercices :", error);

        // 6️ Message d'erreur générique au frontend
        return NextResponse.json(
            { success: false, message: "Erreur serveur lors de l'affichage des exercices." },
            { status: 500 }
        );
    }
}

// Créer un exercice de respiration
export async function POST(req: NextRequest) {
    try {
        // 1 Récupère les données envoyées par le frontend (body JSON)
        const body = await req.json();

        // 2️ Récupérer les infos nécessaires pour créer d'un exercice
        const {
            id_util,
            nom_exer,
            description_exer,
            duree_inspiration_defaut_exer,
            duree_apnee_defaut_exer,
            duree_expiration_defaut_exer
        } = body;

        // 3 Appelle le controller pour créer un nouvel exercice
        const result = await ExerciceController.creerExercice(id_util, {
            nom_exer,
            description_exer,
            duree_inspiration_defaut_exer,
            duree_apnee_defaut_exer,
            duree_expiration_defaut_exer
        });

        // 4️ Retourne la réponse au frontend
        //    Si OK -> status 201
        //    Si NON OK -> status 400
        return NextResponse.json(result, { status: result.success ? 201 : 400 });

    } catch (error) {
        // 5️ Erreurs serveur
        console.error("Erreur POST /api/exercices :", error);

        // 6️ Message d'erreur générique au frontend
        return NextResponse.json(
            { success: false, message: "Erreur serveur lors de la création de l'exercice." },
            { status: 500 }
        );
    }
}

// Modifier un exercice de respiration
export async function PUT(req: NextRequest) {
    try {
       const body = await req.json();

        const {
            id_exer,
            id_util,
            nom_exer,
            description_exer,
            duree_inspiration_defaut_exer,
            duree_apnee_defaut_exer,
            duree_expiration_defaut_exer,
        } = body;

        const result = await ExerciceController.modifierExercice(id_exer, id_util, {
            nom_exer,
            description_exer,
            duree_inspiration_defaut_exer,
            duree_apnee_defaut_exer,
            duree_expiration_defaut_exer
        });

        return NextResponse.json(result, { status: result.success ? 200 : 400 });
    } catch (error) {
        console.error("Erreur PUT /api/exercices :", error);

        return NextResponse.json(
            { success: false, message: "Erreur serveur lors de la modification de l'exercice." },
            { status: 500 }
        );
    }
}

// Supprimer un exercice de respiration
export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            id_exer,
            id_util
        } = body;

        const result = await ExerciceController.supprimerExercice(id_exer, id_util)

        return NextResponse.json(result, { status: result.success ? 200 : 400 });

    } catch (error) {
        console.error("Erreur DELETE /api/exercices :", error);

        return NextResponse.json(
            { success: false, message: "Erreur serveur lors de la suppression de l'exercice." },
            { status: 500 }
        );
    }
}
