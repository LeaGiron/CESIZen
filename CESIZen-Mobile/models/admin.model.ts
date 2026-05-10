// Je décris ici les types utilisés dans la page admin.
// La structure est légèrement différente de ressource.model.ts
// car la table admin utilise des champs différents (id au lieu de id_ress, etc.)

export type RessourceAdmin = {
  id: number;
  titre: string;
  categorie: string;
};

// Les données envoyées pour créer une nouvelle ressource
export type NouvelleRessource = {
  titre: string;
  categorie: string;
};
