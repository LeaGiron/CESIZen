import { NextRequest, NextResponse } from "next/server"; // Next.js : gérer les requêtes et les réponses
import { createClient } from "@/lib/supabase/server"; // Client Supabase côté serveur (lit la session depuis les cookies)
import * as LogActiviteController from "../../../controllers/log_activite.controller"; // Controller pour appeler les fonctions métier

export async function GET(req: NextRequest) {
    try {
        // 1 Vérifier que l'appelant est authentifié (session lue côté serveur, jamais un id transmis par le client)
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, message: "Identification requise pour voir les logs." },
                { status: 401 }
            );
        }

        // 2 Vérifier que l'appelant est bien administrateur
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

        // 3 Appeler le controller avec l'id de l'utilisateur réellement connecté
        const result = await LogActiviteController.getAllLogActivite(user.id);

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
