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

  const chargerRessources = async () => {
    const data = await getAllRessources();
    setRessources((data as Ressource[]) ?? []);
  };

  const verifierAccesAdministrateur = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      router.replace("/connexion");
      return false;
    }

    const role = await getRoleUtilisateur(user.id);
    const estAdmin = role?.trim().toLowerCase() === "administrateur";

    if (!estAdmin) {
      Alert.alert("Accès refusé", "Vous n'avez pas les droits administrateur.");
      router.replace("/");
      return false;
    }

    return true;
  };

  const initialiser = async () => {
    setChargement(true);

    try {
      const accesAutorise = await verifierAccesAdministrateur();

      if (accesAutorise) {
        await chargerRessources();
      }
    } catch {
      router.replace("/");
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    initialiser();
  }, []);

  const preparerModification = (ressource: Ressource) => {
    setForm({
      titre_ress: ressource.titre_ress,
      contenu_ress: ressource.contenu_ress,
      categorie_ress: ressource.categorie_ress,
      statut_ress: ressource.statut_ress,
    });

    setIdEnCoursEdition(String(ressource.id_ress));
    scrollToTopRef.current?.();
  };

  const annulerEdition = () => {
    setForm(FORM_VIDE);
    setIdEnCoursEdition(null);
  };

  const creerFormulaireSecurise = (): RessourceForm => ({
    titre_ress: form.titre_ress.trim(),
    contenu_ress: form.contenu_ress,
    categorie_ress: form.categorie_ress || "Stress",
    statut_ress: form.statut_ress ?? "brouillon",
  });

  const mettreAJourRessource = async (formSafe: RessourceForm) => {
    if (!idEnCoursEdition) {
      return;
    }

    const succes = await updateRessource(
      Number(idEnCoursEdition),
      formSafe
    );

    if (!succes) {
      afficherMessage("❌ Erreur lors de la modification.");
      return;
    }

    setRessources((prev) =>
      prev.map((ressource) =>
        String(ressource.id_ress) === idEnCoursEdition
          ? { ...ressource, ...formSafe }
          : ressource
      )
    );

    afficherMessage("✅ Ressource mise à jour !");
  };

  const ajouterRessource = async (formSafe: RessourceForm) => {
    const nouvelle = await insertRessource(formSafe);

    if (!nouvelle) {
      afficherMessage("❌ Erreur lors de l'ajout.");
      return;
    }

    setRessources((prev) => [nouvelle as Ressource, ...prev]);
    afficherMessage("✅ Ressource ajoutée !");
  };

  const validerFormulaire = async () => {
    if (!form.titre_ress.trim()) {
      afficherMessage("⚠️ Le titre est obligatoire.");
      return;
    }

    const formSafe = creerFormulaireSecurise();

    try {
      if (idEnCoursEdition) {
        await mettreAJourRessource(formSafe);
      } else {
        await ajouterRessource(formSafe);
      }

      annulerEdition();
    } catch {
      afficherMessage("❌ Une erreur est survenue.");
    }
  };

  const executerSuppression = async (id: string) => {
    const succes = await deleteRessource(Number(id));

    if (!succes) {
      afficherMessage("❌ Erreur lors de la suppression.");
      return;
    }

    setRessources((prev) => prev.filter((item) => String(item.id_ress) !== id));
    afficherMessage("✅ Ressource supprimée !");

    if (idEnCoursEdition === id) {
      annulerEdition();
    }
  };

  const supprimerRessource = (id: string) => {
    Alert.alert(
      "Supprimer la ressource",
      "Cette action est irréversible. Voulez-vous continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            executerSuppression(id);
          },
        },
      ]
    );
  };

  return {
    ressources,
    form,
    setForm,
    message,
    chargement,
    idEnCoursEdition,
    validerFormulaire,
    supprimerRessource,
    preparerModification,
    annulerEdition,
    scrollToTopRef,
  };
}