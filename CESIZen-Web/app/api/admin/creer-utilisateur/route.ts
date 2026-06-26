import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email_util, mdp_util, nom_util, prenom_util, type_util } = body;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    // 1. Création dans Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email_util,
      password: mdp_util,
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

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}