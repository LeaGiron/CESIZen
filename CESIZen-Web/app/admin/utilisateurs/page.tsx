'use client';

import { useAdminUtilisateurs } from "@/controllers/admin_utilisateurs.controller";
import { AdminFooter } from "@/components/AdminFooter";

const BADGE_STATUT: Record<string, string> = {
  "actif": "bg-green-50 text-green-700",
  "inactif": "bg-gray-100 text-gray-500",
  "verrouillé": "bg-red-50 text-red-600",
};

const BADGE_ROLE: Record<string, string> = {
  "Administrateur": "bg-purple-50 text-purple-700",
  "Utilisateur": "bg-blue-50 text-blue-600",
};

export default function AdminUtilisateursPage() {
  const {
    utilisateurs, form, setForm, message, chargement,
    idEnCoursEdition, validerFormulaire, supprimerUtilisateur,
    deverrouiller, preparerModification, annulerEdition,
  } = useAdminUtilisateurs();

  if (chargement) return <div className="min-h-screen flex items-center justify-center italic text-gray-400">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24 font-sans">
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-lg font-bold text-gray-900 leading-tight">Membres</h1>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Administration</p>
      </header>

      <main className="flex-1 px-4 py-5 flex flex-col gap-6 overflow-y-auto">
        {message && (
          <div className={`p-4 rounded-xl text-xs font-bold text-center animate-bounce ${
            message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* FORMULAIRE UNIQUE (Création ou Modif) */}
        <section className={`bg-white rounded-2xl p-4 border-2 transition-all ${idEnCoursEdition ? 'border-blue-400' : 'border-transparent'}`}>
          <h2 className="text-sm font-bold text-gray-700 mb-4">
            {idEnCoursEdition ? "✏️ Modifier le profil" : "➕ Ajouter un membre"}
          </h2>
          <form onSubmit={validerFormulaire} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Prénom" value={form.prenom_util} onChange={e => setForm({...form, prenom_util: e.target.value})} required className="h-12 bg-gray-50 rounded-xl px-4 text-sm border border-gray-100" />
              <input type="text" placeholder="Nom" value={form.nom_util} onChange={e => setForm({...form, nom_util: e.target.value})} required className="h-12 bg-gray-50 rounded-xl px-4 text-sm border border-gray-100" />
            </div>
            
            <input type="email" placeholder="Email" value={form.email_util} onChange={e => setForm({...form, email_util: e.target.value})} required disabled={!!idEnCoursEdition} className="h-12 bg-gray-50 rounded-xl px-4 text-sm border border-gray-100 disabled:opacity-50" />
            
            {!idEnCoursEdition && (
              <input type="password" placeholder="Mot de passe" value={form.mdp_util} onChange={e => setForm({...form, mdp_util: e.target.value})} required className="h-12 bg-gray-50 rounded-xl px-4 text-sm border border-gray-100" />
            )}

            <div className="grid grid-cols-2 gap-2">
              <select value={form.type_util} onChange={e => setForm({...form, type_util: e.target.value as "Utilisateur" | "Administrateur"})} className="h-12 bg-gray-50 rounded-xl px-4 text-sm border border-gray-100">
                <option value="Utilisateur">Utilisateur</option>
                <option value="Administrateur">Administrateur</option>
              </select>
              <select value={form.statut_compte_util} onChange={e => setForm({...form, statut_compte_util: e.target.value as "actif" | "inactif" | "verrouillé"})} className="h-12 bg-gray-50 rounded-xl px-4 text-sm border border-gray-100">
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="verrouillé">Verrouillé</option>
              </select>
            </div>

            <button type="submit" className={`h-12 text-white font-bold rounded-xl ${idEnCoursEdition ? 'bg-blue-500' : 'bg-green-500'}`}>
              {idEnCoursEdition ? "Enregistrer" : "Créer le compte"}
            </button>
            {idEnCoursEdition && <button type="button" onClick={annulerEdition} className="text-xs text-gray-400 font-bold uppercase py-2">Annuler</button>}
          </form>
        </section>

        {/* LISTE DES MEMBRES */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Liste ({utilisateurs.length})</h2>
          {utilisateurs.map((u) => (
            <div key={u.id_util} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <p className="font-bold text-gray-800 text-sm">{u.prenom_util} {u.nom_util}</p>
                  <p className="text-[10px] text-gray-400 italic">{u.email_util}</p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${BADGE_ROLE[u.type_util]}`}>{u.type_util}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${BADGE_STATUT[u.statut_compte_util]}`}>{u.statut_compte_util}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => preparerModification(u)} className="flex-1 h-10 border border-blue-100 text-blue-600 font-bold text-[11px] rounded-xl active:bg-blue-50">✏️ Modifier</button>
                {u.statut_compte_util === "verrouillé" && (
                  <button onClick={() => deverrouiller(u.id_util)} className="flex-1 h-10 border border-amber-200 text-amber-600 font-bold text-[11px] rounded-xl active:bg-amber-50">🔓 Déverrouiller</button>
                )}
                <button onClick={() => supprimerUtilisateur(u.id_util)} className="flex-1 h-10 border border-red-100 text-red-500 font-bold text-[11px] rounded-xl active:bg-red-50">🗑️ Supprimer</button>
              </div>
            </div>
          ))}
        </section>
      </main>
      <AdminFooter />
    </div>
  );
}
export const dynamic = 'force-dynamic'

