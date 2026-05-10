import { supabase } from '@/lib/supabase';
import { useCallback, useEffect, useState } from 'react';

interface Ressource {
  id_ress: number;
  titre_ress: string;
  categorie_ress: string;
}

export function useDashboard() {
  const [prenom_util, setPrenom] = useState('Visiteur');
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [estConnecte, setEstConnecte] = useState(false);
  const [estAdmin, setEstAdmin] = useState(false);

  const chargerProfil = useCallback(async (user: any) => {
    if (!user) {
      setEstConnecte(false);
      setEstAdmin(false);
      setPrenom('Visiteur');
      return;
    }

    // Toujours lire depuis la table utilisateur pour avoir les données à jour
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
  }, []);

  const chargerRessources = useCallback(async () => {
    const { data, error } = await supabase
      .from('ressource')
      .select('id_ress, titre_ress, categorie_ress')
      .order('id_ress', { ascending: false })
      .limit(3);

    if (!error && data) setRessources(data);
  }, []);

  useEffect(() => {
    const checkInitialSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      await chargerProfil(user);
      await chargerRessources();
    };

    checkInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setEstConnecte(false);
          setEstAdmin(false);
          setPrenom('Visiteur');
        } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          // Recharger le profil depuis la table à chaque mise à jour
          if (session?.user) {
            await chargerProfil(session.user);
          }
        }
        await chargerRessources();
      }
    );

    return () => subscription.unsubscribe();
  }, [chargerProfil, chargerRessources]);

  return { prenom_util, ressources, estConnecte, estAdmin };
}
