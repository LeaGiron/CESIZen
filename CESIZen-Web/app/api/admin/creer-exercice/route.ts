import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
   const supabaseAdmin = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
   )
   try {
     const { nom_exer, description_exer, duree_inspiration_defaut_exer, duree_apnee_defaut_exer, duree_expiration_defaut_exer } = await request.json()

     if (!nom_exer || !description_exer) {
       return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
     }

     const { error } = await supabaseAdmin
       .from('exercice_respiration')
       .insert({ nom_exer, description_exer, duree_inspiration_defaut_exer, duree_apnee_defaut_exer, duree_expiration_defaut_exer })

     if (error) return NextResponse.json({ error: error.message }, { status: 500 })
     return NextResponse.json({ message: 'Exercice créé avec succès' })
   } catch {
     return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
   }
}
