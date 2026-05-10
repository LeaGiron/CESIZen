import { NextRequest, NextResponse } from "next/server"; // Next.js : gérer les requêtes et les réponses
import * as LogActiviteController from "../../../controllers/log_activite.controller"; // Controller pour appeler les fonctions métier

export async function GET(req: NextRequest) {
    try {
        // 1 Récupérer id_util depuis l'URL
        const { searchParams } = new URL(req.url);
        const id_util = searchParams.get("id_util");

        // 2 Vérifier la sécurité
        if (!id_util) {
            return NextResponse.json(
                { success: false, message: "Identification requise pour voir les logs. "},
                { status: 401 }
            );
        }

        // 3 Appeler le controller (vérifie si l'utilisateur est bien admin)
        const result = await LogActiviteController.getAllLogActivite(id_util);

        // 4 Retourne la réponse
        return NextResponse.json(result, { status: result.success ? 200 : 403 });
    } catch (error) {
        console.error("Erreur GET /api/log :", error);
        return NextResponse.json(
            { success: false, message: "Erreur serveur lors de la récupération des logs." },
            { status: 500 }
        );
    }
}
