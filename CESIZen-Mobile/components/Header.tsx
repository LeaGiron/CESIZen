import { View, Image } from 'react-native';

type HeaderProps = {
  variante?: "normal" | "accueil";
};

export function Header({ variante = "normal" }: HeaderProps) {
  // Définition des tailles en pixels (les nombres sans unités sont des dp/pt sur mobile)
  const taille = variante === "accueil" ? 100 : 80;

  return (
    <View className="flex-row justify-center w-full py-4">
      <Image
        // Assure-toi que ton image est dans cesizen-mobile/assets/logo-cesizen.png
        source={require('../assets/logo-cesizen.png')}
        style={{ width: taille, height: taille }}
        // "contain" s'assure que l'image ne soit pas rognée ou déformée
        resizeMode="contain"
      />
    </View>
  );
}