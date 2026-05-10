import { supabase } from "@/lib/supabase/supabase";

export type Ressource = {
  id_ress: number;
  titre_ress: string;
  contenu_ress: string;
  categorie_ress: string;
  statut_ress: "publie" | "brouillon" | "archive";
};

export type RessourceForm = Omit<Ressource, "id_ress">;

/**
 * RÉCUPÉRER LE RÔLE
 */
export async function getRoleUtilisateur(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("utilisateur")
    .select("type_util")
    .eq("id_util", userId)
    .single();
    
  if (error) { 
    console.error("Erreur getRoleUtilisateur :", error.message); 
    return null; 
  }
  return data?.type_util ?? null;
}

/**
 * LIRE TOUTES LES RESSOURCES (ADMIN)
 */
export async function getAllRessources(): Promise<Ressource[]> {
  const { data, error } = await supabase
    .from("ressource")
    .select("*")
    .order("id_ress", { ascending: false });
    
  if (error) { 
    console.error("Erreur getAllRessources :", error.message); 
    return []; 
  }
  return data ?? [];
}

/**
 * AJOUTER UNE RESSOURCE
 */
export async function insertRessource(form: RessourceForm): Promise<Ressource | null> {
  const { data, error } = await supabase
    .from("ressource")
    .insert([{
      titre_ress: form.titre_ress,
      contenu_ress: form.contenu_ress,
      categorie_ress: form.categorie_ress,
      statut_ress: form.statut_ress || "brouillon", // Assure le minuscule
    }])
    .select()
    .single();
    
  if (error) { 
    alert("Erreur base de données : " + error.message); // Pour voir l'erreur RLS direct
    return null; 
  }
  return data ?? null;
}

/**
 * MODIFIER UNE RESSOURCE
 * Ajout du paramètre select() pour forcer la vérification de la modification
 */
export async function updateRessource(id: number, form: RessourceForm): Promise<boolean> {
  const { data, error } = await supabase
    .from("ressource")
    .update({
      titre_ress: form.titre_ress,
      contenu_ress: form.contenu_ress,
      categorie_ress: form.categorie_ress,
      statut_ress: form.statut_ress,
    })
    .eq("id_ress", id)
    .select(); // IMPORTANT : permet de vérifier si une ligne a vraiment été modifiée

  if (error) {
    console.error("Erreur updateRessource :", error.message);
    return false;
  }

  // Si data est vide, c'est que le RLS a bloqué la modification
  return data && data.length > 0;
}

/**
 * SUPPRIMER UNE RESSOURCE
 */
export async function deleteRessource(id: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("ressource")
    .delete()
    .eq("id_ress", id)
    .select(); // IMPORTANT : permet de vérifier si la suppression a eu lieu

  if (error) {
    console.error("Erreur deleteRessource :", error.message);
    return false;
  }

  return data && data.length > 0;
}