import { supabase } from '@/lib/supabase';
import { RessourceAdmin } from '@/models/admin.model';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useAdmin() {
  const router = useRouter();
  const [ressources, setRessources] = useState<RessourceAdmin[]>([]);
  const [chargement, setChargement] = useState(true);
  const [nouveauTitre, setNouveauTitre] = useState('');
  const [nouvelleCategorie, setNouvelleCategorie] = useState('');
  const [message, setMessage] = useState('');
  const [ajoutEnCours, setAjoutEnCours] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          console.log("Utilisateur non authentifié");
          router.replace('/connexion');
          return;
        }

        const { data: profil, error: roleError } = await supabase
          .from('utilisateur')
          .select('type_util')
          .eq('id_util', user.id)
          .single();

        console.log("[DEBUG] Rôle récupéré en BDD :", profil?.type_util);

        const estAdmin = profil?.type_util?.toLowerCase() === 'administrateur';

        if (roleError || !estAdmin) {
          console.log("Accès refusé : l'utilisateur n'est pas admin.");
          Alert.alert("Accès refusé", "Vous n'avez pas les droits nécessaires.");
          router.replace('/dashboard');
          return;
        }

        await chargerRessources();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation Admin:', error);
        router.replace('/dashboard');
      } finally {
        setChargement(false);
      }
    };

    init();
  }, []);

  const chargerRessources = async () => {
    const { data, error } = await supabase
      .from('ressource')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Erreur de chargement des ressources:', error.message);
    } else {
      setRessources(data as RessourceAdmin[]);
    }
  };

  const ajouterRessource = async () => {
    if (!nouveauTitre.trim() || !nouvelleCategorie.trim()) {
      setMessage('❌ Veuillez remplir tous les champs.');
      return;
    }

    try {
      setAjoutEnCours(true);
      const { data, error } = await supabase
        .from('ressource')
        .insert([{ 
          titre: nouveauTitre.trim(), 
          categorie: nouvelleCategorie.trim() 
        }])
        .select();

      if (error) throw error;

      if (data) {
        setRessources([data[0] as RessourceAdmin, ...ressources]);
        setNouveauTitre('');
        setNouvelleCategorie('');
        setMessage('✅ Ressource ajoutée !');
      }
    } catch (error: any) {
      setMessage('❌ Erreur lors de l\'ajout.');
      console.error(error);
    } finally {
      setAjoutEnCours(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const supprimerRessource = (id: number) => {
    Alert.alert(
      'Suppression',
      'Voulez-vous vraiment supprimer cette ressource ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('ressource')
              .delete()
              .eq('id', id);

            if (error) {
              setMessage('❌ Impossible de supprimer.');
            } else {
              setRessources((prev) => prev.filter((item) => item.id !== id));
              setMessage('✅ Ressource supprimée.');
              setTimeout(() => setMessage(''), 3000);
            }
          },
        },
      ]
    );
  };

  return {
    ressources, chargement, nouveauTitre, setNouveauTitre,
    nouvelleCategorie, setNouvelleCategorie, message,
    ajoutEnCours, ajouterRessource, supprimerRessource,
  };
}