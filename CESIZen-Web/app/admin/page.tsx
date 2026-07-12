'use client';

import { useAdminRessources } from "@/controllers/admin_ressources.controller";
import { AdminFooter } from "@/components/AdminFooter";
import ReactMarkdown from 'react-markdown';

const CATEGORIES = ["Stress", "Sommeil", "Autre"];
const STATUTS = ["brouillon", "publie", "archive"] as const;

const BADGE: Record<string, string> = {
  publie: "bg-green-50 text-green-700",
  brouillon: "bg-amber-50 text-amber-700",
  archive: "bg-gray-100 text-gray-500",
};

export default function AdminPage() {
  const {
    ressources, form, setForm, message, chargement,
    idEnCoursEdition, validerFormulaire, supprimerRessource,
    preparerModification, annulerEdition,
  } = useAdminRessources();

  if (chargement) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm italic">Vérification des droits...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50 font-sans">

      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-lg font-semibold text-gray-900">Administration</h1>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-800">
            Admin
          </span>
        </div>
        <p className="text-sm text-gray-400">Gestion des ressources</p>
      </header>

      <main className="flex-1 px-4 py-5 flex flex-col gap-5 overflow-y-auto pb-24">

        {message && (
          <p className={`text-sm text-center font-semibold px-4 py-2 rounded-xl transition-all ${
            message.startsWith("✅")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}>
            {message}
          </p>
        )}

        {/* SECTION FORMULAIRE */}
        <section className={`
          bg-white rounded-2xl p-4 flex flex-col gap-3 border-2 transition-all
          ${idEnCoursEdition ? 'border-blue-400 shadow-md' : 'border-transparent shadow-sm'}
        `}>
          <h2 className="text-sm font-semibold text-gray-700">
            {idEnCoursEdition ? "✏️ Modifier la ressource" : "➕ Nouvelle ressource"}
          </h2>

          <form onSubmit={validerFormulaire} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Titre de la ressource"
              value={form.titre_ress}
              onChange={(e) => setForm({ ...form, titre_ress: e.target.value })}
              required
              className="w-full h-12 bg-gray-50 rounded-xl px-4 text-sm text-gray-800 border border-gray-200 focus:outline-none focus:border-green-400"
            />

            <textarea
              placeholder={"SYNTAXE MARKDOWN :\n### Ton Sous-titre\n**Texte en gras**\n- Point de liste\n\n------------------------------------------\nNote : Laissez un espace après le '###'"}
              value={form.contenu_ress}
              onChange={(e) => setForm({ ...form, contenu_ress: e.target.value })}
              rows={8}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-800 border border-gray-200 focus:outline-none focus:border-green-400 resize-none font-mono"
            />

            <div className="grid grid-cols-2 gap-2">
               <select
                value={form.categorie_ress || "Stress"}
                onChange={(e) => setForm({ ...form, categorie_ress: e.target.value })}
                className="h-12 bg-gray-50 rounded-xl px-4 text-sm border border-gray-200"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              <select
                value={form.statut_ress || "brouillon"}
                onChange={(e) => setForm({ ...form, statut_ress: e.target.value as any })}
                className="h-12 bg-gray-50 rounded-xl px-4 text-sm border border-gray-200"
              >
                {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <button type="submit" className={`w-full h-12 text-white font-bold rounded-xl transition-colors ${idEnCoursEdition ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'}`}>
              {idEnCoursEdition ? "Enregistrer les modifications" : "Publier la ressource"}
            </button>

            {idEnCoursEdition && (
              <button type="button" onClick={annulerEdition} className="text-gray-400 text-sm py-1 hover:underline text-center">
                Annuler l&apos;édition
              </button>
            )}
          </form>
        </section>

        {/* SECTION LISTE */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-700 flex justify-between">
            <span>📄 Ressources existantes</span>
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{ressources.length}</span>
          </h2>

          <ul className="flex flex-col gap-3">
            {ressources.map((item) => (
              <li key={item.id_ress} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.titre_ress}</p>
                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">{item.categorie_ress}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${BADGE[item.statut_ress]}`}>
                    {item.statut_ress}
                  </span>
                </div>

                {/* APERÇU DU CONTENU TRONQUÉ */}
                {item.contenu_ress && (
                  <div className="relative mt-2 pt-3 border-t border-gray-50">
                    <div className="max-h-24 overflow-hidden text-[11px] text-gray-500 pointer-events-none">
                      <ReactMarkdown
                        components={{
                          h3: ({ ...props }) => <h3 className="font-bold text-gray-700 mt-2 mb-1 uppercase" {...props} />,
                          ul: ({ ...props }) => <ul className="list-disc ml-4 mb-1" {...props} />,
                          li: ({ ...props }) => <li {...props} />,
                          p: ({ ...props }) => <p className="mb-1" {...props} />,
                          strong: ({ ...props }) => <strong className="font-bold text-gray-700" {...props} />
                        }}
                      >
                        {item.contenu_ress}
                      </ReactMarkdown>
                    </div>
                    {/* Effet fondu pour indiquer la suite */}
                    <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent" />
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button onClick={() => preparerModification(item)} className="flex-1 h-10 border border-green-400 text-green-600 font-bold text-xs rounded-xl active:bg-green-50">
                    ✏️ Modifier
                  </button>
                  <button onClick={() => supprimerRessource(item.id_ress)} className="flex-1 h-10 border border-red-200 text-red-500 font-bold text-xs rounded-xl active:bg-red-50">
                    🗑️ Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <AdminFooter />
    </div>
  );
}