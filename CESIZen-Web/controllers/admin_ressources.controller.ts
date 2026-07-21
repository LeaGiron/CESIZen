import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase";
import {
  getAllRessources,
  insertRessource,
  updateRessource,
  deleteRessource,
  getRoleUtilisateur,
  Ressource,
  RessourceForm,
} from "@/models/admin_ressource.model";

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
  idEnCoursEdition: number | null;
  validerFormulaire: (e: React.FormEvent) => Promise<void>;
  supprimerRessource: (id: number) => Promise<void>;
  preparerModification: (ressource: Ressource) => void;
  annulerEdition: () => void;
};

export function useAdminRessources(): UseAdminRessourcesReturn {
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [form, setForm] = useState<RessourceForm>(FORM_VIDE);
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(true);
  const [idEnCoursEdition, setIdEnCoursEdition] = useState<number | null>(null);

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
          router.push("/connexion");
          return;
        }

        const role = await getRoleUtilisateur(user.id);

        if (role?.trim().toLowerCase() !== "administrateur") {
          router.push("/");
          return;
        }

        const data = await getAllRessources();

        setRessources(data ?? []);
      } finally {
        setChargement(false);
      }
    };

    initialiser();
  }, [router]);

  const preparerModification = (ressource: Ressource) => {
    setForm({
      titre_ress: ressource.titre_ress,
      contenu_ress: ressource.contenu_ress,
      categorie_ress: ressource.categorie_ress,
      statut_ress: ressource.statut_ress,
    });

    setIdEnCoursEdition(ressource.id_ress);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const annulerEdition = () => {
    setForm(FORM_VIDE);
    setIdEnCoursEdition(null);
  };

  const validerFormulaire = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.titre_ress.trim()) return;

    const formSafe: RessourceForm = {
      titre_ress: form.titre_ress,
      contenu_ress: form.contenu_ress,
      categorie_ress: form.categorie_ress || "Stress",
      statut_ress: form.statut_ress ?? "brouillon",
    };

    if (idEnCoursEdition !== null) {
      const succes = await updateRessource(idEnCoursEdition, formSafe);

      if (succes) {
        setRessources(prev =>
          prev.map(r =>
            r.id_ress === idEnCoursEdition ? { ...r, ...formSafe } : r
          )
        );

        afficherMessage("✅ Ressource mise à jour !");
      } else {
        afficherMessage("❌ Erreur lors de la modification.");
      }
    } else {
      const nouvelle = await insertRessource(formSafe);

      if (nouvelle) {
        setRessources(prev => [nouvelle, ...prev]);
        afficherMessage("✅ Ressource ajoutée !");
      } else {
        afficherMessage("❌ Erreur lors de l'ajout.");
      }
    }

    annulerEdition();
  };

  const supprimerRessource = async (id: number) => {
    if (!window.confirm("Supprimer cette ressource ?")) return;

    const succes = await deleteRessource(id);

    if (succes) {
      setRessources(prev => prev.filter(item => item.id_ress !== id));
      afficherMessage("✅ Ressource supprimée !");

      if (idEnCoursEdition === id) {
        annulerEdition();
      }
    } else {
      afficherMessage("❌ Erreur lors de la suppression.");
    }
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
  };
}