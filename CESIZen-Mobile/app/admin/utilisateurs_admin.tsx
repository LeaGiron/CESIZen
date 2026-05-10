import { AdminFooter } from "@/components/AdminFooter";
import { useAdminUtilisateurs } from "@/controllers/useAdmin_utilisateurs";
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const BADGE_STATUT: any = {
  "actif": { bg: "#F0FDF4", text: "#15803D" },
  "inactif": { bg: "#F3F4F6", text: "#6B7280" },
  "verrouillé": { bg: "#FEF2F2", text: "#DC2626" },
};

const BADGE_ROLE: any = {
  "Administrateur": { bg: "#F5F3FF", text: "#7E22CE" },
  "Utilisateur": { bg: "#EFF6FF", text: "#2563EB" },
};

export default function AdminUtilisateursPage() {
  const {
    utilisateurs, form, setForm, message, chargement,
    idEnCoursEdition, validerFormulaire, supprimerUtilisateur,
    deverrouiller, preparerModification, annulerEdition, scrollToTopRef
  } = useAdminUtilisateurs();

  const scrollRef = React.useRef<ScrollView>(null);
  scrollToTopRef.current = () => scrollRef.current?.scrollTo({ y: 0, animated: true });

  if (chargement) {
    return <View style={styles.center}><ActivityIndicator color="#9CA3AF" /><Text style={styles.loadingText}>Chargement...</Text></View>;
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Ionicons name="people" size={20} color="#22C55E" />
          <Text style={styles.headerTitle}>Membres</Text>
        </View>
        <Text style={styles.headerSubtitle}>ADMINISTRATION</Text>
      </View>

      <ScrollView ref={scrollRef} style={styles.main} contentContainerStyle={{ paddingBottom: 100 }}>
        {message && (
          <View style={[styles.banner, message.includes('✅') ? styles.bannerSuccess : styles.bannerError]}>
            <Text style={[styles.bannerText, message.includes('✅') ? styles.bannerTextSuccess : styles.bannerTextError]}>{message}</Text>
          </View>
        )}

        <View style={[styles.card, idEnCoursEdition ? styles.cardEditing : null]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name={idEnCoursEdition ? "create-outline" : "person-add-outline"} size={15} color={idEnCoursEdition ? '#3B82F6' : '#22C55E'} />
            <Text style={styles.sectionTitle}>{idEnCoursEdition ? "Modifier le profil" : "Ajouter un membre"}</Text>
          </View>
          
          <View style={styles.row}>
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Prénom" value={form.prenom_util} onChangeText={t => setForm({...form, prenom_util: t})} />
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Nom" value={form.nom_util} onChangeText={t => setForm({...form, nom_util: t})} />
          </View>

          <TextInput style={[styles.input, !!idEnCoursEdition && { opacity: 0.5 }]} placeholder="Email" value={form.email_util} editable={!idEnCoursEdition} onChangeText={t => setForm({...form, email_util: t})} keyboardType="email-address" autoCapitalize="none" />
          
          {!idEnCoursEdition && (
            <TextInput style={styles.input} placeholder="Mot de passe" value={form.mdp_util} onChangeText={t => setForm({...form, mdp_util: t})} secureTextEntry />
          )}

          <View style={styles.row}>
             <TouchableOpacity style={styles.fakeSelect} onPress={() => Alert.alert("Type", "Choisir", [
               { text: "Utilisateur", onPress: () => setForm({...form, type_util: "Utilisateur"}) },
               { text: "Administrateur", onPress: () => setForm({...form, type_util: "Administrateur"}) }
             ])}>
               <Text style={styles.textSmall}>{form.type_util}</Text>
             </TouchableOpacity>

             <TouchableOpacity style={styles.fakeSelect} onPress={() => Alert.alert("Statut", "Choisir", [
               { text: "Actif", onPress: () => setForm({...form, statut_compte_util: "actif"}) },
               { text: "Inactif", onPress: () => setForm({...form, statut_compte_util: "inactif"}) },
               { text: "Verrouillé", onPress: () => setForm({...form, statut_compte_util: "verrouillé"}) }
             ])}>
               <Text style={styles.textSmall}>{form.statut_compte_util}</Text>
             </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.btnMain, { backgroundColor: idEnCoursEdition ? '#3B82F6' : '#22C55E' }]} onPress={validerFormulaire}>
            <Ionicons name={idEnCoursEdition ? "checkmark-circle-outline" : "person-add-outline"} size={16} color="#FFF" style={{marginRight: 6}} />
            <Text style={styles.btnMainText}>{idEnCoursEdition ? "Enregistrer" : "Créer le compte"}</Text>
          </TouchableOpacity>

          {idEnCoursEdition && (
            <TouchableOpacity onPress={annulerEdition} style={styles.btnCancel}>
              <Ionicons name="close-outline" size={14} color="#9CA3AF" style={{marginRight: 2}} />
              <Text style={styles.btnCancelText}>Annuler</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.listLabel}>LISTE ({utilisateurs.length})</Text>
        {utilisateurs.map(u => (
          <View key={u.id_util} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View>
                <Text style={styles.userName}>{u.prenom_util} {u.nom_util}</Text>
                <Text style={styles.userEmail}>{u.email_util}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={[styles.badge, { backgroundColor: BADGE_ROLE[u.type_util].bg }]}><Text style={[styles.badgeText, { color: BADGE_ROLE[u.type_util].text }]}>{u.type_util}</Text></View>
                <View style={[styles.badge, { backgroundColor: BADGE_STATUT[u.statut_compte_util].bg, marginTop: 4 }]}><Text style={[styles.badgeText, { color: BADGE_STATUT[u.statut_compte_util].text }]}>{u.statut_compte_util}</Text></View>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => preparerModification(u)}>
                <Ionicons name="create-outline" size={13} color="#2563EB" style={{marginRight: 3}} />
                <Text style={styles.actionBtnTextBlue}>Modifier</Text>
              </TouchableOpacity>
              {u.statut_compte_util === "verrouillé" && (
                <TouchableOpacity style={styles.actionBtn} onPress={() => deverrouiller(u.id_util)}>
                  <Ionicons name="lock-open-outline" size={13} color="#D97706" style={{marginRight: 3}} />
                  <Text style={styles.actionBtnTextAmber}>Débloquer</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.actionBtn} onPress={() => supprimerUtilisateur(u.id_util)}>
                <Ionicons name="trash-outline" size={13} color="#DC2626" style={{marginRight: 3}} />
                <Text style={styles.actionBtnTextRed}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <AdminFooter />
    </View>
  );
}

const styles = StyleSheet.create({

  textSmall: { fontSize: 14, color: '#374151' },
  root: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontStyle: 'italic', color: '#9CA3AF' },
  header: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 10, color: '#9CA3AF', fontWeight: 'bold', letterSpacing: 1 },
  main: { flex: 1, padding: 15 },
  banner: { padding: 15, borderRadius: 12, marginBottom: 20 },
  bannerSuccess: { backgroundColor: '#F0FDF4' },
  bannerError: { backgroundColor: '#FEF2F2' },
  bannerText: { textAlign: 'center', fontSize: 12, fontWeight: 'bold' },
  bannerTextSuccess: { color: '#15803D' },
  bannerTextError: { color: '#B91C1C' },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, marginBottom: 25, borderWidth: 2, borderColor: 'transparent' },
  cardEditing: { borderColor: '#60A5FA', borderWidth: 2 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#374151' },
  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  input: { height: 48, backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 15, fontSize: 14, borderWidth: 1, borderColor: '#F3F4F6', marginBottom: 10 },
  fakeSelect: { flex: 1, height: 48, backgroundColor: '#F9FAFB', borderRadius: 12, justifyContent: 'center', paddingHorizontal: 15, borderWidth: 1, borderColor: '#F3F4F6' },
  btnMain: { height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 5, flexDirection: 'row' },
  btnMainText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  btnCancel: { marginTop: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  btnCancelText: { color: '#9CA3AF', fontWeight: 'bold', fontSize: 11 },
  listLabel: { fontSize: 10, fontWeight: '900', color: '#9CA3AF', letterSpacing: 1.5, marginBottom: 10, paddingLeft: 5 },
  userCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: '#F3F4F6' },
  userHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  userName: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
  userEmail: { fontSize: 10, color: '#9CA3AF', fontStyle: 'italic' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  badgeText: { fontSize: 9, fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, height: 36, borderColor: '#F3F4F6', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, flexDirection: 'row' },
  actionBtnTextBlue: { color: '#2563EB', fontSize: 10, fontWeight: 'bold' },
  actionBtnTextAmber: { color: '#D97706', fontSize: 10, fontWeight: 'bold' },
  actionBtnTextRed: { color: '#DC2626', fontSize: 10, fontWeight: 'bold' },
});