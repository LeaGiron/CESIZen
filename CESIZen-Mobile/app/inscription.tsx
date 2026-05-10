import { Bouton } from '@/components/Bouton';
import BoutonRetour from '@/components/Bouton_retour';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { useInscription } from '@/controllers/useAuth';
import * as Linking from 'expo-linking';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

export default function InscriptionPage() {
  const {
    nom_util, setNom,
    prenom_util, setPrenom,
    email_util, setEmail,
    mot_de_passe_util, setMotDePasse,
    handleInscription,
    messageErreur,
  } = useInscription();

  const pdfUrl = 'https://ton-domaine.com/documents/CESIZen_CGU_Politique_Confidentialite.pdf';
  // ↑ Remplace par l'URL publique de ton PDF (Supabase Storage, serveur, etc.)
  // Les assets locaux ne sont pas accessibles via Linking.openURL en RN

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 bg-white items-center justify-center p-4">
          <View className="w-full max-w-md">

            {/* Bouton retour */}
            <View className="mb-2">
              <BoutonRetour />
            </View>

            {/* Header + titre */}
            <View className="flex-col items-center mb-6">
              <Header variante="accueil" />
              <Text className="text-xl font-bold text-center mt-4">
                <Text className="text-green-600">Bienvenue sur CESI</Text>
                <Text className="text-yellow-400">Zen</Text>
              </Text>
              <Text className="text-sm text-gray-500 text-center mt-1">
                Créez un compte pour commencer à vous détendre
              </Text>
            </View>

            {/* Champs du formulaire */}
            <View className="gap-y-3">
              <Input
                placeholder="Nom"
                value={nom_util}
                onChangeText={setNom}
              />
              <Input
                placeholder="Prénom"
                value={prenom_util}
                onChangeText={setPrenom}
              />
              <Input
                type="email"
                placeholder="Adresse e-mail"
                value={email_util}
                onChangeText={setEmail}
              />
              <Input
                type="password"
                placeholder="Mot de passe"
                value={mot_de_passe_util}
                onChangeText={setMotDePasse}
              />
            </View>

            {/* Message d'erreur */}
            {messageErreur && (
              <View className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                <Text className="text-red-500 text-[11px] text-center font-medium leading-relaxed">
                  {messageErreur}
                </Text>
              </View>
            )}

            {/* CGU + Bouton */}
            <View className="flex-col items-center mt-6 gap-y-4">
              <Text className="text-[10px] text-gray-400 text-center leading-tight px-6">
                En continuant, vous acceptez les{' '}
                <Text
                  className="underline text-green-600 font-medium"
                  onPress={() => Linking.openURL(pdfUrl)}
                >
                  Conditions générales et la Politique de confidentialité
                </Text>
              </Text>

              <View className="w-full">
                <Bouton label="S'inscrire" onPress={handleInscription} />
              </View>
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
