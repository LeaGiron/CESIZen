import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as RessourceController from "../../../../controllers/ressource.controller";

// Vérifie que l'appelant est authentifié et administrateur.
// Retourne l'id de l'utilisateur si c'est le cas, sinon une réponse d'erreur toute prête.
async function verifierAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false as const, response: NextResponse.json(
      { success: false, message: "Non authentifié." },
      { status: 401 }
    ) };
  }

  const { data: profil, error: profilError } = await supabase
    .from("utilisateur")
    .select("type_util")
    .eq("id_util", user.id)
    .single();

  if (profilError || profil?.type_util !== "Administrateur") {
    return { ok: false as const, response: NextResponse.json(
      { success: false, message: "Accès réservé aux administrateurs." },
      { status: 403 }
    ) };
  }

  return { ok: true as const, id_util: user.id };
}

/**
 * 🔍 LIRE UNE RESSOURCE (Détail)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: id_ress } = await params;

    // On appelle le controller pour récupérer les données de la ressource
    const result = await RessourceController.getRessourceById(id_ress);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/ressource/[id] :", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération." },
      { status: 500 }
    );
  }
}

/**
 * 📝 MODIFIER UNE RESSOURCE
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifierAdmin();
    if (!admin.ok) return admin.response;

    const { id: id_ress } = await params;
    const body = await req.json();
    const { titre_ress, contenu_ress, categorie_ress } = body;

    const result = await RessourceController.modifierRessource(
      id_ress,
      admin.id_util,
      { titre_ress, contenu_ress, categorie_ress }
    );

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error("Erreur PUT /api/ressource/[id] :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur lors de la modification." },
      { status: 500 }
    );
  }
}

/**
 * 🗑️ SUPPRIMER UNE RESSOURCE
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifierAdmin();
    if (!admin.ok) return admin.response;

    const { id: id_ress } = await params;

    const result = await RessourceController.deleteRessource(id_ress, admin.id_util);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error("Erreur DELETE /api/ressource/[id] :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur lors de la suppression." },
      { status: 500 }
    );
  }
}