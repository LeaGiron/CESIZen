// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Génère un mot de passe temporaire aléatoire (remplace l'ancienne valeur fixe 'CesiZen2026!').
// Chaque compte créé sans mot de passe fourni reçoit désormais une valeur unique et imprévisible.
function genererMotDePasseTemporaire(): string {
  const octets = new Uint8Array(12);
  crypto.getRandomValues(octets);
  const alea = btoa(String.fromCharCode(...octets)).replace(/[+/=]/g, '');
  return `${alea.slice(0, 14)}A1!`;
}

Deno.serve(async (req) => {
  try {
    const { email_util, mdp_util, nom_util, prenom_util, type_util, statut_compte_util } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const motDePasseFourni = typeof mdp_util === 'string' && mdp_util.length >= 12;
    const motDePasse = motDePasseFourni ? mdp_util : genererMotDePasseTemporaire();

    // 1. Création dans Supabase Auth avec email confirmé
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email_util.trim().toLowerCase(),
      password: motDePasse,
      email_confirm: true,
      user_metadata: { nom_util, prenom_util },
    });

    if (authError) throw authError;

    // 2. Mise à jour de la ligne créée automatiquement dans la table utilisateur
    const { error: dbError } = await supabaseAdmin
      .from('utilisateur')
      .update({
        nom_util,
        prenom_util,
        type_util,
        statut_compte_util: statut_compte_util || 'actif',
      })
      .eq('id_util', authData.user.id);

    if (dbError) throw dbError;

    // Le mot de passe temporaire généré ici est renvoyé une seule fois à l'appelant (l'admin),
    // à charge pour lui de le transmettre à l'utilisateur qui devra le changer à sa première connexion.
    return new Response(JSON.stringify({
      success: true,
      mot_de_passe_temporaire: motDePasseFourni ? undefined : motDePasse,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});