import { NextRequest, NextResponse } from "next/server";
import * as RessourceController from "../../../../controllers/ressource.controller";

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
    const { id: id_ress } = await params;
    const body = await req.json();
    const { titre_ress, contenu_ress, categorie_ress, id_util } = body;

    const result = await RessourceController.modifierRessource(
      id_ress,
      id_util,
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
    const { id: id_ress } = await params;
    const body = await req.json();
    const { id_util } = body;

    const result = await RessourceController.deleteRessource(id_ress, id_util);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error("Erreur DELETE /api/ressource/[id] :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur lors de la suppression." },
      { status: 500 }
    );
  }
}