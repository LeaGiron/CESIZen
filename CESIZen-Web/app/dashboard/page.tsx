'use client';

import React from 'react';
import Link from 'next/link';
import { FooterNav } from '@/components/Footer';
import { useDashboard } from '@/controllers/dashboard.controller';

export default function DashboardPage() {
  // ← estAdmin récupéré depuis le contrôleur
  const { prenom_util, ressources, estConnecte, estAdmin } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <header className="bg-white sticky top-0 z-50 px-6 py-4 flex justify-center items-center border-b border-gray-100 shadow-sm">
        <h1 className="text-xl font-bold">
          <span className="text-green-600">CESI</span>
          <span className="text-yellow-400">Zen</span>
        </h1>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto pb-24 p-6 space-y-8">

        <section className="flex flex-col items-center text-center space-y-2 py-6">
          <div className="text-5xl">☀️</div>
          <h2 className="text-2xl font-bold text-green-600">
            Bonjour {prenom_util} !
          </h2>
          <p className="text-gray-500">Comment allez-vous aujourd&apos;hui ?</p>

          {!estConnecte && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl w-full text-left">
              <span className="text-sm text-yellow-700 font-bold block">Mode visiteur</span>
              <p className="text-xs text-yellow-600 mt-1">
                Connectez-vous pour débloquer toutes les fonctionnalités.
              </p>
              <Link href="/connexion" className="inline-block text-sm text-yellow-700 font-bold underline mt-2">
                Se connecter →
              </Link>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gray-700 font-bold">
            <span>📚</span>
            <h3>Dernières ressources</h3>
          </div>

          {ressources.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Chargement des ressources...</p>
          ) : (
            <div className="grid gap-4">
              {ressources.map((res) => (
                <div key={res.id_ress} className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl text-green-600">📄</span>
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 line-clamp-2">{res.titre_ress}</h4>
                      <span className="inline-block text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold mt-1 uppercase">
                        {res.categorie_ress}
                      </span>
                    </div>
                    <Link href={`/ressources/${res.id_ress}`} className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-lg transition-colors text-center block">
                      Lire l&apos;article
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link href="/ressources" className="block text-sm text-green-600 font-bold text-center mt-4 hover:underline">
            Voir tout le catalogue →
          </Link>
        </section>

        <section className="bg-green-50 rounded-3xl p-6 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <span>🍃</span>
            <h3 className="font-bold text-gray-800 text-lg">Le coin détente</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Prenez une pause de 5 minutes pour une séance de respiration guidée.
          </p>
          <Link href="/respiration" className="block w-full mt-5 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-center transition-transform active:scale-95">
            Commencer
          </Link>
        </section>

        {estConnecte && (
          <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-800">Mon compte</h3>
            <p className="text-sm text-gray-500 mb-4">Mettez à jour vos informations.</p>
            <Link href="/profil" className="block w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 py-3 rounded-xl text-center font-bold text-gray-700 transition-colors">
              Accéder au profil
            </Link>
          </section>
        )}

      </main>

      {/* ← estAdmin transmis au footer */}
      <FooterNav estConnecte={estConnecte} estAdmin={estAdmin} />
    </div>
  );
}

export const dynamic = 'force-dynamic'
