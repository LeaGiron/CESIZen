'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export function AdminFooter() {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const isActive = (path: string) => pathname === path;

  const handleDeconnexion = async () => {
    // Récupère l'utilisateur avant de le déconnecter pour avoir son id_util
    const { data: { user } } = await supabase.auth.getUser();

    // ✅ Log : déconnexion
    if (user) {
      await supabase.from('log_activite').insert({
        type_action_log: 'déconnexion',
        statut_log: 'succès',
        id_util: user.id,
        ip_adresse_log: null,
      });
    }

    await supabase.auth.signOut();
    localStorage.clear();
    router.replace('/connexion');
  };

  const navItems = [
    { href: '/admin',              icon: '📄', label: 'Contenus'  },
    { href: '/admin/utilisateurs', icon: '👥', label: 'Membres'   },
    { href: '/admin/exercices',    icon: '🫁', label: 'Exercices' },
    { href: '/admin/logs',         icon: '🛡️', label: 'Logs'      },
  ];

  return (
    <nav className="
      fixed bottom-0 left-0 right-0
      bg-white border-t border-gray-100
      flex justify-around items-center
      px-2 py-2
      pb-[calc(8px+env(safe-area-inset-bottom))]
      shadow-sm
    ">
      {navItems.map(({ href, icon, label }) => (
        <Link
          key={href}
          href={href}
          className="relative flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center px-2"
        >
          <span className={`text-xl transition-transform ${isActive(href) ? 'scale-110' : ''}`}>
            {icon}
          </span>
          <span className={`text-[10px] font-semibold uppercase tracking-tight transition-colors ${
            isActive(href) ? 'text-green-600' : 'text-gray-400'
          }`}>
            {label}
          </span>
          {isActive(href) && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-500" />
          )}
        </Link>
      ))}

      {/* Bouton déconnexion */}
      <button
        onClick={handleDeconnexion}
        className="
          relative flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center
          border-l border-gray-100 ml-1 pl-3
        "
      >
        <span className="text-xl">🔓</span>
        <span className="text-[10px] font-semibold uppercase tracking-tight text-red-400">
          Quitter
        </span>
      </button>
    </nav>
  );
}
