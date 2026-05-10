// Ici je n'ai plus que du JSX. La logique de connexion est dans useConnexion.

import { Bouton } from '@/components/Bouton';
import BoutonRetour from '@/components/Bouton_retour';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Separateur } from '@/components/Separateur';
import { useConnexion } from '@/controllers/useAuth';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConnexionPage() {
  // ✅ CORRECTION : ajout de messageErreur et router (qui manquaient)
  const { email_util, setEmail, mot_de_passe_util, setMotDePasse, handleConnexion, messageErreur, router } = useConnexion();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: '100%', maxWidth: 360, marginBottom: 20 }}>
          <BoutonRetour />
        </View>

        <View style={{ width: '100%', maxWidth: 360, alignItems: 'center', marginBottom: 30 }}>
          <Header variante="accueil" />
          <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 40 }}>
            <Text style={{ color: '#16a34a' }}>Bon retour sur CESI</Text>
            <Text style={{ color: '#facc15' }}>Zen</Text>
          </Text>
        </View>

        <View style={{ width: '100%', maxWidth: 360 }}>
          <Input type="email" placeholder="Adresse e-mail" value={email_util} onChangeText={setEmail} />
          <Input type="password" placeholder="Mot de passe" value={mot_de_passe_util} onChangeText={setMotDePasse} />

          <View style={{ alignItems: 'flex-end', marginTop: 12 }}>
            <Pressable onPress={() => router.push('/mot_de_passe_oublie')} hitSlop={20}>
              <Text style={{ fontSize: 13, color: '#16a34a', fontWeight: 'bold' }}>
                Mot de passe oublié ?
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={{ width: '100%', maxWidth: 360, marginTop: 30, alignItems: 'center' }}>
          <Bouton label="Se connecter" onPress={handleConnexion} />

          {/* ✅ AJOUT : affichage du message d'erreur */}
          {messageErreur && (
            <Text style={{ color: '#dc2626', fontSize: 14, marginTop: 10, textAlign: 'center' }}>
              {messageErreur}
            </Text>
          )}

          <View style={{ marginVertical: 30, width: '100%' }}>
            <Separateur />
          </View>

          <View style={{ marginBottom: 25 }}>
            <Pressable onPress={() => router.push('/dashboard')} hitSlop={10}>
              <Text style={{ fontSize: 14, textDecorationLine: 'underline', color: '#6b7280' }}>
                Continuer sans compte
              </Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>Nouveau ? </Text>
            <Pressable onPress={() => router.push('/inscription')} hitSlop={15}>
              <Text style={{ color: '#16a34a', fontWeight: 'bold', fontSize: 14 }}>
                Créer un compte
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
