'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ← estAdmin ajouté en prop
export function FooterNav({ estConnecte, estAdmin }: { estConnecte: boolean; estAdmin: boolean }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="
      fixed bottom-0 left-0 right-0
      bg-white border-t border-gray-200
      flex justify-around items-center
      px-2 py-3
      pb-[calc(12px+env(safe-area-inset-bottom))]
      shadow-lg
    ">

      <Link href="/dashboard" className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center">
        <span className="text-2xl">🏠</span>
        <span className={`text-xs font-medium ${isActive('/dashboard') ? 'text-green-600' : 'text-gray-400'}`}>
          Accueil
        </span>
      </Link>

      <Link href="/ressources" className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center">
        <span className="text-2xl">📚</span>
        <span className={`text-xs font-medium ${isActive('/ressources') ? 'text-green-600' : 'text-gray-400'}`}>
          Ressources
        </span>
      </Link>

      <Link href="/respiration" className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center">
        <span className="text-2xl">🌬️</span>
        <span className={`text-xs font-medium ${isActive('/respiration') ? 'text-green-600' : 'text-gray-400'}`}>
          Respiration
        </span>
      </Link>

      {/* Lien admin — visible uniquement si l'utilisateur est administrateur */}
      {estAdmin && (
        <Link href="/admin" className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center">
          <span className="text-2xl">⚙️</span>
          <span className={`text-xs font-medium ${isActive('/admin') ? 'text-green-600' : 'text-gray-400'}`}>
            Admin
          </span>
        </Link>
      )}

      <Link
        href={estConnecte ? '/profil' : '/connexion'}
        className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center"
      >
        <span className="text-2xl">👤</span>
        <span className={`text-xs font-medium ${isActive('/profil') || isActive('/connexion') ? 'text-green-600' : 'text-gray-400'}`}>
          {estConnecte ? 'Profil' : 'Connexion'}
        </span>
      </Link>

    </nav>
  );
}
