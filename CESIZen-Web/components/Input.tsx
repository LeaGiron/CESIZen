"use client"

// Définit ce que le composant accepte comme paramètres
type InputProps = {
  type?: string;        // Le type du champ : "text", "email", "password"
  placeholder: string;  
  value?: string;       // La valeur actuelle du champ
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  // Fonction déclenchée à chaque frappe au clavier
  // e = l'événement qui contient la nouvelle valeur tapée (e.target.value)
};

// Reçoit les props avec leurs valeurs par défaut
export function Input({ type = "text", placeholder, value, onChange }: InputProps) {
  return (
    <input
      type={type}           // Définit le comportement exemple password masque les caractères
      placeholder={placeholder} 
      value={value}         // Valeur actuelle contrôlée par le useState
      onChange={onChange}   // Appelle setEmail / setMotDePasse à chaque frappe

      className="
        w-full              // Prend toute la largeur disponible
        h-12                // Hauteur pour appuyer avec le doigt sur mobile
        bg-gray-100         
        rounded-xl          /
        px-4                // Espace intérieur gauche/droite pour que le texte ne colle pas au bord
        text-left           
        text-base           // Taille de texte lisible sur mobile
        text-gray-800       
        placeholder:text-gray-400 
        border border-gray-200     
        focus:outline-none         
        focus:border-green-300      // Remplace par une bordure verte quand le champ est actif
      "
    />
  );
}