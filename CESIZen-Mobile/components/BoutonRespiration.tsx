import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Bibliothèque d'icônes standard Expo

type BoutonRespirationProps = {
  onPress?: () => void;
  taille?: "normal" | "petit";
  phase: "inspiration" | "apnee" | "expiration" | "repos";
  icone: "play" | "pause" | "stop" | "reset";
};

export function BoutonRespiration({ onPress, taille = "normal", phase, icone }: BoutonRespirationProps) {
  
  // Configuration des couleurs (Fond et Icône)
  const themes = {
    inspiration: { bg: "bg-blue-100", icon: "#3b82f6" }, // Bleu-500
    apnee: { bg: "bg-orange-100", icon: "#f97316" },       // Orange-500
    expiration: { bg: "bg-green-100", icon: "#22c55e" },   // Green-500
    repos: { bg: "bg-gray-100", icon: "#9ca3af" }         // Gray-400
  };

  // Mapping des noms d'icônes pour Ionicons
  const iconMapping: Record<string, keyof typeof Ionicons.glyphMap> = {
    play: "play",
    pause: "pause",
    stop: "square",
    reset: "refresh"
  };

  const isPetit = taille === "petit";
  const sizeIcone = isPetit ? 28 : 36;
  const currentTheme = themes[phase];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      // "active:scale-90" fonctionne avec NativeWind v4 pour l'effet rebond
      className={`
        ${isPetit ? "w-16 h-16" : "w-24 h-24"} 
        ${currentTheme.bg} 
        rounded-[35px] 
        items-center 
        justify-center 
        shadow-sm 
        active:scale-90
      `}
    >
      <Ionicons 
        name={iconMapping[icone]} 
        size={sizeIcone} 
        color={currentTheme.icon} 
      />
    </TouchableOpacity>
  );
}