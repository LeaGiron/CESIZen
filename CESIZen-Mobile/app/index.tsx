import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Composants réutilisables
import { Bouton } from '../components/Bouton';
import { Header } from '../components/Header';
import { Separateur } from '../components/Separateur';

// Import du Contrôleur (le Hook)
import { useAccueilController } from '../controllers/useAccueil';

export default function MobilePageAccueil() {
  // On récupère tout ce dont la vue a besoin depuis le contrôleur
  const { description, labels } = useAccueilController();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ paddingHorizontal: 32, paddingVertical: 48 }}
      >
        {/* Partie Logo + Texte */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Header variante="accueil" />
          
          <View style={{ marginTop: 24 }}>
            <Text style={{ textAlign: 'center', color: '#6b7280', fontSize: 15, lineHeight: 28, paddingHorizontal: 16 }}>
              {description}
            </Text>
          </View>
        </View>

        {/* Partie Actions (Boutons) */}
        <View style={{ width: '100%', alignItems: 'center', gap: 16, marginBottom: 50 }}>

          <Link href="/connexion" asChild>
            <Bouton label={labels.connexion} />
          </Link>

          <Link href="/inscription" asChild>
            <Bouton label={labels.inscription} />
          </Link>

          <Separateur />

          <Link href="/dashboard" asChild>
            <TouchableOpacity style={{ paddingVertical: 8, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <Text style={{ color: '#9ca3af', fontSize: 14, textDecorationLine: 'underline', fontWeight: '500' }}>
                {labels.invite}
              </Text>
            </TouchableOpacity>
          </Link>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}