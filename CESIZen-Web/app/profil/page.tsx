'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import BoutonRetour from '@/components/Bouton_retour';
import { FooterNav } from '@/components/Footer';
import { supprimerCompteDefinitivement } from '@/controllers/auth.controller';

export default function ProfilPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [prenom_util, setPrenom] = useState('');
  const [nom_util, setNom] = useState('');
  const [email_util, setEmail] = useState('');
  const [estAdmin, setEstAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const [chargement, setChargement] = useState(true);
  const [idUtil, setIdUtil] = useState<string | null>(null);

  const router = useRouter();

  const logAction = async (type: string, statut: 'succès' | 'échec', id?: string) => {
    await supabase.from('log_activite').insert({
      type_action_log: type,
      statut_log: statut,
      id_util: id ?? idUtil,
    });
  };

  useEffect(() => {
    const chargerProfil = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!user || authError) {
        router.push('/connexion');
        return;
      }
      setIdUtil(user.id);

      const { data: utilisateur, error: dbError } = await supabase
        .from('utilisateur')
        .select('prenom_util, nom_util, email_util, type_util')
        .eq('id_util', user.id)
        .single();

      if (dbError || !utilisateur) {
        router.push('/connexion');
        return;
      }

      setPrenom(utilisateur.prenom_util || '');
      setNom(utilisateur.nom_util || '');
      setEmail(utilisateur.email_util || '');
      setEstAdmin(utilisateur.type_util === 'Administrateur');

      // Log consultation profil
      await supabase.from('log_activite').insert({
        type_action_log: 'consultation_profil',
        statut_log: 'succès',
        id_util: user.id,
      });

      setChargement(false);
    };
    chargerProfil();
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async () => {
    if (!idUtil) return;
    setMessage('⏳ Enregistrement...');
    const { error } = await supabase
      .from('utilisateur')
      .update({ prenom_util, nom_util, email_util })
      .eq('id_util', idUtil);

    if (error) {
      await logAction('modification_profil', 'échec');
      setMessage('❌ Erreur lors de la mise à jour.');
    } else {
      await logAction('modification_profil', 'succès');
      setMessage('✅ Profil mis à jour !');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLogout = async () => {
    await logAction('déconnexion', 'succès');
    await supabase.auth.signOut();
    localStorage.clear();
    router.replace('/connexion');
  };

  const handleDelete = async () => {
    const confirmation = confirm(
      "⚠️ ACTION IRRÉVERSIBLE\n\nÊtes-vous sûr de vouloir supprimer définitivement votre compte ? Toutes vos données seront effacées."
    );

    if (confirmation) {
      try {
        setMessage('⏳ Suppression définitive...');
        await supprimerCompteDefinitivement();
      } catch (err: unknown) {
        setMessage(`❌ Erreur: ${(err instanceof Error ? err.message : "Erreur inconnue")}`);
      }
    }
  };

  if (chargement) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Vérification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-gray-50 font-sans">
      <header className="bg-white px-6 py-4 shadow-sm flex items-center justify-between pt-[calc(env(safe-area-inset-top)+1rem)]">
        <BoutonRetour />
        <h1 className="text-xl font-bold text-green-600">👤 Mon profil</h1>
        <button
          onClick={handleLogout}
          className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-xl active:bg-red-50 transition-colors"
        >
          Déconnexion
        </button>
      </header>

      <main className="flex-1 px-6 py-6 flex flex-col gap-6">
        {/* SECTION INFOS */}
        <section className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-5">
          <h2 className="text-base font-semibold text-gray-800">Mes informations</h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="prenom" className="text-xs text-gray-400 font-bold uppercase tracking-wider">Prénom</label>
              <input
                id="prenom"
                type="text"
                value={prenom_util}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full h-12 bg-gray-50 rounded-xl px-4 text-gray-800 border border-gray-100 focus:outline-none focus:border-green-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nom" className="text-xs text-gray-400 font-bold uppercase tracking-wider">Nom</label>
              <input
                id="nom"
                type="text"
                value={nom_util}
                onChange={(e) => setNom(e.target.value)}
                className="w-full h-12 bg-gray-50 rounded-xl px-4 text-gray-800 border border-gray-100 focus:outline-none focus:border-green-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</label>
              <input
                id="email"
                type="email"
                value={email_util}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-gray-50 rounded-xl px-4 text-gray-800 border border-gray-100 focus:outline-none focus:border-green-400"
              />
            </div>
          </div>

          {message && (
            <p className={`text-sm text-center font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </p>
          )}

          <button
            onClick={handleUpdate}
            className="w-full h-14 bg-green-500 active:scale-95 text-white font-bold rounded-2xl transition-transform shadow-md"
          >
            Enregistrer les modifications
          </button>
        </section>

        <section className="bg-red-50 rounded-2xl border border-red-100 p-5 flex flex-col gap-4">
          <p className="text-[11px] text-red-400 leading-relaxed">
            La suppression de votre compte entraînera la suppression définitive de vos données, conformément au RGPD.
          </p>
          <button
            onClick={handleDelete}
            className="w-full h-12 bg-red-400 active:scale-95 text-white text-sm font-bold rounded-xl transition-transform shadow-sm flex items-center justify-center gap-2"
          >
            🗑️ Supprimer mon compte définitivement
          </button>
        </section>
      </main>

      <FooterNav estConnecte={true} estAdmin={estAdmin} />
      <div className="h-20" />
    </div>
  );
}

export const dynamic = 'force-dynamic'
