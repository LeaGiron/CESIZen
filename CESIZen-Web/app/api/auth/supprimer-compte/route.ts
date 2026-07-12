import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST() {
  const supabase = await createServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 })
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error: deleteRowError } = await supabaseAdmin
    .from('utilisateur')
    .delete()
    .eq('id_util', user.id)

  if (deleteRowError) {
    return NextResponse.json({ success: false, message: "Erreur lors de la suppression des données" }, { status: 500 })
  }

  const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
  if (deleteAuthError) {
    return NextResponse.json({ success: false, message: "Erreur lors de la suppression du compte" }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: "Compte supprimé avec succès" })
}