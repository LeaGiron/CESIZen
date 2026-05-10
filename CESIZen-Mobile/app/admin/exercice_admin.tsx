import { AdminFooter } from "@/components/AdminFooter";
import { useAdminExercices } from "@/controllers/useAdmin_exercices";
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Alert, KeyboardAvoidingView, Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';

export default function AdminExercicesPage() {
  const {
    exercices, form, setForm, message, chargement,
    idEnCoursEdition, validerFormulaire, supprimerExercice,
    preparerModification, annulerEdition,
  } = useAdminExercices();

  const handleNumberChange = (val: string, field: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    const numValue = cleaned === '' ? 0 : parseInt(cleaned, 10);
    setForm(prev => ({ ...prev, [field]: numValue }));
  };

  const confirmerSuppression = (id: string) => {
    Alert.alert("Supprimer", "Confirmer la suppression ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => supprimerExercice(id) }
    ]);
  };

  if (chargement) return (
    <View style={styles.center}><ActivityIndicator size="large" color="#22C55E" /></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Ionicons name="fitness" size={20} color="#22C55E" />
            <Text style={styles.headerTitle}>Exercices de respiration</Text>
          </View>
          <Text style={styles.headerSubtitle}>ADMINISTRATION</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {message !== "" && (
            <View style={[styles.messageBox, message.includes('✅') ? styles.messageSuccess : styles.messageError]}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          )}

          <View style={[styles.card, idEnCoursEdition ? styles.cardEditing : null]}>
            <View style={styles.cardTitleRow}>
              <Ionicons name={idEnCoursEdition ? "create-outline" : "add-circle-outline"} size={16} color={idEnCoursEdition ? '#3b82f6' : '#22c55e'} />
              <Text style={styles.cardTitle}>{idEnCoursEdition ? "Modifier" : "Ajouter"}</Text>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={form.nom_exer}
              onChangeText={(t) => setForm({ ...form, nom_exer: t })}
            />

            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Description"
              multiline
              value={form.description_exer}
              onChangeText={(t) => setForm({ ...form, description_exer: t })}
            />

            <View style={styles.row}>
              {['inspiration', 'apnee', 'expiration'].map((type) => (
                <View key={type} style={styles.col}>
                  <Text style={styles.labelInput}>{type.substring(0, 5)}.</Text>
                  <TextInput
                    style={styles.inputCenter}
                    keyboardType="number-pad"
                    value={form[`duree_${type}_defaut_exer` as keyof typeof form].toString()}
                    onChangeText={(val) => handleNumberChange(val, `duree_${type}_defaut_exer`)}
                  />
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.btnMain, idEnCoursEdition ? {backgroundColor: '#3b82f6'} : {backgroundColor: '#22c55e'}]}
              onPress={validerFormulaire}
            >
              <Ionicons name={idEnCoursEdition ? "checkmark-circle-outline" : "add-outline"} size={16} color="#FFF" style={{marginRight: 6}} />
              <Text style={styles.btnMainText}>{idEnCoursEdition ? "Enregistrer" : "Créer"}</Text>
            </TouchableOpacity>

            {idEnCoursEdition && (
              <TouchableOpacity onPress={annulerEdition} style={styles.btnCancel}>
                <Ionicons name="close-outline" size={14} color="#AAA" style={{marginRight: 4}} />
                <Text style={styles.btnCancelText}>ANNULER</Text>
              </TouchableOpacity>
            )}
          </View>

          {exercices.map((ex) => (
            <View key={ex.id_exer} style={styles.exCard}>
              <Text style={styles.exName}>{ex.nom_exer}</Text>
              <View style={styles.row}>
                <Text style={styles.exBadge}>In: {ex.duree_inspiration_defaut_exer}s</Text>
                <Text style={styles.exBadge}>Ap: {ex.duree_apnee_defaut_exer}s</Text>
                <Text style={styles.exBadge}>Ex: {ex.duree_expiration_defaut_exer}s</Text>
              </View>
              <View style={styles.row}>
                <TouchableOpacity style={styles.btnEdit} onPress={() => preparerModification(ex)}>
                  <Ionicons name="create-outline" size={13} color="#3b82f6" style={{marginRight: 4}} />
                  <Text style={styles.btnEditText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnDel} onPress={() => confirmerSuppression(ex.id_exer)}>
                  <Ionicons name="trash-outline" size={13} color="#EF4444" style={{marginRight: 4}} />
                  <Text style={styles.btnDelText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
      <AdminFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#FFF', padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 10, color: '#AAA' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 15, marginBottom: 20, elevation: 3 },
  cardEditing: { borderColor: '#3b82f6', borderWidth: 1 },
  cardTitle: { fontWeight: 'bold' },
  input: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 10, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  col: { flex: 1 },
  labelInput: { fontSize: 10, color: '#666', textAlign: 'center' },
  inputCenter: { backgroundColor: '#F3F4F6', textAlign: 'center', padding: 10, borderRadius: 10, fontWeight: 'bold' },
  btnMain: { padding: 15, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  btnMainText: { color: '#FFF', fontWeight: 'bold' },
  btnCancel: { marginTop: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  btnCancelText: { color: '#AAA', fontSize: 12 },
  messageBox: { padding: 12, borderRadius: 10, marginBottom: 15 },
  messageSuccess: { backgroundColor: '#DCFCE7' },
  messageError: { backgroundColor: '#FEE2E2' },
  messageText: { textAlign: 'center', fontWeight: 'bold', fontSize: 12 },
  exCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#22c55e' },
  exName: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  exBadge: { backgroundColor: '#F3F4F6', padding: 5, borderRadius: 5, fontSize: 11, flex: 1, textAlign: 'center' },
  btnEdit: { flex: 1, padding: 8, borderWidth: 1, borderColor: '#3b82f6', borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  btnEditText: { color: '#3b82f6', fontSize: 12, fontWeight: 'bold' },
  btnDel: { flex: 1, padding: 8, borderWidth: 1, borderColor: '#EF4444', borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  btnDelText: { color: '#EF4444', fontSize: 12, fontWeight: 'bold' },
});
