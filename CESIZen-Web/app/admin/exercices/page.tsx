'use client';

import { useAdminExercices } from "@/controllers/admin_exercice.controller";
import { AdminFooter } from "@/components/AdminFooter";

export default function AdminExercicesPage() {
  const {
    exercices, form, setForm, message, chargement,
    idEnCoursEdition, validerFormulaire, supprimerExercice,
    preparerModification, annulerEdition,
  } = useAdminExercices();

  if (chargement) return <div className="min-h-screen flex items-center justify-center italic text-gray-400">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24 font-sans">
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-lg font-bold text-gray-900 leading-tight">Exercices de respiration</h1>
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
            {idEnCoursEdition ? "✏️ Modifier l'exercice" : "➕ Ajouter un exercice"}
          </h2>
          <form onSubmit={validerFormulaire} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nom de l'exercice"
              value={form.nom_exer}
              onChange={e => setForm({ ...form, nom_exer: e.target.value })}
              required
              className="h-12 bg-gray-50 rounded-xl px-4 text-sm border border-gray-100"
            />

            <textarea
              placeholder="Description"
              value={form.description_exer}
              onChange={e => setForm({ ...form, description_exer: e.target.value })}
              required
              rows={3}
              className="bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-100 resize-none"
            />

            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Durées (en secondes)</p>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="inspiration" className="text-[10px] text-gray-400 font-bold uppercase px-1">Inspiration</label>
                <input
                  id="inspiration"
                  type="number"
                  min={1}
                  placeholder="ex: 4"
                  id="inspiration"
                  value={form.duree_inspiration_defaut_exer}
                  onChange={e => setForm({ ...form, duree_inspiration_defaut_exer: Number(e.target.value) })}
                  required
                  className="h-12 bg-gray-50 rounded-xl px-4 text-sm border border-gray-100 text-center"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="apnee" className="text-[10px] text-gray-400 font-bold uppercase px-1">Apnée</label>
                <input
                  id="apnee"
                  type="number"
                  min={0}
                  placeholder="ex: 4"
                  id="apnee"
                  value={form.duree_apnee_defaut_exer}
                  onChange={e => setForm({ ...form, duree_apnee_defaut_exer: Number(e.target.value) })}
                  required
                  className="h-12 bg-gray-50 rounded-xl px-4 text-sm border border-gray-100 text-center"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="expiration" className="text-[10px] text-gray-400 font-bold uppercase px-1">Expiration</label>
                <input
                  id="expiration"
                  type="number"
                  min={1}
                  placeholder="ex: 6"
                  id="expiration"
                  value={form.duree_expiration_defaut_exer}
                  onChange={e => setForm({ ...form, duree_expiration_defaut_exer: Number(e.target.value) })}
                  required
                  className="h-12 bg-gray-50 rounded-xl px-4 text-sm border border-gray-100 text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`h-12 text-white font-bold rounded-xl ${idEnCoursEdition ? 'bg-blue-500' : 'bg-green-500'}`}
            >
              {idEnCoursEdition ? "Enregistrer" : "Créer l'exercice"}
            </button>
            {idEnCoursEdition && (
              <button type="button" onClick={annulerEdition} className="text-xs text-gray-400 font-bold uppercase py-2">
                Annuler
              </button>
            )}
          </form>
        </section>

        {/* LISTE DES EXERCICES */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
            Liste ({exercices.length})
          </h2>
          {exercices.map((ex) => (
            <div key={ex.id_exer} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col gap-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col flex-1">
                  <p className="font-bold text-gray-800 text-sm">{ex.nom_exer}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{ex.description_exer}</p>
                </div>
              </div>

              {/* Durées */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 rounded-xl px-3 py-2 flex flex-col items-center">
                  <span className="text-[9px] font-bold text-blue-400 uppercase">Inspiration</span>
                  <span className="text-sm font-black text-blue-600">{ex.duree_inspiration_defaut_exer}s</span>
                </div>
                <div className="bg-amber-50 rounded-xl px-3 py-2 flex flex-col items-center">
                  <span className="text-[9px] font-bold text-amber-400 uppercase">Apnée</span>
                  <span className="text-sm font-black text-amber-600">{ex.duree_apnee_defaut_exer}s</span>
                </div>
                <div className="bg-green-50 rounded-xl px-3 py-2 flex flex-col items-center">
                  <span className="text-[9px] font-bold text-green-400 uppercase">Expiration</span>
                  <span className="text-sm font-black text-green-600">{ex.duree_expiration_defaut_exer}s</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => preparerModification(ex)}
                  className="flex-1 h-10 border border-blue-100 text-blue-600 font-bold text-[11px] rounded-xl active:bg-blue-50"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => supprimerExercice(ex.id_exer)}
                  className="flex-1 h-10 border border-red-100 text-red-500 font-bold text-[11px] rounded-xl active:bg-red-50"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}

          {exercices.length === 0 && (
            <div className="text-center py-10 text-gray-300 text-sm italic">
              Aucun exercice pour le moment
            </div>
          )}
        </section>
      </main>
      <AdminFooter />
    </div>
  );
}
