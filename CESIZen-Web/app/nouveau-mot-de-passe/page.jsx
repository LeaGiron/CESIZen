'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/supabase';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Bouton } from '@/components/Bouton';

export default function NouveauMotDePassePage() {
  const router = useRouter();

  const [nouveauMdp, setNouveauMdp] = useState('');
  const [confirmationMdp, setConfirmationMdp] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const verifierMotDePasse = () => {
    const erreurs = [];

    if (nouveauMdp.length < 12) erreurs.push('12 caractères minimum');
    if (!/[A-Z]/.test(nouveauMdp)) erreurs.push('une majuscule');
    if (!/[a-z]/.test(nouveauMdp)) erreurs.push('une minuscule');
    if (!/[0-9]/.test(nouveauMdp)) erreurs.push('un chiffre');
    if (!/[@$!%*?&]/.test(nouveauMdp)) erreurs.push('un caractère spécial');

    if (erreurs.length > 0) {
      setErreur(`Mot de passe incomplet : ${erreurs.join(', ')}`);
      return false;
    }

    if (nouveauMdp !== confirmationMdp) {
      setErreur('Les mots de passe ne correspondent pas.');
      return false;
    }

    return true;
  };

  const handleUpdatePassword = async () => {
    setErreur('');

    if (!verifierMotDePasse()) return;

    setChargement(true);

    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      setErreur('Lien expiré ou déjà utilisé. Redemande un nouveau lien.');
      setChargement(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: nouveauMdp,
    });

    if (error) {
      setErreur(error.message);
      setChargement(false);
      return;
    }

    await supabase.auth.signOut();

    setChargement(false);

    router.push('/connexion');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Header variante="accueil" />

          <h1 className="text-2xl font-bold mt-4">
            Nouveau <span className="text-green-600">mot de passe</span>
          </h1>

          <p className="text-sm text-gray-500 text-center mt-2">
            Choisis un mot de passe robuste pour protéger ton compte.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Nouveau mot de passe"
            value={nouveauMdp}
            onChange={(e) => setNouveauMdp(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmationMdp}
            onChange={(e) => setConfirmationMdp(e.target.value)}
          />

          {erreur && (
            <p className="text-red-600 text-sm text-center">
              {erreur}
            </p>
          )}

          <Bouton
            label={chargement ? 'Mise à jour...' : 'Enregistrer les modifications'}
            onClick={handleUpdatePassword}
          />
        </div>
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic'
