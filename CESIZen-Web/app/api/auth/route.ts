import { NextRequest, NextResponse } from "next/server";
import { inscription, connexion } from "@/controllers/auth.controller";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action } = body;

        if (action === "inscription") {
            const { nom_util, prenom_util, email_util, mot_de_passe_util } = body;
            const result = await inscription(email_util, mot_de_passe_util, nom_util, prenom_util);
            return NextResponse.json(result, { status: 201 });

        } else {
            const { email_util, mot_de_passe_util } = body;
            const result = await connexion(email_util, mot_de_passe_util);
            return NextResponse.json(result, { status: 200 });
        }  

    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur serveur.";
        return NextResponse.json(
            { success: false, message },
            { status: 400 }
        );
    }
}