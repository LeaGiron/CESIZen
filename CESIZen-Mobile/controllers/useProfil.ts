import { supprimerCompteDefinitivement } from '@/controllers/useAuth';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ProfilLabels } from '../models/profil.model';

const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch {}
};

export function useProfil() {
  const router = useRouter();
  const [form, setForm] = useState({ nom_util: '', prenom_util: '', email_util: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerProfil();
  }, []);

  const chargerProfil = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/connexion');
        return;
      }

      const { data: profil } = await supabase
        .from('utilisateur')
        .select('prenom_util, nom_util, email_util')
        .eq('id_util', user.id)
        .single();

      setForm({
        prenom_util: profil?.prenom_util || user.user_metadata?.prenom_util || '',
        nom_util: profil?.nom_util || user.user_metadata?.nom_util || '',
        email_util: profil?.email_util || user.email || '',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email_util.trim())) {
      setMessage('❌ Adresse e-mail invalide');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non connecté');

      const { error: dbError } = await supabase
        .from('utilisateur')
        .update({
          prenom_util: form.prenom_util,
          nom_util: form.nom_util,
          email_util: form.email_util.trim().toLowerCase(),
        })
        .eq('id_util', user.id);

      if (dbError) throw dbError;

      setMessage(ProfilLabels.messages.succes);
      await AsyncStorage.setItem('prenom_util', form.prenom_util);
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(ProfilLabels.messages.erreur);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Supprimer mon compte',
      'Cette action est irréversible. Toutes vos données seront définitivement effacées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Suppression lancée');
              await supprimerCompteDefinitivement();
              console.log('Suppression OK');
              await clearStorage();
              router.replace('/connexion');
            } catch (err: any) {
              console.log('Erreur suppression:', err.message);
              Alert.alert('Erreur', err.message);
            }
          },
        },
      ]
    );
  };

  const handlePasswordReset = async () => {
    Alert.alert(
      'Modifier le mot de passe',
      'Voulez-vous recevoir un e-mail pour configurer un nouveau mot de passe ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              const { error } = await supabase.auth.resetPasswordForEmail(form.email_util, {
                redirectTo: 'cesizen://reset-password',
              });
              if (error) throw error;
              Alert.alert('Succès', 'Un e-mail de réinitialisation vous a été envoyé.');
            } catch (error: any) {
              Alert.alert('Erreur', error.message || "Impossible d'envoyer l'e-mail.");
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    await Promise.race([
      supabase.auth.signOut(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 3000)
      ),
    ]).catch((e) => console.warn('signOut ignoré :', e.message));

    await clearStorage();
    router.replace('/connexion');
  };

  return {
    form,
    setForm,
    message,
    loading,
    handleUpdate,
    handleDelete,
    handlePasswordReset,
    handleLogout,
    router,
  };
}
