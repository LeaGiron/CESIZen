import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, message: "ID manquant" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('utilisateur')
      .select('*')
      .eq('id_util', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ success: true, utilisateur: data });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
