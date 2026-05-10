import { TextInput, View } from 'react-native';

type InputProps = {
  type?: "text" | "email" | "password" | "numeric";
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void; // RN renvoie directement le texte, pas l'événement 'e'
};

export function Input({ type = "text", placeholder, value, onChangeText }: InputProps) {
  
  // Configuration spécifique au mobile selon le type
  const isPassword = type === "password";
  const keyboardType = type === "email" ? "email-address" : type === "numeric" ? "numeric" : "default";

  return (
    <View className="w-full mb-4">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af" 
        
        // Sécurité et Clavier
        secureTextEntry={isPassword}   // Masque les caractères pour le mot de passe
        keyboardType={keyboardType}    // Affiche le "@" pour l'email ou le pavé numérique
        autoCapitalize="none"          // Évite que le mobile mette une majuscule à l'email
        
        className="
          w-full
          h-14
          bg-gray-100
          rounded-2xl
          px-4
          text-base
          text-gray-800
          border border-gray-200
          focus:border-green-400
        "
      />
    </View>
  );
}