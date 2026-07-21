'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { useEffect, useState, useCallback } from 'react';

// Interface pour corriger l'erreur TypeScript "never[]"
interface Ressource {
  id_ress: number;
  titre_ress: string;
  categorie_ress: string;
}

export function useDashboard() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [prenom_util, setPrenom] = useState('Visiteur');
  const [ressources, setRessources] = useState<Ressource[]>([]); // Typage ici
  const [estConnecte, setEstConnecte] = useState(false);
  const [estAdmin, setEstAdmin] = useState(false);

  const chargerProfil = useCallback(async (user: User | null) => {
    if (!user) {
      setEstConnecte(false);
      setEstAdmin(false);
      setPrenom('Visiteur');
      return;
    }

    const { data: utilisateur, error } = await supabase
      .from('utilisateur')
      .select('prenom_util, type_util')
      .eq('id_util', user.id)
      .single();

    if (!error && utilisateur) {
      setPrenom(utilisateur.prenom_util);
      setEstAdmin(utilisateur.type_util === 'Administrateur');
      setEstConnecte(true);
    } else {
      setEstConnecte(false);
      setEstAdmin(false);
    }
  }, [supabase]);

  const chargerRessources = useCallback(async () => {
    const { data, error } = await supabase
      .from('ressource')
      .select('id_ress, titre_ress, categorie_ress')
      .order('id_ress', { ascending: false })
      .limit(3);

    if (!error && data) setRessources(data);
  }, [supabase]);

  useEffect(() => {
    const checkInitialSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      await chargerProfil(user);
      await chargerRessources();
    };

    checkInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setEstConnecte(false);
        setEstAdmin(false);
        setPrenom('Visiteur');
      } else if (session?.user) {
        await chargerProfil(session.user);
      }
      await chargerRessources();
    });

    return () => subscription.unsubscribe();
  }, [supabase, chargerProfil, chargerRessources]);

  return { prenom_util, ressources, estConnecte, estAdmin };
}