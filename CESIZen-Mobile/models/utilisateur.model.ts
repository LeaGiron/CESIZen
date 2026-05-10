// Ici je définis à quoi ressemble un utilisateur dans mon appli.
// je l'ajoute ici et tous les fichiers qui utilisent ce type seront au courant.

export type Utilisateur = {
  token: string;
  prenom_util: string;
  nom_util: string;
  email_util: string;
};

// Les données qu'on envoie pour se connecter
export type ConnexionPayload = {
  email_util: string;
  mot_de_passe_util: string;
};

// Les données qu'on envoie pour s'inscrire
export type InscriptionPayload = {
  nom_util: string;
  prenom_util: string;
  email_util: string;
  mot_de_passe_util: string;
};