import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

// Génère un mot de passe temporaire aléatoire (remplace l'ancienne valeur fixe codée en dur).
function genererMotDePasseTemporaire(): string {
  const alea = randomBytes(12).toString('base64').replace(/[+/=]/g, '');
  return `${alea.slice(0, 14)}A1!`;
}

export async function POST(request: Request) {
  try {
    // 0. Vérifier que l'appelant est authentifié et administrateur.
    // Sans ce contrôle, n'importe qui pouvait auparavant créer un compte, y compris Administrateur.
    const supabaseServer = await createServerClient();
    const { data: { user: appelant }, error: authAppelantError } = await supabaseServer.auth.getUser();

    if (authAppelantError || !appelant) {
      return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
    }

    const { data: profilAppelant, error: profilAppelantError } = await supabaseServer
      .from('utilisateur')
      .select('type_util')
      .eq('id_util', appelant.id)
      .single();

    if (profilAppelantError || profilAppelant?.type_util !== 'Administrateur') {
      return NextResponse.json({ error: 'Accès réservé aux administrateurs.' }, { status: 403 });
    }

    const body = await request.json();
    const { email_util, mdp_util, nom_util, prenom_util, type_util } = body;

    const motDePasseFourni = typeof mdp_util === 'string' && mdp_util.length >= 12;
    const motDePasse = motDePasseFourni ? mdp_util : genererMotDePasseTemporaire();

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Création dans Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email_util,
      password: motDePasse,
      email_confirm: true,
      user_metadata: {
        nom: nom_util,
        prenom: prenom_util,
        role: type_util
      }
    });

    if (authError) throw authError;

    const { error: dbError } = await supabaseAdmin
      .from('utilisateur')
      .update({
        nom_util,
        prenom_util,
        type_util,
        statut_compte_util: 'actif'
      })
      .eq('id_util', authData.user.id);

    if (dbError) throw dbError;

    // Le mot de passe temporaire n'est renvoyé que s'il a été généré ici (jamais celui saisi par l'admin),
    // pour que ce dernier puisse le communiquer à l'utilisateur. Un changement au premier login est recommandé.
    return NextResponse.json({
      success: true,
      mot_de_passe_temporaire: motDePasseFourni ? undefined : motDePasse,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}