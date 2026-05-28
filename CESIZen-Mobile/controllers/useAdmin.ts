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

  const afficherMessageTemporaire = (texte: string) => {
    setMessage(texte);
    setTimeout(() => setMessage(''), 3000);
  };

  const verifierUtilisateurConnecte = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      router.replace('/connexion');
      return null;
    }

    return user;
  };

  const verifierRoleAdministrateur = async (idUtilisateur: string) => {
    const { data, error } = await supabase
      .from('utilisateur')
      .select('type_util')
      .eq('id_util', idUtilisateur)
      .single();

    if (error) {
      return false;
    }

    return data?.type_util?.toLowerCase() === 'administrateur';
  };

  const chargerRessources = async () => {
    const { data, error } = await supabase
      .from('ressource')
      .select('*')
      .order('id_ress', { ascending: false });

    if (error) {
      afficherMessageTemporaire('❌ Erreur de chargement des ressources.');
      return;
    }

    const ressourcesFormatees: RessourceAdmin[] = (data ?? []).map((item) => ({
      id: Number(item.id_ress),
      titre: item.titre_ress,
      categorie: item.categorie_ress,
    }));

    setRessources(ressourcesFormatees);
  };

  const initialiserAdmin = async () => {
    try {
      const user = await verifierUtilisateurConnecte();

      if (!user) {
        return;
      }

      const estAdmin = await verifierRoleAdministrateur(user.id);

      if (!estAdmin) {
        Alert.alert(
          'Accès refusé',
          "Vous n'avez pas les droits nécessaires."
        );
        router.replace('/dashboard');
        return;
      }

      await chargerRessources();
    } catch {
      router.replace('/dashboard');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    initialiserAdmin();
  }, []);

  const ajouterRessource = async () => {
    if (!nouveauTitre.trim() || !nouvelleCategorie.trim()) {
      afficherMessageTemporaire('❌ Veuillez remplir tous les champs.');
      return;
    }

    try {
      setAjoutEnCours(true);

      const { data, error } = await supabase
        .from('ressource')
        .insert([
          {
            titre_ress: nouveauTitre.trim(),
            categorie_ress: nouvelleCategorie.trim(),
            contenu_ress: '',
            statut_ress: 'publie',
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      if (data?.[0]) {
        const nouvelleRessource: RessourceAdmin = {
          id: Number(data[0].id_ress),
          titre: data[0].titre_ress,
          categorie: data[0].categorie_ress,
        };

        setRessources((ressourcesActuelles) => [
          nouvelleRessource,
          ...ressourcesActuelles,
        ]);

        setNouveauTitre('');
        setNouvelleCategorie('');
        afficherMessageTemporaire('✅ Ressource ajoutée !');
      }
    } catch {
      afficherMessageTemporaire("❌ Erreur lors de l'ajout.");
    } finally {
      setAjoutEnCours(false);
    }
  };

  const confirmerSuppression = async (id: number) => {
    const { error } = await supabase
      .from('ressource')
      .delete()
      .eq('id_ress', String(id));

    if (error) {
      afficherMessageTemporaire('❌ Impossible de supprimer.');
      return;
    }

    setRessources((prev) => prev.filter((item) => item.id !== id));
    afficherMessageTemporaire('✅ Ressource supprimée.');
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
          onPress: () => confirmerSuppression(id),
        },
      ]
    );
  };

  return {
    ressources,
    chargement,
    nouveauTitre,
    setNouveauTitre,
    nouvelleCategorie,
    setNouvelleCategorie,
    message,
    ajoutEnCours,
    ajouterRessource,
    supprimerRessource,
  };
}