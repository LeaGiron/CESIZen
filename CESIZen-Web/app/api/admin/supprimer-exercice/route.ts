import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
   try {
     const { id_exer } = await request.json()

     if (!id_exer) return NextResponse.json({ error: 'ID manquant' }, { status: 400 })

     const { error } = await supabaseAdmin
       .from('exercice_respiration')
       .delete()
       .eq('id_exer', id_exer)

     if (error) return NextResponse.json({ error: error.message }, { status: 500 })
     return NextResponse.json({ message: 'Exercice supprimé avec succès' })
   } catch {
     return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
   }
}