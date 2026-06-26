"use client";

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from "next/navigation";
import { useState } from "react";

export async function insererLog(
  supabase: any,
  type_action_log: string,
  statut_log: 'succès' | 'échec' | 'bloque',
  id_util: string | null = null
) {
  await supabase.from('log_activite').insert({
    type_action_log,
    statut_log,
    id_util,
  });
}

/**
 * INSCRIPTION
 */
export async function inscription(email_util: string, mot_de_passe_util: string, nom_util: string, prenom_util: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const erreurs = [];
  if (mot_de_passe_util.length < 12) erreurs.push("12 caractères");
  if (!/[A-Z]/.test(mot_de_passe_util)) erreurs.push("une majuscule");
  if (!/[a-z]/.test(mot_de_passe_util)) erreurs.push("une minuscule");
  if (!/[0-9]/.test(mot_de_passe_util)) erreurs.push("un chiffre");
  if (!/[@$!%*?&]/.test(mot_de_passe_util)) erreurs.push("un caractère spécial (@$!%*?&)");

  if (erreurs.length > 0) {
    throw new Error(`Il manque à votre mot de passe : ${erreurs.join(", ")}.`);
  }

  const { data, error: authError } = await supabase.auth.signUp({
    email: email_util.trim().toLowerCase(),
    password: mot_de_passe_util,
    options: { data: { nom_util, prenom_util } }
  });

  if (authError) throw authError;

  if (data?.user) {
    const { error: dbError } = await supabase
      .from("utilisateur")
      .upsert([{
        id_util: data.user.id,
        nom_util,
        prenom_util,
        email_util: email_util.trim().toLowerCase(),
        type_util: "Utilisateur",
        date_creation_util: new Date().toISOString(),
        derniere_connexion_util: new Date().toISOString(),
      }], { onConflict: 'id_util' });

    if (dbError) throw new Error("Erreur profil : " + dbError.message);
    await insererLog(supabase, 'creation_compte', 'succès', data.user.id);
  }

  return { success: true };
}

/**
 * CONNEXION
 */
export async function connexion(email: string, mdp: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: mdp,
  });

  if (authError) {
    // Log erreur authentification (id_util null car on ne sait pas qui c'est)
    await insererLog(supabase, 'erreur_authentification', 'échec', null);
    throw authError;
  }

  if (data?.user) {
    await supabase
      .from("utilisateur")
      .update({ derniere_connexion_util: new Date().toISOString() })
      .eq("id_util", data.user.id);

    await insererLog(supabase, 'connexion', 'succès', data.user.id);
  }

  return { success: true, data };
}

/**
 * SUPPRESSION COMPTE
 */
export async function supprimerCompteDefinitivement() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await insererLog(supabase, 'suppression_compte', 'succès', user.id);

  const { error } = await supabase
    .from('utilisateur')
    .delete()
    .eq('id_util', user.id);

  if (error) throw new Error("Erreur lors de la suppression : " + error.message);

  await supabase.auth.signOut();
  window.location.href = "/";
}

/**
 * HOOKS
 */
export function useInscription() {
  const router = useRouter();
  const [nom_util, setNom] = useState("");
  const [prenom_util, setPrenom] = useState("");
  const [email_util, setEmail] = useState("");
  const [mot_de_passe_util, setMotDePasse] = useState("");
  const [messageErreur, setMessageErreur] = useState<string | null>(null);

  const handleInscription = async () => {
    setMessageErreur(null);
    try {
      await inscription(email_util, mot_de_passe_util, nom_util, prenom_util);
      router.push("/connexion");
    } catch (err: any) {
      setMessageErreur((err instanceof Error ? err.message : "Erreur inconnue"));
    }
  };

  return { nom_util, setNom, prenom_util, setPrenom, email_util, setEmail, mot_de_passe_util, setMotDePasse, handleInscription, messageErreur };
}

export function useConnexion() {
  const [email_util, setEmail] = useState("");
  const [mot_de_passe_util, setMotDePasse] = useState("");
  const [messageErreur, setMessageErreur] = useState<string | null>(null);

  const handleConnexion = async () => {
    setMessageErreur(null);
    try {
      const res = await connexion(email_util, mot_de_passe_util);

      if (res.success && res.data?.user) {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: profil } = await supabase
          .from('utilisateur')
          .select('type_util')
          .eq('id_util', res.data.user.id)
          .single();

        if (profil?.type_util === 'Administrateur') {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      }
    } catch (err: any) {
      setMessageErreur("Identifiants incorrects.");
    }
  };

  return { email_util, setEmail, mot_de_passe_util, setMotDePasse, handleConnexion, messageErreur };
}
