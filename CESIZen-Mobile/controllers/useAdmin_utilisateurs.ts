import { supabase } from "@/lib/supabase";
import { getRoleUtilisateur } from "@/models/admin_ressources.model";
import {
  deverrouillerUtilisateur,
  getAllUtilisateurs,
  updateUtilisateur,
  Utilisateur,
  UtilisateurForm,
} from "@/models/admin_utilisateurs.model";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

const SUPABASE_URL = "https://sdhqqvztxnbjecekkkkl.supabase.co";

const FORM_VIDE: UtilisateurForm = {
  nom_util: "",
  prenom_util: "",
  email_util: "",
  mdp_util: "",
  type_util: "Utilisateur",
  statut_compte_util: "actif",
};

type CreationUtilisateurResponse = {
  error?: string;
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

  const normaliserUtilisateur = (utilisateur: Utilisateur): Utilisateur => ({
    ...utilisateur,
    type_util:
      utilisateur.type_util === "Administrateur" ||
      utilisateur.type_util === "Utilisateur"
        ? utilisateur.type_util
        : "Utilisateur",
    statut_compte_util: utilisateur.statut_compte_util ?? "actif",
  });

  const chargerDonnees = async () => {
    const rawData = await getAllUtilisateurs();
    setUtilisateurs(rawData.map(normaliserUtilisateur));
  };

  const verifierAccesAdministrateur = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/connexion");
      return false;
    }

    const role = await getRoleUtilisateur(user.id);

    if (role?.trim().toLowerCase() !== "administrateur") {
      router.replace("/");
      return false;
    }

    return true;
  };

  const initialiser = async () => {
    try {
      const accesAutorise = await verifierAccesAdministrateur();

      if (accesAutorise) {
        await chargerDonnees();
      }
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    initialiser();
  }, []);

  const modifierUtilisateur = async () => {
    if (!idEnCoursEdition) {
      return;
    }

    const succes = await updateUtilisateur(idEnCoursEdition, form);

    if (!succes) {
      afficherMessage("❌ Erreur lors de la mise à jour.");
      return;
    }

    afficherMessage("✅ Membre mis à jour !");
    await chargerDonnees();
    annulerEdition();
  };

  const appelerCreationUtilisateur = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch(`${SUPABASE_URL}/functions/v1/creer-utilisateur`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(form),
    });

    const json = (await response.json()) as CreationUtilisateurResponse;

    if (!response.ok) {
      throw new Error(json.error || "Erreur lors de la création");
    }
  };

  const creerUtilisateur = async () => {
    try {
      await appelerCreationUtilisateur();
      afficherMessage("✅ Utilisateur créé !");
      await chargerDonnees();
      annulerEdition();
    } catch (error) {
      const messageErreur =
        error instanceof Error ? error.message : "Erreur lors de la création";
      afficherMessage(`❌ ${messageErreur}`);
    }
  };

  const validerFormulaire = async () => {
    if (idEnCoursEdition) {
      await modifierUtilisateur();
      return;
    }

    await creerUtilisateur();
  };

  const executerSuppressionUtilisateur = async (id: string) => {
    const { error } = await supabase
      .from("utilisateur")
      .delete()
      .eq("id_util", id);

    if (error) {
      afficherMessage("❌ Erreur lors de la suppression");
      return;
    }

    setUtilisateurs((prev) =>
      prev.filter((utilisateur) => utilisateur.id_util !== id)
    );

    afficherMessage("✅ Supprimé !");
  };

  const supprimerUtilisateur = (id: string) => {
    Alert.alert("Confirmation", "Supprimer définitivement ce compte ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          executerSuppressionUtilisateur(id);
        },
      },
    ]);
  };

  const deverrouiller = async (id: string) => {
    const succes = await deverrouillerUtilisateur(id);

    if (!succes) {
      afficherMessage("❌ Erreur lors du déverrouillage.");
      return;
    }

    await chargerDonnees();
    afficherMessage("✅ Déverrouillé !");
  };

  const preparerModification = (utilisateur: Utilisateur) => {
    setForm({
      nom_util: utilisateur.nom_util ?? "",
      prenom_util: utilisateur.prenom_util ?? "",
      email_util: utilisateur.email_util ?? "",
      mdp_util: "",
      type_util:
        utilisateur.type_util === "Administrateur"
          ? "Administrateur"
          : "Utilisateur",
      statut_compte_util: utilisateur.statut_compte_util ?? "actif",
    });

    setIdEnCoursEdition(utilisateur.id_util);
    scrollToTopRef.current?.();
  };

  const annulerEdition = () => {
    setForm(FORM_VIDE);
    setIdEnCoursEdition(null);
  };

  return {
    utilisateurs,
    form,
    setForm,
    message,
    chargement,
    idEnCoursEdition,
    validerFormulaire,
    supprimerUtilisateur,
    deverrouiller,
    preparerModification,
    annulerEdition,
    scrollToTopRef,
  };
}