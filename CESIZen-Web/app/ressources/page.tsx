'use client';

import { FooterNav } from '@/components/Footer';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Ressource = {
  id_ress: string; 
  titre_ress: string;
  categorie_ress: string;
  statut_ress: string;
};

const categories = ['Toutes', 'Stress', 'Sommeil', 'Autre'];

export default function RessourcesPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [estConnecte, setEstConnecte] = useState(false);
  const [estAdmin, setEstAdmin] = useState(false);
  const [recherche, setRecherche] = useState('');
  const [categorieActive, setCategorieActive] = useState('Toutes');
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const init = async () => {
      // 1. Session
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEstConnecte(true);
        const { data: utilisateur } = await supabase
          .from('utilisateur')
          .select('type_util')
          .eq('id_util', user.id)
          .single();
        setEstAdmin(utilisateur?.type_util === 'Administrateur');
      }

      // Log consultation liste ressources
      if (user) {
        await supabase.from('log_activite').insert({
          type_action_log: 'consultation_ressource',
          statut_log: 'succès',
          id_util: user.id,
        });
      }

      // 2. Chargement des ressources
      // On récupère tout pour filtrer proprement en JS
      const { data, error } = await supabase
        .from('ressource')
        .select('id_ress, titre_ress, categorie_ress, statut_ress')
        .order('date_creation_ress', { ascending: false });

      if (error) {
        console.error('Erreur Supabase :', error.message);
      } else {
        setRessources(data || []);
      }
      setChargement(false);
    };

    init();
  }, [supabase]);

  const ressourcesFiltrees = ressources.filter((res) => {
    const matchCategorie = categorieActive === 'Toutes' || res.categorie_ress === categorieActive;
    const matchTitre = res.titre_ress.toLowerCase().includes(recherche.toLowerCase());
    
    const estAffiche = estAdmin ? true : res.statut_ress === 'publie';
    
    return matchCategorie && matchTitre && estAffiche;
  });

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50 font-sans">
      {/* Header - Design original */}
      <header className="bg-white px-6 py-4 shadow-sm flex flex-col gap-3 sticky top-0 z-50">
        <h1 className="text-xl font-bold text-green-600">📚 Ressources</h1>

        <input
          type="text"
          placeholder="Rechercher une ressource..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="w-full h-12 bg-gray-100 rounded-xl px-4 text-base text-gray-800 border border-gray-200 focus:outline-none focus:border-green-400 placeholder:text-gray-400"
        />

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategorieActive(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors min-h-[36px] ${
                categorieActive === cat ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-4 flex flex-col gap-3 pb-32">
        {!estConnecte && (
          <div className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex flex-col gap-1">
            <p className="text-xs text-yellow-700 font-medium text-center">Mode visiteur</p>
            <Link href="/connexion" className="text-xs text-yellow-700 font-bold underline text-center">Se connecter →</Link>
          </div>
        )}

        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
          {ressourcesFiltrees.length} ressource{ressourcesFiltrees.length > 1 ? 's' : ''} trouvée{ressourcesFiltrees.length > 1 ? 's' : ''}
        </p>

        {chargement ? (
          <p className="text-sm text-gray-400 text-center mt-8 italic">Chargement...</p>
        ) : ressourcesFiltrees.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-2 mt-4 border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm text-center">Aucun résultat trouvé</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {ressourcesFiltrees.map((res) => (
              <li key={res.id_ress} className="bg-white rounded-2xl shadow-sm p-4 flex flex-row gap-4 border border-gray-100">
                <div className="w-20 h-20 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl text-green-600">📄</span>
                </div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 leading-tight line-clamp-2">{res.titre_ress}</h4>
                    <span className="inline-block text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold mt-1 uppercase">
                      {res.categorie_ress}
                    </span>
                  </div>
                  <Link
                    href={`/ressources/${res.id_ress}`}
                    className="mt-3 bg-green-500 text-white text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center min-h-[32px]"
                  >
                    Lire l&apos;article
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <FooterNav estConnecte={estConnecte} estAdmin={estAdmin} />
    </div>
  );
}