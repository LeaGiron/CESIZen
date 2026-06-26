import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur manquant' }, { status: 400 })
    }
    const { error: dbError } = await supabaseAdmin
      .from('utilisateur')
      .delete()
      .eq('id_util', userId)
    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'Utilisateur supprimé avec succès' })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
