import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    // 1. Vérifier que l'appelant est authentifié
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // 2. Vérifier que l'appelant a bien le rôle Administrateur
    const { data: callerProfile, error: profileError } = await supabase
      .from('utilisateur')
      .select('type_util')
      .eq('id_util', user.id)
      .single()

    if (profileError || callerProfile?.type_util !== 'Administrateur') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    // 3. Procéder à la suppression demandée
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur manquant' }, { status: 400 })
    }
    const { error: dbError } = await supabaseAdmin
      .from('utilisateur')
      .delete()
      .eq('id_util', userId)

    if (dbError) {
      return NextResponse.json({ error: 'Erreur lors de la suppression des données' }, { status: 500 })
    }

    // 4. Supprimer aussi le compte d'authentification (sinon l'email reste bloqué côté Supabase Auth)
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authDeleteError) {
      return NextResponse.json({ error: 'Erreur lors de la suppression du compte' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Utilisateur supprimé avec succès' })

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur serveur.';
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
