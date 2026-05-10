import { supabase } from "@/lib/supabase";
import { getRoleUtilisateur } from "@/models/admin_ressources.model";
import {
  deverrouillerUtilisateurs,
  getAllUtilisateurs, updateUtilisateur,
  Utilisateur, UtilisateurForm,
} from "@/models/admin_utilisateurs.model";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

const SUPABASE_URL = 'https://sdhqqvztxnbjecekkkkl.supabase.co'; // ← remplacez ici

const FORM_VIDE: UtilisateurForm = {
  nom_util: "", prenom_util: "", email_util: "",
  mdp_util: "", type_util: "Utilisateur", statut_compte_util: "actif",
};

export function useAdminUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [form, setForm] = useState<UtilisateurForm>(FORM_VIDE);
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(true);
  const [idEnCoursEdition, setIdEnCoursEdition] = useState<string | null>(null);

  const router = useRouter();
  const scrollToTopRef = useRef<(() => void) | null>(null);

  const afficherMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const chargerDonnees = async () => {
    const rawData = await getAllUtilisateurs();
    const dataNettoyee: Utilisateur[] = rawData.map(u => ({
      ...u,
      type_util: (u.type_util === "Administrateur" || u.type_util === "Utilisateur")
        ? u.type_util
        : "Utilisateur",
      statut_compte_util: u.statut_compte_util ?? "actif",
    }));
    setUtilisateurs(dataNettoyee);
  };

  useEffect(() => {
    const initialiser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/connexion"); return; }
      const role = await getRoleUtilisateur(user.id);
      if (role?.trim().toLowerCase() !== "administrateur") { router.replace("/"); return; }
      await chargerDonnees();
      setChargement(false);
    };
    initialiser();
  }, []);

  const validerFormulaire = async () => {
    if (idEnCoursEdition) {
      const succes = await updateUtilisateur(idEnCoursEdition, form);
      if (succes) {
        afficherMessage("✅ Membre mis à jour !");
        await chargerDonnees();
        annulerEdition();
      }
    } else {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const url = `${SUPABASE_URL}/functions/v1/creer-utilisateur`;
        console.log('URL appelée:', url);
        console.log('Session token:', session?.access_token ? 'présent' : 'absent');

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(form),
        });

        const json = await res.json();
        console.log('Réponse:', json);

        if (!res.ok) throw new Error(json.error || 'Erreur lors de la création');

        afficherMessage("✅ Utilisateur créé !");
        await chargerDonnees();
        annulerEdition();

      } catch (e: any) {
        console.log('Erreur fetch:', e.message);
        afficherMessage(`❌ ${e.message}`);
      }
    }
  };

  const supprimerUtilisateur = async (id: string) => {
    Alert.alert("Confirmation", "Supprimer définitivement ce compte ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer", style: "destructive", onPress: async () => {
          const { error } = await supabase
            .from('utilisateur')
            .delete()
            .eq('id_util', id);

          if (!error) {
            setUtilisateurs(prev => prev.filter(u => u.id_util !== id));
            afficherMessage("✅ Supprimé !");
          } else {
            afficherMessage("❌ Erreur lors de la suppression");
          }
        }
      }
    ]);
  };

  const deverrouiller = async (id: string) => {
    if (await deverrouillerUtilisateurs(id)) {
      await chargerDonnees();
      afficherMessage("✅ Déverrouillé !");
    }
  };

  const preparerModification = (u: Utilisateur) => {
    setForm({
      nom_util: u.nom_util ?? "",
      prenom_util: u.prenom_util ?? "",
      email_util: u.email_util ?? "",
      mdp_util: "",
      type_util: u.type_util === "Administrateur" ? "Administrateur" : "Utilisateur",
      statut_compte_util: u.statut_compte_util ?? "actif",
    });
    setIdEnCoursEdition(u.id_util);
    scrollToTopRef.current?.();
  };

  const annulerEdition = () => { setForm(FORM_VIDE); setIdEnCoursEdition(null); };

  return {
    utilisateurs, form, setForm, message, chargement, idEnCoursEdition,
    validerFormulaire, supprimerUtilisateur, deverrouiller, preparerModification, annulerEdition, scrollToTopRef
  };
}