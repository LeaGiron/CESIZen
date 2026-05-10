import { View, Text } from 'react-native';

export function Separateur() {
  return (
    <View className="flex-row items-center w-full gap-3 py-6">
      {/* Ligne de gauche */}
      <View className="flex-1 h-[1px] bg-gray-300" />
      
      {/* Texte central */}
      <Text className="text-gray-400 text-sm font-medium uppercase tracking-widest">
        ou
      </Text>
      
      {/* Ligne de droite */}
      <View className="flex-1 h-[1px] bg-gray-300" />
    </View>
  );
}