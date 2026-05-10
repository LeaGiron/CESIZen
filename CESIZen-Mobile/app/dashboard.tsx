import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { FooterNav } from '../components/Footer';
import { useDashboard } from '../controllers/useDashboard';

export default function DashboardPage() {
  const { prenom_util, ressources, estConnecte, estAdmin } = useDashboard();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>
          <Text style={styles.textGreen}>CESI</Text>
          <Text style={styles.textYellow}>Zen</Text>
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.welcomeSection}>
          <Ionicons name="sunny" size={50} color="#facc15" style={{ marginBottom: 10 }} />
          <Text style={styles.welcomeTitle}>Bonjour {prenom_util} !</Text>
          <Text style={styles.welcomeSubtitle}>Comment allez-vous aujourd'hui ?</Text>

          {!estConnecte && (
            <View style={styles.visitorBox}>
              <Text style={styles.visitorTag}>Mode visiteur</Text>
              <Text style={styles.visitorText}>
                Connectez-vous pour débloquer toutes les fonctionnalités.
              </Text>
              <TouchableOpacity onPress={() => router.push('/connexion')}>
                <Text style={styles.visitorLink}>Se connecter →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="library" size={22} color="#374151" />
            <Text style={styles.sectionTitle}>Dernières ressources</Text>
          </View>

          {ressources.length === 0 ? (
            <Text style={styles.loadingText}>Chargement des ressources...</Text>
          ) : (
            ressources.map((res) => (
              <TouchableOpacity 
                key={res.id_ress} 
                style={styles.card}
                onPress={() => router.push(`/ressources/${res.id_ress}`)}
              >
                <View style={styles.cardImagePlaceholder}>
                  <Ionicons name="document-text" size={32} color="#16a34a" />
                </View>
                <View style={styles.cardContent}>
                  <View>
                    <Text style={styles.cardTitle} numberOfLines={2}>{res.titre_ress}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>
                        {res.categorie_ress ? res.categorie_ress.toUpperCase() : 'RESSOURCE'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cardButton}>
                    <Text style={styles.cardButtonText}>Lire l'article</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.relaxBox}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons name="leaf" size={24} color="#16a34a" />
            <Text style={styles.relaxTitle}>Le coin détente</Text>
          </View>
          <Text style={styles.relaxText}>
            Prenez une pause de 5 minutes pour une séance de respiration guidée.
          </Text>
          <TouchableOpacity 
            style={styles.relaxButton}
            onPress={() => router.push('/respiration')}
          >
            <Text style={styles.relaxButtonText}>Commencer</Text>
          </TouchableOpacity>
        </View>
        {estConnecte && (
          <View style={styles.accountBox}>
            <Text style={styles.accountTitle}>Mon compte</Text>
            <Text style={styles.accountSubtitle}>Mettez à jour vos informations.</Text>
            <TouchableOpacity 
              style={styles.accountButton}
              onPress={() => router.push('/profil')}
            >
              <Text style={styles.accountButtonText}>Accéder au profil</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <FooterNav estConnecte={estConnecte} estAdmin={estAdmin} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    backgroundColor: '#fff',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerLogo: { fontSize: 20, fontWeight: 'bold' },
  textGreen: { color: '#16a34a' },
  textYellow: { color: '#facc15' },
  scrollContent: { padding: 20 },
  welcomeSection: { alignItems: 'center', paddingVertical: 24 },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#16a34a' },
  welcomeSubtitle: { fontSize: 16, color: '#6b7280', marginTop: 4 },
  visitorBox: { backgroundColor: '#fefce8', padding: 16, borderRadius: 20, marginTop: 24, width: '100%', borderWidth: 1, borderColor: '#fef08a' },
  visitorTag: { color: '#854d0e', fontWeight: 'bold', fontSize: 14 },
  visitorText: { color: '#ca8a04', fontSize: 12, marginTop: 4 },
  visitorLink: { color: '#854d0e', fontWeight: 'bold', fontSize: 14, textDecorationLine: 'underline', marginTop: 8 },
  section: { marginTop: 32 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151' },
  loadingText: { fontStyle: 'italic', color: '#9ca3af', fontSize: 14 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 16, flexDirection: 'row', gap: 16, marginBottom: 16, elevation: 2 },
  cardImagePlaceholder: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1, justifyContent: 'space-between' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1f2937' },
  categoryBadge: { backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, alignSelf: 'flex-start', marginTop: 4 },
  categoryText: { color: '#16a34a', fontSize: 10, fontWeight: 'bold' },
  cardButton: { backgroundColor: '#22c55e', paddingVertical: 8, borderRadius: 8, marginTop: 12 },
  cardButtonText: { color: '#fff', textAlign: 'center', fontSize: 12, fontWeight: 'bold' },
  relaxBox: { backgroundColor: '#f0fdf4', borderRadius: 30, padding: 24, marginTop: 32, borderWidth: 1, borderColor: '#dcfce7' },
  relaxTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  relaxText: { color: '#4b5563', fontSize: 14, lineHeight: 20 },
  relaxButton: { backgroundColor: '#16a34a', paddingVertical: 14, borderRadius: 12, marginTop: 20 },
  relaxButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  // Nouveaux styles pour la section Profil
  accountBox: { backgroundColor: '#fff', borderRadius: 20, padding: 24, marginTop: 32, borderWidth: 1, borderColor: '#f3f4f6' },
  accountTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  accountSubtitle: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  accountButton: { backgroundColor: '#f9fafb', paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  accountButtonText: { color: '#374151', textAlign: 'center', fontWeight: 'bold' },
});