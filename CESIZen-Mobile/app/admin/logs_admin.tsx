import { AdminFooter } from '@/components/AdminFooter';
import { FILTRES_ACTION, FILTRES_STATUT, useAdminLogs } from '@/controllers/useAdmin_logs';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';

const BADGE_STATUT: Record<string, any> = {
  'succès': { bg: '#F0FDF4', text: '#15803D', border: '#DCFCE7' },
  'échec':  { bg: '#FEF2F2', text: '#DC2626', border: '#FEE2E2' },
  'bloque': { bg: '#FFF7ED', text: '#EA580C', border: '#FFEDD5' },
};

const ICONE_ACTION: Record<string, { name: string; color: string }> = {
  'connexion':               { name: 'key-outline',           color: '#2563EB' },
  'déconnexion':             { name: 'log-out-outline',       color: '#6B7280' },
  'consultation_ressource':  { name: 'book-outline',          color: '#7C3AED' },
  'creation_ressource':      { name: 'add-circle-outline',    color: '#16A34A' },
  'modification_ressource':  { name: 'create-outline',        color: '#D97706' },
  'configuration_exercice':  { name: 'fitness-outline',       color: '#0891B2' },
  'erreur_authentification': { name: 'warning-outline',       color: '#DC2626' },
  'creation_compte':         { name: 'person-add-outline',    color: '#16A34A' },
  'suppression_compte':      { name: 'person-remove-outline', color: '#DC2626' },
  'modification_profil':     { name: 'pencil-outline',        color: '#D97706' },
  'demande_reset_mdp':       { name: 'lock-closed-outline',   color: '#6B7280' },
};

export default function AdminLogsPage() {
  const {
    logs, chargement, filtreStatut, setFiltreStatut,
    filtreAction, setFiltreAction, recherche, setRecherche, total
  } = useAdminLogs();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Journaux d'activité</Text>
          <View style={styles.adminBadge}><Text style={styles.adminBadgeText}>Admin</Text></View>
        </View>
        <View style={styles.headerSubRow}>
          <Ionicons name="server-outline" size={12} color="#9CA3AF" style={{marginRight: 4}} />
          <Text style={styles.headerSubtitle}>{total} entrée{total > 1 ? 's' : ''} chargée{total > 1 ? 's' : ''}</Text>
        </View>
      </View>

      <ScrollView style={styles.main} contentContainerStyle={styles.scrollContent}>
        <TextInput
          style={styles.searchBar}
          placeholder="🔍 Rechercher (email, action...)"
          placeholderTextColor="#9CA3AF"
          value={recherche}
          onChangeText={setRecherche}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {FILTRES_STATUT.map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setFiltreStatut(s)}
              style={[
                styles.filterTab,
                filtreStatut === s && styles.filterTabActive
              ]}
            >
              <Text style={[styles.filterTabText, filtreStatut === s && styles.filterTabTextActive]}>
                {s === 'Tous' ? 'Tous les statuts' : s}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity 
          style={styles.selectBtn} 
          onPress={() => {
            Alert.alert("Filtrer par action", "Choisissez une action :", 
              FILTRES_ACTION.map(a => ({
                text: a === 'Tous' ? "Toutes les actions" : a.replace(/_/g, ' '),
                onPress: () => setFiltreAction(a)
              }))
            );
          }}
        >
          <Text style={styles.selectBtnText}>
            {filtreAction === 'Tous' ? '📂 Toutes les actions' : `🎯 ${filtreAction.replace(/_/g, ' ')}`}
          </Text>
          <Text style={{ color: '#9CA3AF' }}>▼</Text>
        </TouchableOpacity>

        {/* LISTE */}
        {chargement ? (
          <ActivityIndicator color="#22C55E" style={{ marginTop: 40 }} />
        ) : logs.length === 0 ? (
          <Text style={styles.emptyText}>Aucun log trouvé.</Text>
        ) : (
          logs.map((log) => (
            <View key={log.id_log} style={styles.logCard}>
              {/* Ligne 1 */}
              <View style={styles.cardHeader}>
                <View style={styles.actionInfo}>
                  <Ionicons 
                    name={(ICONE_ACTION[log.type_action_log]?.name ?? 'clipboard-outline') as any}
                    size={18}
                    color={ICONE_ACTION[log.type_action_log]?.color ?? '#6B7280'}
                  />
                  <Text style={styles.actionName}>{log.type_action_log.replace(/_/g, ' ')}</Text>
                </View>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: BADGE_STATUT[log.statut_log].bg, borderColor: BADGE_STATUT[log.statut_log].border }
                ]}>
                  <Text style={[styles.statusBadgeText, { color: BADGE_STATUT[log.statut_log].text }]}>
                    {log.statut_log}
                  </Text>
                </View>
              </View>

              <View style={styles.userInfo}>
                <Ionicons name="person-circle-outline" size={14} color="#9CA3AF" />
                {log.utilisateur ? (
                  <Text style={styles.userText}>
                    {log.utilisateur.prenom_util} {log.utilisateur.nom_util}{' '}
                    <Text style={styles.userEmail}>({log.utilisateur.email_util})</Text>
                  </Text>
                ) : (
                  <Text style={styles.userTextAnonyme}>Anonyme / compte supprimé</Text>
                )}
              </View>

              <View style={styles.dateRow}>
                <Ionicons name="time-outline" size={12} color="#9CA3AF" style={{marginRight: 4}} />
                <Text style={styles.dateText}>{formatDate(log.date_action_log)}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <AdminFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { 
    backgroundColor: '#FFF', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 60 : 20, 
    paddingBottom: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerSubRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  adminBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  adminBadgeText: { color: '#166534', fontSize: 10, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  main: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  searchBar: { 
    backgroundColor: '#FFF', 
    height: 48, 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    fontSize: 14, 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    marginBottom: 16,
    color: '#1F2937'
  },
  filterRow: { flexDirection: 'row', marginBottom: 16 },
  filterTab: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    marginRight: 8 
  },
  filterTabActive: { backgroundColor: '#22C55E', borderColor: '#22C55E' },
  filterTabText: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  filterTabTextActive: { color: '#FFF' },
  selectBtn: { 
    backgroundColor: '#FFF', 
    height: 48, 
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    marginBottom: 16
  },
  selectBtnText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  logCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#F3F4F6',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }, android: { elevation: 2 } })
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  actionInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionName: { fontSize: 14, fontWeight: 'bold', color: '#1F2937', textTransform: 'capitalize' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, borderWidth: 1 },
  statusBadgeText: { fontSize: 10, fontWeight: 'bold' },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  userText: { fontSize: 12, color: '#4B5563' },
  userEmail: { color: '#9CA3AF' },
  userTextAnonyme: { fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 11, color: '#9CA3AF' },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 40, fontStyle: 'italic' }
});