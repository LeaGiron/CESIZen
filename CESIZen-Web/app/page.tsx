import { Header } from "@/components/Header";
import Link from 'next/link';
import { Bouton } from "@/components/Bouton"; 
import { Separateur } from "@/components/Separateur";

export default function HomepagePage() {
  return (
    <main className="
      min-h-screen
      min-h-[100dvh]
      bg-gradient-to-b from-green-50 via-white to-white
      font-sans
      flex flex-col items-center justify-between
      px-6 py-12
    ">

      <div className="flex flex-col items-center gap-6 mt-8 w-full max-w-sm">
        <Header variante="accueil" />
        
        <h1 className="sr-only">CESIZen - Votre compagnon santé mentale</h1>
        
        <p className="text-center text-gray-600 text-base leading-relaxed px-2">
          Vous accompagne à l&apos;aide de ressources validées et d&apos;exercices
          personnalisés pour votre santé mentale.
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm mb-8 items-center">
        <div className="w-full">
          <Link href="/connexion">
            <Bouton label="Se connecter" />
          </Link>
        </div>

        <div className="w-full">
          <Link href="/inscription">
            <Bouton label="S'inscrire" />
          </Link>
        </div>

        <Separateur />

        <Link href="/dashboard"
          className="
            text-center text-gray-400 text-sm
            underline underline-offset-2
            py-2
            min-h-[44px] flex items-center justify-center
          "
        >
          Continuer sans compte
        </Link>
      </div>
    </main>
  );
}