// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const { email_util, mdp_util, nom_util, prenom_util, type_util, statut_compte_util } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Création dans Supabase Auth avec email confirmé
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email_util.trim().toLowerCase(),
      password: mdp_util || 'CesiZen2026!',
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

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});