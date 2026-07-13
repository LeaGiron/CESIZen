// app/api/utilisateur/export/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 })
  }

  const { data: profil, error: profilError } = await supabase
    .from('utilisateur')
    .select('nom, prenom, email, type, date_creation, derniere_connexion')
    .eq('id_util', user.id)
    .single()

  if (profilError || !profil) {
    return NextResponse.json({ success: false, message: "Données introuvables" }, { status: 404 })
  }

  const exportData = {
    profil,
    date_export: new Date().toISOString(),
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="cesizen-export-${user.id}.json"`,
    },
  })
}