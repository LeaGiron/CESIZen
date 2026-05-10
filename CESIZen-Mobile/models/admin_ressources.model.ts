import { supabase } from "@/lib/supabase";

export type Ressource = {
  id_ress: number;
  titre_ress: string;
  contenu_ress: string;
  categorie_ress: string;
  statut_ress: "publie" | "brouillon" | "archive";
};

export type RessourceForm = Omit<Ressource, "id_ress">;

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

export async function insertRessource(form: RessourceForm): Promise<Ressource | null> {
  const { data, error } = await supabase
    .from("ressource")
    .insert([{
      titre_ress: form.titre_ress,
      contenu_ress: form.contenu_ress,
      categorie_ress: form.categorie_ress,
      statut_ress: form.statut_ress || "brouillon",
    }])
    .select()
    .single();

  if (error) {
    console.error("Erreur insertRessource :", error.message);
    return null;
  }
  return data ?? null;
}

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
    .select();

  if (error) {
    console.error("Erreur updateRessource :", error.message);
    return false;
  }

  return Array.isArray(data) && data.length > 0;
}

export async function deleteRessource(id: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("ressource")
    .delete()
    .eq("id_ress", id)
    .select();

  if (error) {
    console.error("Erreur deleteRessource :", error.message);
    return false;
  }

  return Array.isArray(data) && data.length > 0;
}
