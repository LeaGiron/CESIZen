import { NextResponse } from 'next/server';

export async function POST() {
  // La suppression de compte est gérée côté client dans authValidation.ts
  // (supprimerCompteDefinitivement), directement via la session de l'utilisateur.
  return NextResponse.json({ message: "Contactez l'admin pour suppression ou utilisez un trigger SQL" });
}