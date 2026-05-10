import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. On crée une réponse de base
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // 2. Initialisation du client Supabase SSR
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // 🔁 Redirection automatique si déjà connecté et tente d'accéder à /connexion
  if (path === '/connexion' && user) {
    const { data: utilisateur } = await supabase
      .from('utilisateur')
      .select('type_util')
      .eq('id_util', user.id)
      .single()

    if (utilisateur?.type_util === 'Administrateur') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 🛡️ Protection des routes /admin : admins uniquement
  if (path.startsWith('/admin')) {
    console.log("--- 🛡️ MIDDLEWARE SCAN ---")
    console.log("📍 Chemin visité :", path)

    const cookieName = `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0].split('//')[1]}-auth-token`
    const hasCookie = request.cookies.has(cookieName)
    console.log("🍪 Cookie session détecté :", hasCookie ? "OUI ✅" : "NON ❌")

    if (!user) {
      console.log("👤 Statut : Aucun utilisateur → redirection /connexion")
      console.log("--------------------------")
      return NextResponse.redirect(new URL('/connexion', request.url))
    }

    console.log("👤 Statut : Connecté (ID:", user.id, ")")

    const { data: utilisateur } = await supabase
      .from('utilisateur')
      .select('type_util')
      .eq('id_util', user.id)
      .single()

    console.log("📊 Rôle en base :", utilisateur?.type_util || "Inconnu")

    if (utilisateur?.type_util !== 'Administrateur') {
      console.log("🚫 Accès refusé : Pas admin → redirection /dashboard")
      console.log("--------------------------")
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    console.log("🔓 Accès autorisé")
    console.log("--------------------------")

    // ✅ Empêche le cache navigateur sur les pages admin
    // Sans ça, le bouton "retour" affiche la page depuis le cache sans repasser par le middleware
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
  }

  return response
}

// /dashboard accessible à tous (pas dans le matcher)
export const config = {
  matcher: ['/admin/:path*', '/connexion'],
}