'use client';

import { useState, useEffect } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import BoutonRetour from '@/components/Bouton_retour';
import { FooterNav } from '@/components/Footer';
import { createBrowserClient } from '@supabase/ssr';
import type { Ressource } from '@/models/admin_ressource.model';

type MarkdownComponentProps = HTMLAttributes<HTMLElement> & {
  node?: unknown;
  children?: ReactNode;
};

function MarkdownH3({ node: _node, ...props }: MarkdownComponentProps) {
  return (
    <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-2 uppercase tracking-wide" {...props}>
      <span className="w-1 h-6 bg-green-500 rounded-full"></span>
      {props.children}
    </h3>
  );
}

function MarkdownP({ node: _node, ...props }: MarkdownComponentProps) {
  return <p className="text-lg mb-6 leading-relaxed text-gray-700" {...props} />;
}

function MarkdownUl({ node: _node, ...props }: MarkdownComponentProps) {
  return <ul className="list-disc list-outside ml-6 mb-8 space-y-3 text-gray-700 text-lg" {...props} />;
}

function MarkdownLi({ node: _node, ...props }: MarkdownComponentProps) {
  return <li className="pl-2 marker:text-green-500" {...props} />;
}

function MarkdownStrong({ node: _node, ...props }: MarkdownComponentProps) {
  return <strong className="font-bold text-gray-900" {...props} />;
}

const markdownComponents = {
  h3: MarkdownH3,
  p: MarkdownP,
  ul: MarkdownUl,
  li: MarkdownLi,
  strong: MarkdownStrong,
};

export default function DetailRessourcePage() {
  const { id } = useParams();

  const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

  const [ressource, setRessource] = useState<Ressource | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const response = await fetch(`/api/ressource/${id}`);
        const data = await response.json();

        if (data.success) {
          setRessource(data.ressource);

          // Log consultation ressource individuelle
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            // LOG ACTIVITÉ
            await supabase.from('log_activite').insert({
              type_action_log: 'consultation_ressource',
              statut_log: 'succès',
              id_util: user.id,
            });

            // ACCÈS RESSOURCE
            await supabase.from('acces_ressource').insert({
              id_util: user.id,
              id_ress: id,
            });
          }

        } else {
          setErreur(data.message);
        }
      } catch (err) {
        console.error('Erreur chargement ressource :', err);
        setErreur("Impossible de charger la ressource.");
      } finally {
        setChargement(false);
      }
    };

    if (id) chargerDonnees();
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 font-medium italic bg-white">
        Inspiration... Expiration...
      </div>
    );
  }

  if (erreur || !ressource) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
        <p className="text-red-500 mb-6 font-medium">{erreur || "Ressource introuvable"}</p>
        <BoutonRetour />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER FIXE */}
      <header className="px-6 py-4 border-b border-gray-50 flex items-center gap-4 sticky top-0 bg-white/90 backdrop-blur-md z-10">
        <BoutonRetour />
        <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full">
          {ressource.categorie_ress}
        </span>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 px-6 py-10 max-w-2xl mx-auto w-full">
        {/* Titre de la ressource */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
          {ressource.titre_ress}
        </h1>

        {/* Élément décoratif Zen */}
        <div className="w-16 h-1 bg-yellow-400 rounded-full mb-12" />

        {/* Rendu Markdown personnalisé */}
        <div className="text-gray-800">
          <ReactMarkdown components={markdownComponents}>
            {ressource.contenu_ress}
          </ReactMarkdown>
        </div>
      </main>

      <FooterNav estConnecte={true} estAdmin={false} />
      
      <div className="h-28" />
    </div>
  );
}
export const dynamic = 'force-dynamic'
