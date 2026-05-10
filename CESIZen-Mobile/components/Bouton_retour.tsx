import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

export default function BoutonRetour() {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      activeOpacity={0.7}
      // "flex-row" pour aligner l'icône et le texte
      className="flex-row items-center gap-1 min-h-[44px] min-w-[44px] px-2"
    >
      <FontAwesome name="chevron-left" size={16} color="#86efac" /> 
      
      <Text className="text-green-300 font-medium text-md">
        Retour
      </Text>
    </TouchableOpacity>
  );
}