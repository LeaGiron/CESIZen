import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase";
import {
  getAllUtilisateurs, updateUtilisateur,
  deverrouillerUtilisateur, Utilisateur, UtilisateurForm,
} from "@/models/admin_utilisateur.model";
import { getRoleUtilisateur } from "@/models/admin_ressource.model";

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

  const afficherMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const chargerDonnees = async () => {
    const data = await getAllUtilisateurs();
    setUtilisateurs(data);
  };

  useEffect(() => {
    const initialiser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/connexion"); return; }
      const role = await getRoleUtilisateur(user.id);
      if (role?.trim().toLowerCase() !== "administrateur") { router.push("/"); return; }
      await chargerDonnees();
      setChargement(false);
    };
    initialiser();
  }, [router]);

  const validerFormulaire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idEnCoursEdition) {
      // MODIFICATION
      const succes = await updateUtilisateur(idEnCoursEdition, form);
      if (succes) {
        afficherMessage("✅ Membre mis à jour !");
        await chargerDonnees();
        annulerEdition();
      }
    } else {
      // CRÉATION (Via API pour gérer Auth + Public)
      const res = await fetch('/api/admin/creer-utilisateur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        afficherMessage("✅ Utilisateur créé !");
        await chargerDonnees();
        annulerEdition();
      } else {
        afficherMessage("❌ Erreur lors de la création.");
      }
    }
  };

  const supprimerUtilisateur = async (id: string) => {
    if (!window.confirm("Supprimer définitivement ce compte ?")) return;
    const res = await fetch('/api/admin/supprimer-utilisateur', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id }),
    });
    if (res.ok) {
      setUtilisateurs(prev => prev.filter(u => u.id_util !== id));
      afficherMessage("✅ Supprimé !");
    }
  };

  const deverrouiller = async (id: string) => {
    if (await deverrouillerUtilisateur(id)) {
      await chargerDonnees();
      afficherMessage("✅ Déverrouillé !");
    }
  };

  const preparerModification = (u: Utilisateur) => {
    setForm({ ...u, mdp_util: "" });
    setIdEdition(u.id_util);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const annulerEdition = () => { setForm(FORM_VIDE); setIdEdition(null); };
  const setIdEdition = (id: string | null) => setIdEnCoursEdition(id);

  return { 
    utilisateurs, form, setForm, message, chargement, idEnCoursEdition, 
    validerFormulaire, supprimerUtilisateur, deverrouiller, preparerModification, annulerEdition 
  };
}