import BoutonRetour from '@/components/Bouton_retour';
import { FooterNav } from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Markdown from 'react-native-markdown-display';

export default function DetailRessourcePage() {
  const { id } = useLocalSearchParams(); 
  const [ressource, setRessource] = useState<any>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        if (!id) return;
        setChargement(true);
        
        const { data, error } = await supabase
          .from('ressource')
          .select('*')
          .eq('id_ress', id as string)
          .single(); 

        if (error) {
          console.error("Erreur Supabase:", error.message);
          setErreur("Ressource introuvable.");
          return;
        }

        if (data) {
          setRessource(data);

          const { data: userData } = await supabase.auth.getUser();
          const user = userData?.user;

          if (user) {
            const { error: accesError } = await supabase
              .from('acces_ressource')
              .insert({
                id_util: user.id,
                id_ress: id as string,
              });

            if (accesError) {
              console.error("Erreur insertion acces_ressource :", accesError.message);
            }
          }
        }
        
      } catch (err) {
        setErreur("Impossible de charger la ressource.");
      } finally {
        setChargement(false);
      }
    };

    if (id) chargerDonnees();
  }, [id]);

  if (chargement) {
    return (
      <View style={styles.center}>
        <Text style={styles.loaderText}>Inspiration... Expiration...</Text>
        <ActivityIndicator size="small" color="#9ca3af" />
      </View>
    );
  }

  if (erreur || !ressource) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{erreur || "Ressource introuvable"}</Text>
        <BoutonRetour />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BoutonRetour />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{ressource.categorie_ress}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{ressource.titre_ress}</Text>
        <View style={styles.zenBar} />

        <Markdown style={markdownStyles}>
          {ressource.contenu_ress}
        </Markdown>

        <View style={{ height: 112 }} /> 
      </ScrollView>

      <FooterNav estConnecte={true} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  loaderText: { color: '#6b7280', fontSize: 16, fontWeight: '500', marginBottom: 10 },
  errorText: { color: '#ef4444', marginBottom: 16, fontWeight: '500' },
  header: { paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', flexDirection: 'row', alignItems: 'center' },
  badge: { backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginLeft: 16 },
  badgeText: { color: '#16a34a', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingVertical: 32 },
  title: { fontSize: 30, fontWeight: '800', color: '#111827', lineHeight: 38, marginBottom: 16 },
  zenBar: { width: 48, height: 6, backgroundColor: '#facc15', borderRadius: 100, marginBottom: 40 },
});

const markdownStyles = StyleSheet.create({
  body: { fontSize: 18, lineHeight: 28, color: '#374151' },
  heading2: { fontSize: 24, fontWeight: '700', color: '#111827', marginTop: 32, marginBottom: 16, paddingLeft: 16, borderLeftWidth: 4, borderLeftColor: '#4ade80' },
  paragraph: { marginBottom: 24 },
  bullet_list: { marginBottom: 24 },
  list_item: { marginBottom: 12 },
  strong: { fontWeight: '700', color: '#111827' },
  blockquote: { borderLeftWidth: 4, borderLeftColor: '#e5e7eb', paddingLeft: 16, marginVertical: 24, fontStyle: 'italic', color: '#6b7280' },
});