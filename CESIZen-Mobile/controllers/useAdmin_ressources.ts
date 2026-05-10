import { supabase } from "@/lib/supabase";
import {
  deleteRessource,
  getAllRessources,
  getRoleUtilisateur,
  insertRessource,
  Ressource,
  RessourceForm,
  updateRessource,
} from "@/models/admin_ressources.model";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

const FORM_VIDE: RessourceForm = {
  titre_ress: "",
  contenu_ress: "",
  categorie_ress: "Stress",
  statut_ress: "brouillon",
};

type UseAdminRessourcesReturn = {
  ressources: Ressource[];
  form: RessourceForm;
  setForm: React.Dispatch<React.SetStateAction<RessourceForm>>;
  message: string;
  chargement: boolean;
  idEnCoursEdition: string | null; 
  validerFormulaire: () => Promise<void>;
  supprimerRessource: (id: string) => void;
  preparerModification: (ressource: Ressource) => void;
  annulerEdition: () => void;
  scrollToTopRef: React.MutableRefObject<(() => void) | null>;
};

export function useAdminRessources(): UseAdminRessourcesReturn {
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [form, setForm] = useState<RessourceForm>(FORM_VIDE);
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(true);
  const [idEnCoursEdition, setIdEnCoursEdition] = useState<string | null>(null);

  const scrollToTopRef = useRef<(() => void) | null>(null);
  const router = useRouter();

  const afficherMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    const initialiser = async () => {
      setChargement(true);
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          router.replace("/connexion");
          return;
        }

        const role = await getRoleUtilisateur(user.id);

        if (!role || role.trim().toLowerCase() !== "administrateur") {
          Alert.alert("Accès refusé", "Vous n'avez pas les droits administrateur.");
          router.replace("/"); 
          return;
        }

        const data = await getAllRessources();
        setRessources(data as Ressource[] ?? []);
      } catch (err) {
        console.error("Erreur initialisation admin:", err);
        router.replace("/");
      } finally {
        setChargement(false);
      }
    };

    initialiser();
  }, []);

  const preparerModification = (ressource: Ressource) => {
    setForm({
      titre_ress: ressource.titre_ress,
      contenu_ress: ressource.contenu_ress,
      categorie_ress: ressource.categorie_ress,
      statut_ress: ressource.statut_ress,
    });
    setIdEnCoursEdition(ressource.id_ress);
    
    scrollToTopRef.current?.();
  };

  const annulerEdition = () => {
    setForm(FORM_VIDE);
    setIdEnCoursEdition(null);
  };

  const validerFormulaire = async () => {
    if (!form.titre_ress.trim()) {
      afficherMessage("⚠️ Le titre est obligatoire.");
      return;
    }

    const formSafe: RessourceForm = {
      titre_ress: form.titre_ress.trim(),
      contenu_ress: form.contenu_ress,
      categorie_ress: form.categorie_ress || "Stress",
      statut_ress: form.statut_ress ?? "brouillon",
    };

    try {
      if (idEnCoursEdition !== null) {
        const succes = await updateRessource(idEnCoursEdition, formSafe);
        if (succes) {
          setRessources(prev =>
            prev.map(r => r.id_ress === idEnCoursEdition ? { ...r, ...formSafe } : r)
          );
          afficherMessage("✅ Ressource mise à jour !");
        } else {
          afficherMessage("❌ Erreur lors de la modification.");
        }
      } else {
        const nouvelle = await insertRessource(formSafe);
        if (nouvelle) {
          setRessources(prev => [nouvelle as Ressource, ...prev]);
          afficherMessage("✅ Ressource ajoutée !");
        } else {
          afficherMessage("❌ Erreur lors de l'ajout.");
        }
      }
      annulerEdition();
    } catch (err) {
      afficherMessage("❌ Une erreur est survenue.");
    }
  };

  const supprimerRessource = (id: string) => {
    // ✅ Utilisation de l'Alert native mobile pour confirmer
    Alert.alert(
      "Supprimer la ressource",
      "Cette action est irréversible. Voulez-vous continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const succes = await deleteRessource(id);
            if (succes) {
              setRessources(prev => prev.filter(item => item.id_ress !== id));
              afficherMessage("✅ Ressource supprimée !");
              if (idEnCoursEdition === id) annulerEdition();
            } else {
              afficherMessage("❌ Erreur lors de la suppression.");
            }
          },
        },
      ]
    );
  };

  return {
    ressources, form, setForm, message, chargement,
    idEnCoursEdition, validerFormulaire, supprimerRessource,
    preparerModification, annulerEdition, scrollToTopRef,
  };
}