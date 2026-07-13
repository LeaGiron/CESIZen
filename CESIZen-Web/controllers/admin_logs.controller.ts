'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRoleUtilisateur } from '@/models/admin_ressource.model';

export type Log = {
  id_log: string;
  type_action_log: string;
  date_action_log: string;
  statut_log: 'succès' | 'échec' | 'bloque';
  id_util: string | null;
  utilisateur?: {
    prenom_util: string;
    nom_util: string;
    email_util: string;
  } | null;
};

const FILTRES_STATUT = ['Tous', 'succès', 'échec', 'bloque'] as const;
const FILTRES_ACTION = [
  'Tous',
  'connexion',
  'déconnexion',
  'consultation_ressource',
  'creation_ressource',
  'modification_ressource',
  'configuration_exercice',
  'erreur_authentification',
  'creation_compte',
  'suppression_compte',
  'modification_profil',
] as const;

export { FILTRES_STATUT, FILTRES_ACTION };

export function useAdminLogs() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [logs, setLogs] = useState<Log[]>([]);
  const [chargement, setChargement] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState<string>('Tous');
  const [filtreAction, setFiltreAction] = useState<string>('Tous');
  const [recherche, setRecherche] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      setChargement(true);

      // Le middleware protège déjà la page /admin/logs, mais on revérifie ici
      // avant d'interroger les logs : cette page ne doit jamais dépendre d'un seul
      // niveau de protection (voir aussi les règles d'accès sur la table log_activite).
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setChargement(false);
        router.push('/connexion');
        return;
      }

      const role = await getRoleUtilisateur(user.id);

      if (!role || role.trim().toLowerCase() !== 'administrateur') {
        setChargement(false);
        router.push('/');
        return;
      }

      let query = supabase
        .from('log_activite')
        .select(`
          id_log,
          type_action_log,
          date_action_log,
          statut_log,
          id_util,
          utilisateur:fk_utilisateur (
            prenom_util,
            nom_util,
            email_util
          )
        `)
        .order('date_action_log', { ascending: false })
        .limit(200);

      if (filtreStatut !== 'Tous') {
        query = query.eq('statut_log', filtreStatut);
      }

      if (filtreAction !== 'Tous') {
        query = query.eq('type_action_log', filtreAction);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur chargement logs :', (error instanceof Error ? error.message : "Erreur inconnue"));
      } else {
        setLogs((data as unknown as Log[]) || []);
      }

      setChargement(false);
    };

    fetchLogs();
  }, [filtreStatut, filtreAction]);

  const logsFiltres = logs.filter((log) => {
    if (!recherche) return true;
    const q = recherche.toLowerCase();
    return (
      log.type_action_log.toLowerCase().includes(q) ||
      log.statut_log.toLowerCase().includes(q) ||
      log.utilisateur?.email_util?.toLowerCase().includes(q) ||
      log.utilisateur?.nom_util?.toLowerCase().includes(q) ||
      log.utilisateur?.prenom_util?.toLowerCase().includes(q)
    );
  });

  return {
    logs: logsFiltres,
    chargement,
    filtreStatut, setFiltreStatut,
    filtreAction, setFiltreAction,
    recherche, setRecherche,
    total: logs.length,
  };
}
