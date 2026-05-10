"use client"

// Définition des propriétés acceptées par le bouton
type BoutonRespirationProps = {
  onClick?: () => void;
  taille?: "normal" | "petit";
  phase: "inspiration" | "apnee" | "expiration" | "repos"; // Détermine la couleur
  icone: "play" | "pause" | "stop" | "reset";             // Détermine le dessin
};

export function BoutonRespiration({ onClick, taille = "normal", phase, icone }: BoutonRespirationProps) {
  
  // couleurs pastel
  const couleurs = {
    inspiration: "bg-blue-100 text-blue-500",   // Bleu pour l'inspiration
    apnee: "bg-orange-100 text-orange-500",     // Jaune/Ambre pour l'apnée
    expiration: "bg-green-100 text-green-500", // Vert pour l'expiration
    repos: "bg-gray-100 text-gray-400"          // Gris pour l'arrêt/repos
  };

  // Dessins des icônes en SVG
  const afficherIcone = () => {
    const s = taille === "petit" ? "24" : "32"; 
    if (icone === "play") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>;
    if (icone === "pause") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
    if (icone === "stop") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" /></svg>;
    if (icone === "reset") return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>;
    return null;
  };

  // forme de galet
  const style = "rounded-3xl flex items-center justify-center transition-all active:scale-90 shadow-sm";
  const tailleBouton = taille === "petit" ? "w-16 h-16" : "w-20 h-20";

  return (
    <button onClick={onClick} className={`${style} ${tailleBouton} ${couleurs[phase]}`}>
      {afficherIcone()}
    </button>
  );
}