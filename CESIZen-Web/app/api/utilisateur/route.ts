import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('utilisateur')
    .select('*')
    .eq('id_util', user.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ success: false, message: "Utilisateur non trouvé" }, { status: 404 })
  }

  return NextResponse.json({ success: true, utilisateur: data })
}