'use client';

import { AdminFooter } from '@/components/AdminFooter';
import { useAdminLogs, FILTRES_STATUT, FILTRES_ACTION } from '@/controllers/admin_logs.controller';

const BADGE_STATUT: Record<string, string> = {
  'succès':  'bg-green-50 text-green-700 border border-green-200',
  'échec':   'bg-red-50 text-red-600 border border-red-200',
  'bloque':  'bg-orange-50 text-orange-600 border border-orange-200',
};

const ICONE_ACTION: Record<string, string> = {
  'connexion':               '🔑',
  'déconnexion':             '🔓',
  'consultation_ressource':  '📖',
  'creation_ressource':      '➕',
  'modification_ressource':  '✏️',
  'configuration_exercice':  '🫁',
  'erreur_authentification': '⚠️',
  'creation_compte':         '👤',
  'suppression_compte':      '🗑️',
  'modification_profil':     '📝',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatAction(action: string) {
  return action.replace(/_/g, ' ');
}

export default function AdminLogsPage() {
  const {
    logs, chargement,
    filtreStatut, setFiltreStatut,
    filtreAction, setFiltreAction,
    recherche, setRecherche,
    total,
  } = useAdminLogs();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50 font-sans">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-lg font-semibold text-gray-900">Journaux d'activité</h1>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-800">
            Admin
          </span>
        </div>
        <p className="text-sm text-gray-400">{total} entrée{total > 1 ? 's' : ''} chargée{total > 1 ? 's' : ''}</p>
      </header>

      <main className="flex-1 px-4 py-5 flex flex-col gap-4 overflow-y-auto pb-24">

        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="🔍 Rechercher (email, IP, action...)"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="w-full h-11 bg-white rounded-xl px-4 text-sm text-gray-800 border border-gray-200 focus:outline-none focus:border-green-400 shadow-sm"
        />

        {/* Filtres statut */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTRES_STATUT.map((s) => (
            <button
              key={s}
              onClick={() => setFiltreStatut(s)}
              className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                filtreStatut === s
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              {s === 'Tous' ? 'Tous les statuts' : s}
            </button>
          ))}
        </div>

        {/* Filtre action */}
        <select
          value={filtreAction}
          onChange={(e) => setFiltreAction(e.target.value)}
          className="w-full h-11 bg-white rounded-xl px-4 text-sm text-gray-700 border border-gray-200 focus:outline-none focus:border-green-400 shadow-sm"
        >
          {FILTRES_ACTION.map((a) => (
            <option key={a} value={a}>
              {a === 'Tous' ? 'Toutes les actions' : a.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        {/* Liste des logs */}
        {chargement ? (
          <p className="text-sm text-gray-400 italic text-center py-10">Chargement des logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-10">Aucun log trouvé.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {logs.map((log) => (
              <li key={log.id_log} className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2">

                {/* Ligne 1 : icône + action + badge statut */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{ICONE_ACTION[log.type_action_log] ?? '📋'}</span>
                    <span className="text-sm font-semibold text-gray-800 capitalize">
                      {formatAction(log.type_action_log)}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${BADGE_STATUT[log.statut_log]}`}>
                    {log.statut_log}
                  </span>
                </div>

                {/* Ligne 2 : utilisateur ou anonyme */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>👤</span>
                  {log.utilisateur ? (
                    <span>
                      {log.utilisateur.prenom_util} {log.utilisateur.nom_util}
                      <span className="text-gray-400 ml-1">({log.utilisateur.email_util})</span>
                    </span>
                  ) : (
                    <span className="italic text-gray-400">Anonyme / compte supprimé</span>
                  )}
                </div>

                {/* Ligne 3 : date + IP */}
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>🕐 {formatDate(log.date_action_log)}</span>
                </div>

              </li>
            ))}
          </ul>
        )}
      </main>

      <AdminFooter />
    </div>
  );
}
