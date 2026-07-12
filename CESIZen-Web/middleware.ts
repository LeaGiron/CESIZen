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
    if (!user) {
      return NextResponse.redirect(new URL('/connexion', request.url))
    }

    const { data: utilisateur } = await supabase
      .from('utilisateur')
      .select('type_util')
      .eq('id_util', user.id)
      .single()

    if (utilisateur?.type_util !== 'Administrateur') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // ✅ Empêche le cache navigateur sur les pages admin
    // Sans ça, le bouton "retour" affiche la page depuis le cache sans repasser par le middleware
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
  }

  return response
}

// Le middleware protège les pages /admin et /connexion.
// Les routes /api/* ne passent pas par le middleware : chacune vérifie elle-même
// la session et le rôle (voir /api/log, /api/ressource, /api/admin/*), ce qui est
// plus fiable qu'une seule barrière centrale (voir CVE-2025-29927 sur le middleware Next.js).
export const config = {
  matcher: ['/admin/:path*', '/connexion'],
}