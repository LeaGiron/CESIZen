import { useEffect, useState } from 'react';
import * as RessourceModel from "../models/ressource.model";

const STATUT = "publie";

export const useRessources = () => {
  const [ressources, setRessources] = useState<any[]>([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [categorieActive, setCategorieActive] = useState("Toutes");

  useEffect(() => {
    charger();
  }, []);

  const charger = async () => {
    setChargement(true);
    const res = await RessourceModel.listerToutesLesRessources();
    if (res.success) setRessources(res.data);
    setChargement(false);
  };

  const ressourcesFiltrees = ressources.filter(r => {
    const matchStatut = r.statut_ress === STATUT;
    const matchRecherche = r.titre_ress?.toLowerCase().includes(recherche.toLowerCase());
    const matchCategorie =
      categorieActive === "Toutes" || r.categorie_ress === categorieActive;

    return matchStatut && matchRecherche && matchCategorie;
  });

  const categories = [
    "Toutes",
    ...new Set(
      ressources
        .filter(r => r.statut_ress === STATUT)
        .map(r => r.categorie_ress)
        .filter(Boolean)
    )
  ];

  return {
    ressourcesFiltrees,
    recherche,
    setRecherche,
    categorieActive,
    setCategorieActive,
    chargement,
    categories,
    actualiser: charger,
  };
};