import { useRouter } from 'next/navigation';

export default function BoutonRetour() {
  // useRouter = permet de naviguer entre les pages
  const router = useRouter();

  return (
    // Bouton fixé en haut à gauche de l'écran
    // min-h-[44px] = taille tactile minimum recommandée par Apple
    <button
      onClick={() => router.back()} // Retourne à la page précédente
      className="
        flex items-center gap-1
        text-green-300 font-medium text-sm
        min-h-[44px] min-w-[44px]
        px-2
      "
    >
      ← Retour
    </button>
  );
}