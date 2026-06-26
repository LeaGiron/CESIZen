import { NextResponse } from 'next/server';

export async function POST() {
  // Suppression de compte non implémentée côté API
  // La suppression est gérée via un trigger SQL ou par l'administrateur
  return NextResponse.json({ message: "Contactez l'admin pour suppression ou utilisez un trigger SQL" });
}
