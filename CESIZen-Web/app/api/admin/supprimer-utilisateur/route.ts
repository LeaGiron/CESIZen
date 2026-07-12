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

    if