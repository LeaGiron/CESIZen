export interface ProfilData {
  nom_util: string;
  prenom_util: string;
  email_util: string;
}

export const ProfilLabels = {
  titre: "👤 Mon profil",
  sections: {
    infos: "Mes informations",
  },
  inputs: {
    prenom: "Prénom",
    nom: "Nom",
    email: "Email",
  },
  boutons: {
    sauvegarder: "Enregistrer les modifications",
    deconnexion: "Déconnexion",
  },
  messages: {
    succes: "✅ Profil mis à jour !",
    erreur: "❌ Erreur lors de la mise à jour.",
  }
};