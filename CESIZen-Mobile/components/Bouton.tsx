import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type BoutonProps = {
  label: string;
  taille?: "normal" | "petit";
  variante?: "primaire" | "secondaire";
  onPress?: () => void;
};

export function Bouton({
  label,
  taille = "normal",
  variante = "primaire",
  onPress,
}: BoutonProps) {
  const isPetit = taille === "petit";
  const isPrimaire = variante === "primaire";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`
        w-full
        ${isPetit ? "h-10" : "h-14"}
        items-center justify-center
        rounded-xl
        ${isPrimaire ? "bg-green-200" : "bg-transparent border-2 border-green-600"}
      `}
    >
      <Text
        className={`
          font-semibold
          ${isPetit ? "text-sm" : "text-lg"}
          ${isPrimaire ? "text-black" : "text-green-600"}
        `}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
