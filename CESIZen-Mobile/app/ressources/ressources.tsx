import { FooterNav } from '@/components/Footer';
import { useRessources } from '@/controllers/useRessources';
import { Ionicons } from '@expo/vector-icons'; // Bibliothèque d'icônes
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RessourcesPage() {
  const router = useRouter();

  const {
    ressourcesFiltrees,
    estConnecte,
    recherche,
    setRecherche,
    categorieActive,
    setCategorieActive,
    chargement,
    categories, 
  } = useRessources();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      {/* --- HEADER ET FILTRES --- */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="library" size={24} color="#16a34a" />
          <Text style={styles.headerTitle}>Ressources</Text>
        </View>

        {/* Barre de recherche */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            placeholder="Rechercher une ressource..."
            value={recherche}
            onChangeText={setRecherche}
            style={styles.searchInput}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Filtres par catégorie */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {categories && Array.isArray(categories) && categories.length > 0 ? (
            categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategorieActive(cat)}
                style={[
                  styles.filterBadge,
                  { backgroundColor: categorieActive === cat ? '#16a34a' : '#f3f4f6' }
                ]}
              >
                <Text style={[
                  styles.filterText,
                  { color: categorieActive === cat ? 'white' : '#6b7280' }
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.loadingText}>Chargement des filtres...</Text>
          )}
        </ScrollView>
      </View>

      {/* --- LISTE DES RÉSULTATS --- */}
      <ScrollView
        style={styles.listBackground}
        contentContainerStyle={styles.listContent}
      >
        {chargement ? (
          <View style={styles.centerLoader}>
            <ActivityIndicator size="large" color="#16a34a" />
            <Text style={styles.loadingText}>Chargement du contenu...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultCount}>
              {ressourcesFiltrees ? ressourcesFiltrees.length : 0} RESSOURCE{(ressourcesFiltrees?.length || 0) > 1 ? 'S' : ''} TROUVÉE{(ressourcesFiltrees?.length || 0) > 1 ? 'S' : ''}
            </Text>

            {ressourcesFiltrees && ressourcesFiltrees.map((res) => (
              <View key={res.id_ress} style={styles.card}>
                <View style={styles.cardIconWrapper}>
                  <Ionicons name="document-text" size={36} color="#16a34a" />
                </View>

                {/* Détails de la ressource */}
                <View style={styles.cardDetails}>
                  <View>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {res.titre_ress}
                    </Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>
                        {res.categorie_ress.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.readButton}
                    onPress={() => router.push(`/ressources/${res.id_ress}` as any)}
                  >
                    <Text style={styles.readButtonText}>Lire l'article</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {!chargement && ressourcesFiltrees && ressourcesFiltrees.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aucun résultat trouvé</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <FooterNav estConnecte={estConnecte} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#16a34a' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 12, height: 48 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: '#1f2937' },
  filterScroll: { marginTop: 15 },
  filterBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  filterText: { fontWeight: '600', fontSize: 13 },
  listBackground: { flex: 1, backgroundColor: '#f9fafb' },
  listContent: { padding: 20, paddingBottom: 120 },
  centerLoader: { marginTop: 50, alignItems: 'center' },
  loadingText: { textAlign: 'center', color: '#9ca3af', marginTop: 10, fontSize: 12 },
  resultCount: { fontSize: 10, color: '#9ca3af', fontWeight: 'bold', letterSpacing: 1, marginBottom: 15, textTransform: 'uppercase' },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  cardIconWrapper: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  cardDetails: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1f2937', leadingHeight: 18 },
  categoryBadge: { backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginTop: 4 },
  categoryText: { fontSize: 10, color: '#16a34a', fontWeight: 'bold' },
  readButton: { backgroundColor: '#16a34a', borderRadius: 10, paddingVertical: 8, alignItems: 'center', marginTop: 10 },
  readButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  emptyContainer: { marginTop: 40, alignItems: 'center' },
  emptyText: { color: '#9ca3af', fontSize: 14 }
});