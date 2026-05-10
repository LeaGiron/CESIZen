import { Ionicons } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function FooterNav({ estConnecte }: { estConnecte: boolean }) {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Détection améliorée pour le dossier ressources
  const isRessourcesActive = pathname.startsWith('/ressources');
  const isDashboardActive = pathname === '/dashboard';
  const isRespirationActive = pathname === '/respiration';
  const isAccountActive = pathname === '/profil' || pathname === '/connexion';

  return (
    <View 
      style={[
        styles.footerFixed, 
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }
      ]}
      className="bg-white border-t border-gray-100 flex-row justify-around items-center pt-3 shadow-lg"
    >
      {/* Accueil */}
      <Link href="/dashboard" asChild>
        <TouchableOpacity className="flex-col items-center justify-center min-w-[44px] min-h-[44px]">
          <Ionicons 
            name={isDashboardActive ? "home" : "home-outline"} 
            size={24} 
            color={isDashboardActive ? '#16a34a' : '#9ca3af'} 
          />
          <Text className={`text-[10px] font-bold mt-1 ${isDashboardActive ? 'text-green-600' : 'text-gray-400'}`}>
            Accueil
          </Text>
        </TouchableOpacity>
      </Link>

      {/* Ressources - CHEMIN CORRIGÉ */}
      <Link href="/ressources/ressources" asChild>
        <TouchableOpacity className="flex-col items-center justify-center min-w-[44px] min-h-[44px]">
          <Ionicons 
            name={isRessourcesActive ? "book" : "book-outline"} 
            size={24} 
            color={isRessourcesActive ? '#16a34a' : '#9ca3af'} 
          />
          <Text className={`text-[10px] font-bold mt-1 ${isRessourcesActive ? 'text-green-600' : 'text-gray-400'}`}>
            Ressources
          </Text>
        </TouchableOpacity>
      </Link>

      {/* Respiration */}
      <Link href="/respiration" asChild>
        <TouchableOpacity className="flex-col items-center justify-center min-w-[44px] min-h-[44px]">
          <Ionicons 
            name={isRespirationActive ? "leaf" : "leaf-outline"} 
            size={24} 
            color={isRespirationActive ? '#16a34a' : '#9ca3af'} 
          />
          <Text className={`text-[10px] font-bold mt-1 ${isRespirationActive ? 'text-green-600' : 'text-gray-400'}`}>
            Respiration
          </Text>
        </TouchableOpacity>
      </Link>

      {/* Profil / Compte */}
      <Link href={estConnecte ? '/profil' : '/connexion'} asChild>
        <TouchableOpacity className="flex-col items-center justify-center min-w-[44px] min-h-[44px]">
          <Ionicons 
            name={isAccountActive ? "person" : "person-outline"} 
            size={24} 
            color={isAccountActive ? '#16a34a' : '#9ca3af'} 
          />
          <Text className={`text-[10px] font-bold mt-1 ${isAccountActive ? 'text-green-600' : 'text-gray-400'}`}>
            {estConnecte ? 'Profil' : 'Compte'}
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  footerFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // On augmente légèrement la hauteur pour accommoder les insets d'iPhone
    minHeight: 70,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 10,
  },
});