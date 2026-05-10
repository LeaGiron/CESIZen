'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Bouton } from '@/components/Bouton';
import BoutonRetour from '@/components/Bouton_retour';
import { Separateur } from '@/components/Separateur';
import { useConnexion } from '@/controllers/auth.controller';
import Link from 'next/link';

export default function ConnexionPage() {
  const {
    email_util, setEmail,
    mot_de_passe_util, setMotDePasse,
    handleConnexion,
    messageErreur
  } = useConnexion();

  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

    const handleContinuerSansCompte = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      await supabase.auth.signOut();
      localStorage.clear(); // nettoyage au cas où
      router.push('/dashboard');
    };

  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 md:p-10">
      <div className="w-full max-w-md">

        {/* Bouton retour */}
        <div className="mb-4">
          <BoutonRetour />
        </div>

        {/* Header + titre */}
        <div className="flex flex-col items-center mb-6">
          <Header variante="accueil" />
          <h1 className="text-2xl font-bold text-center mt-4">
            <span className="text-green-600">Bon retour sur CESI</span>
            <span className="text-yellow-400">Zen</span>
          </h1>
        </div>

        {/* Champs du formulaire */}
        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Adresse e-mail"
            value={email_util}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={mot_de_passe_util}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
          <div className="flex justify-end mt-1">
            <Link href="/mot-de-passe-oublie" className="text-xs text-green-600 font-bold hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        {/* Message d'erreur */}
        {messageErreur && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-xl animate-in fade-in duration-300">
            <p className="text-red-600 text-[11px] text-center font-medium leading-tight">
              {messageErreur}
            </p>
          </div>
        )}

        {/* Boutons et liens */}
        <div className="flex flex-col items-center mt-6 space-y-4">
          <div className="w-full">
            <Bouton label="Se connecter" onClick={handleConnexion} />
          </div>

          <div className="w-full py-2">
            <Separateur />
          </div>

          <div className="flex flex-col items-center space-y-2">
            {/* ✅ Fix : signOut avant navigation pour supprimer le cookie de session */}
            <button
              onClick={handleContinuerSansCompte}
              className="text-xs text-gray-500 underline hover:text-gray-700"
            >
              Continuer sans compte
            </button>

            <p className="text-sm text-gray-500">
              Nouveau ?{' '}
              <Link href="/inscription" className="text-green-600 font-bold hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
