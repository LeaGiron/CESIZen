// Juste l'affichage. La logique d'envoi de l'email est dans useMotDePasseOublie.

import { Bouton } from '@/components/Bouton';
import BoutonRetour from '@/components/Bouton_retour';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { useMotDePasseOublie } from '@/controllers/useAuth';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MotDePasseOubliePage() {
  const { email_util, setEmail, envoye, handleReinitialisation, router } = useMotDePasseOublie();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 }}
      >
        <View style={{ width: '100%', maxWidth: 360, marginBottom: 16 }}>
          <BoutonRetour />
        </View>

        <View style={{ width: '100%', maxWidth: 360, alignItems: 'center', marginTop: 16 }}>
          <Header variante="accueil" />
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 8 }}>
            <Text style={{ color: '#16a34a' }}>Mot de passe</Text>
            <Text style={{ color: '#facc15' }}> oublié</Text>
          </Text>
        </View>

        <View style={{ width: '100%', maxWidth: 360, marginTop: 24 }}>
          {!envoye ? (
            <>
              <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>
                Saisis ton adresse e-mail, un lien va être envoyé d'ici peu pour réinitialiser ton mot de passe.
              </Text>
              <Input type="email" placeholder="Adresse e-mail" value={email_util} onChangeText={setEmail} />
              <View style={{ marginTop: 24 }}>
                <Bouton label="Envoyer le lien" onPress={handleReinitialisation} />
              </View>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 14, color: '#16a34a', textAlign: 'center', marginBottom: 24 }}>
                ✅ Un e-mail a été envoyé à {email_util}.{'\n'}
                Vérifie ta boîte mail et clique sur le lien pour réinitialiser ton mot de passe.
              </Text>
              <Bouton label="Retour à la connexion" onPress={() => router.push('/connexion')} />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
