'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Bouton } from '@/components/Bouton';
import BoutonRetour from '@/components/Bouton_retour';
import { useInscription } from '@/controllers/auth.controller';

export default function InscriptionPage() {
  const {
    nom_util, setNom,
    prenom_util, setPrenom,
    email_util, setEmail,
    mot_de_passe_util, setMotDePasse,
    handleInscription,
    messageErreur
  } = useInscription();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const pdfUrl = "/documents/CESIZen_CGU_Politique_Confidentialite.pdf";

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        
        <div className="mb-2">
          <BoutonRetour />
        </div>

        <div className="flex flex-col items-center mb-6">
          <Header variante="accueil" />
          <h1 className="text-xl font-bold text-center mt-4">
            <span className="text-green-600">Bienvenue sur CESI</span>
            <span className="text-yellow-400">Zen</span>
          </h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            Créez un compte pour commencer à vous détendre
          </p>
        </div>

        <div className="space-y-3">
          <Input 
            placeholder="Nom" 
            value={nom_util} 
            onChange={(e) => setNom(e.target.value)} 
          />
          <Input 
            placeholder="Prénom" 
            value={prenom_util} 
            onChange={(e) => setPrenom(e.target.value)} 
          />
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
        </div>

        {/* Le message d'erreur n'apparaît que si l'inscription échoue (ex: mot de passe incomplet) */}
        {messageErreur && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-red-500 text-[11px] text-center font-medium leading-relaxed">
              {messageErreur}
            </p>
          </div>
        )}

        <div className="flex flex-col items-center mt-6 space-y-4">
          <p className="text-[10px] text-gray-400 text-center leading-tight px-6">
            En continuant, vous acceptez les{' '}
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline text-green-600 font-medium hover:text-green-700"
            >
              Conditions générales et la Politique de confidentialité
            </a>
          </p>

          <div className="w-full">
            <Bouton label="S'inscrire" onClick={handleInscription} />
          </div>
        </div>

      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic'
