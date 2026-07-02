'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Bouton } from '@/components/Bouton';
import Link from 'next/link';

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleReset = async () => {
    setErreur('');

    if (!email) {
      setErreur('Email requis');
      return;
    }

    const emailNormalise = email.trim().toLowerCase();

    const { error } = await supabase.auth.resetPasswordForEmail(emailNormalise, {
      redirectTo: `${window.location.origin}/nouveau-mot-de-passe`,
    });

    if (error) {
      setErreur(error.message);
      return;
    }

    await supabase.from('reinitialisation_mot_de_passe').insert({
      token_reinit: crypto.randomUUID(),
      id_util: null,
    });

    setEnvoye(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Header variante="accueil" />
          <h1 className="text-2xl font-bold mt-4">
            <span className="text-green-600">Mot de passe</span>{' '}
            <span className="text-yellow-400">oublié</span>
          </h1>
        </div>

        {!envoye ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Saisis ton adresse e-mail pour recevoir un lien de réinitialisation.
            </p>

            <Input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {erreur && <p className="text-red-600 text-sm text-center">{erreur}</p>}

            <Bouton label="Envoyer le lien" onClick={handleReset} />
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-green-600 text-sm">
              ✅ Un e-mail a été envoyé à {email}. Vérifie ta boîte mail.
            </p>

            <Link href="/connexion" className="text-green-600 font-bold underline">
              Retour à la connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic'
