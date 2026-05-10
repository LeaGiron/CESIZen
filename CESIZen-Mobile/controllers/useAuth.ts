import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform } from 'react-native';

export async function insererLog(
  type_action_log: string,
  statut_log: 'succès' | 'échec' | 'bloque',
  id_util: string | null = null
) {
  try {
    const { error } = await supabase.from('log_activite').insert({
      type_action_log,
      statut_log,
      id_util,
    });

    if (error) console.error("Log error:", error.message);
  } catch (e) {
    console.error("Log exception:", e);
  }
}

export async function inscription(
  email_util: string,
  mot_de_passe_util: string,
  nom_util: string,
  prenom_util: string
) {
  const erreurs = [];

  if (mot_de_passe_util.length < 12) erreurs.push('12 caractères');
  if (!/[A-Z]/.test(mot_de_passe_util)) erreurs.push('majuscule');
  if (!/[a-z]/.test(mot_de_passe_util)) erreurs.push('minuscule');
  if (!/[0-9]/.test(mot_de_passe_util)) erreurs.push('chiffre');
  if (!/[@$!%*?&]/.test(mot_de_passe_util)) erreurs.push('spécial');

  if (erreurs.length) {
    throw new Error(`Mot de passe incomplet : ${erreurs.join(', ')}`);
  }

  const { data, error } = await supabase.auth.signUp({
    email: email_util.trim().toLowerCase(),
    password: mot_de_passe_util,
    options: {
      data: { nom_util, prenom_util },
    },
  });

  if (error) throw error;

  if (data?.user) {
    const { error: dbError } = await supabase.from('utilisateur').upsert({
      id_util: data.user.id,
      nom_util,
      prenom_util,
      email_util: email_util.trim().toLowerCase(),
      type_util: 'Utilisateur',
      statut_compte_util: 'actif',
      date_creation_util: new Date().toISOString(),
      derniere_connexion_util: new Date().toISOString(),
    });

    if (dbError) throw dbError;

    await insererLog('creation_compte', 'succès', data.user.id);
  }

  return { success: true };
}

export async function connexion(email: string, mdp: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password: mdp,
  });

  if (error || !data.user) {
    await insererLog('connexion', 'échec');

    return {
      success: false,
      message: "Identifiants incorrects",
    };
  }

  const user = data.user;

  const { data: profil } = await supabase
    .from('utilisateur')
    .select('type_util')
    .eq('id_util', user.id)
    .single();

  await supabase
    .from('utilisateur')
    .update({ derniere_connexion_util: new Date().toISOString() })
    .eq('id_util', user.id);

  await insererLog('connexion', 'succès', user.id);

  return {
    success: true,
    role: profil?.type_util || 'Utilisateur',
  };
}

export async function supprimerCompteDefinitivement() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('utilisateur')
    .delete()
    .eq('id_util', user.id);

  if (error) throw error;

  // Même pattern que handleLogout pour éviter le blocage
  await Promise.race([
    supabase.auth.signOut(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 3000)
    ),
  ]).catch((e) => console.warn('signOut ignoré :', e.message));

  if (Platform.OS !== 'web') await AsyncStorage.clear();
}

export function useInscription() {
  const router = useRouter();

  const [nom_util, setNom] = useState('');
  const [prenom_util, setPrenom] = useState('');
  const [email_util, setEmail] = useState('');
  const [mot_de_passe_util, setMotDePasse] = useState('');
  const [messageErreur, setMessageErreur] = useState<string | null>(null);

  const handleInscription = async () => {
    setMessageErreur(null);

    try {
      await inscription(email_util, mot_de_passe_util, nom_util, prenom_util);
      router.push('/dashboard');
    } catch (err: any) {
      setMessageErreur(err.message);
    }
  };

  return {
    nom_util,
    setNom,
    prenom_util,
    setPrenom,
    email_util,
    setEmail,
    mot_de_passe_util,
    setMotDePasse,
    handleInscription,
    messageErreur,
  };
}

export function useConnexion() {
  const router = useRouter();

  const [email_util, setEmail] = useState('');
  const [mot_de_passe_util, setMotDePasse] = useState('');
  const [messageErreur, setMessageErreur] = useState<string | null>(null);

  const handleConnexion = async () => {
    setMessageErreur(null);

    try {
      const res = await connexion(email_util, mot_de_passe_util);

      if (!res.success) {
        setMessageErreur(res.message || "Erreur connexion");
        return;
      }

      if (res.role === 'Administrateur') {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }

    } catch (err: any) {
      setMessageErreur("Erreur serveur");
    }
  };

  return {
    email_util,
    setEmail,
    mot_de_passe_util,
    setMotDePasse,
    handleConnexion,
    messageErreur,
    router, 
  };
}

export function useMotDePasseOublie() {
  const router = useRouter();

  const [email_util, setEmail] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [messageErreur, setMessageErreur] = useState<string | null>(null);

const handleReinitialisation = async () => {
  setMessageErreur(null);

  if (!email_util) {
    setMessageErreur("Email requis");
    return;
  }

  try {
    const redirectUrl =
      Platform.OS === 'web'
        ? `${window.location.origin}/nouveau_mot_de_passe`
        : 'cesizen://nouveau_mot_de_passe';

    const emailNormalise = email_util.trim().toLowerCase();

    const { error } = await supabase.auth.resetPasswordForEmail(
      emailNormalise,
      { redirectTo: redirectUrl }
    );

    if (error) throw error;

    setEnvoye(true);

    const { data: utilisateurData, error: utilisateurError } = await supabase
      .from('utilisateur')
      .select('id_util')
      .eq('email_util', emailNormalise)
      .maybeSingle();

    if (utilisateurError) {
      console.error("Erreur récupération utilisateur :", utilisateurError.message);
    }

    const { error: insertError } = await supabase
      .from('reinitialisation_mot_de_passe')
      .insert({
        token_reinit: crypto.randomUUID(),
        id_util: utilisateurData?.id_util || null,
      });

    if (insertError) {
      console.error("Erreur insertion reinitialisation :", insertError.message);
    }

    await insererLog('reinitialisation_mdp', 'succès');

  } catch (err: any) {
    setMessageErreur(err.message);
    await insererLog('reinitialisation_mdp', 'échec');
  }
};

  return {
    email_util,
    setEmail,
    envoye,
    messageErreur,
    handleReinitialisation,
  };
}
