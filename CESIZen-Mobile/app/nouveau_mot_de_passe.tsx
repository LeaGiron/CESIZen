import { Bouton } from '@/components/Bouton';
import { Header } from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import * as Linking from 'expo-linking';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NouveauMotDePassePage() {
  const [nouveauMdp, setNouveauMdp] = useState('');
  const [confirmationMdp, setConfirmationMdp] = useState('');
  const [chargement, setChargement] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const traiterUrlReset = async (url: string | null) => {
      console.log('URL reset reçue :', url);

      if (!url) return;

      const paramsString = url.includes('#')
        ? url.split('#')[1]
        : url.split('?')[1];

      if (!paramsString) {
        console.log("Aucun token trouvé dans l'URL");
        return;
      }

      const params = new URLSearchParams(paramsString);

      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      console.log('Access token présent :', !!accessToken);
      console.log('Refresh token présent :', !!refreshToken);

      if (!accessToken || !refreshToken) {
        Alert.alert('Erreur', 'Lien de réinitialisation invalide ou incomplet.');
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        Alert.alert('Erreur session', error.message);
        return;
      }

      console.log('Session reset créée avec succès');
    };

    Linking.getInitialURL().then(traiterUrlReset);

    const subscription = Linking.addEventListener('url', (event) => {
      traiterUrlReset(event.url);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AUTH EVENT :', event);
        console.log('SESSION RECOVERY :', session);

        if (event === 'PASSWORD_RECOVERY' && session) {
          console.log('Session de récupération prête');
        }
      }
    );

    return () => {
      subscription.remove();
      listener.subscription.unsubscribe();
    };
  }, []);

  const verifierMotDePasse = () => {
    const erreurs = [];

    if (nouveauMdp.length < 12) erreurs.push('12 caractères minimum');
    if (!/[A-Z]/.test(nouveauMdp)) erreurs.push('une majuscule');
    if (!/[a-z]/.test(nouveauMdp)) erreurs.push('une minuscule');
    if (!/[0-9]/.test(nouveauMdp)) erreurs.push('un chiffre');
    if (!/[@$!%*?&]/.test(nouveauMdp)) erreurs.push('un caractère spécial');

    if (erreurs.length > 0) {
      Alert.alert('Mot de passe incomplet', `Il manque : ${erreurs.join(', ')}`);
      return false;
    }

    if (nouveauMdp !== confirmationMdp) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return false;
    }

    return true;
  };

  const handleUpdatePassword = async () => {
    if (!verifierMotDePasse()) return;

    setChargement(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();

      console.log('Session avant update password :', sessionData.session);

      if (!sessionData.session) {
        Alert.alert(
          'Erreur',
          "Session de réinitialisation introuvable. Redemande un nouveau lien."
        );
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: nouveauMdp,
      });

      if (error) throw error;

      Alert.alert(
        'Succès ✅',
        'Ton mot de passe a été modifié avec succès. Tu peux maintenant te connecter.',
        [{ text: 'Super !', onPress: () => router.replace('/connexion') }]
      );
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error.message || 'Impossible de modifier le mot de passe.'
      );
    } finally {
      setChargement(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          paddingVertical: 40,
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 360,
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <Header variante="accueil" />

          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 12,
            }}
          >
            Nouveau <Text style={{ color: '#16a34a' }}>mot de passe</Text>
          </Text>

          <Text
            style={{
              color: '#6b7280',
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            Choisis un mot de passe robuste pour protéger ton compte.
          </Text>
        </View>

        <View
          style={{
            width: '100%',
            maxWidth: 360,
            marginTop: 32,
            gap: 16,
          }}
        >
          <TextInput
            placeholder="Nouveau mot de passe"
            secureTextEntry
            value={nouveauMdp}
            onChangeText={setNouveauMdp}
            style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 8,
              padding: 12,
            }}
          />

          <TextInput
            placeholder="Confirmer le mot de passe"
            secureTextEntry
            value={confirmationMdp}
            onChangeText={setConfirmationMdp}
            style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 8,
              padding: 12,
            }}
          />

          <View style={{ marginTop: 16 }}>
            <Bouton
              label={
                chargement
                  ? 'Mise à jour...'
                  : 'Enregistrer les modifications'
              }
              onPress={chargement ? () => {} : handleUpdatePassword}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}