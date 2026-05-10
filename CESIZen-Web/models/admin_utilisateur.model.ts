import { supabase } from "@/lib/supabase/supabase";

export type Utilisateur = {
  id_util: string;
  nom_util: string;
  prenom_util: string;
  email_util: string;
  type_util: "Utilisateur" | "Administrateur";
  statut_compte_util: "actif" | "inactif" | "verrouillé";
  date_creation_util: string;
  tentatives_connexion_util: number;
  date_verrouillage_util: string | null;
  derniere_connexion_util: string | null;
};

export type UtilisateurForm = {
  nom_util: string;
  prenom_util: string;
  email_util: string;
  mdp_util?: string; 
  type_util: "Utilisateur" | "Administrateur";
  statut_compte_util: "actif" | "inactif" | "verrouillé";
};

export async function getAllUtilisateurs(): Promise<Utilisateur[]> {
  const { data, error } = await supabase
    .from("utilisateur")
    .select("*")
    .order("date_creation_util", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function updateUtilisateur(id: string, form: UtilisateurForm): Promise<boolean> {
  const { error } = await supabase
    .from("utilisateur")
    .update({
      nom_util: form.nom_util,
      prenom_util: form.prenom_util,
      type_util: form.type_util,
      statut_compte_util: form.statut_compte_util,
    })
    .eq("id_util", id);
  return !error;
}

export async function deverrouillerUtilisateur(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("utilisateur")
    .update({
      statut_compte_util: "actif",
      tentatives_connexion_util: 0,
      date_verrouillage_util: null,
    })
    .eq("id_util", id);
  return !error;
}