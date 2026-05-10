import { AdminFooter } from "@/components/AdminFooter";
import { useAdminRessources } from "@/controllers/useAdmin_ressources";
import { Ressource } from "@/models/admin_ressources.model";
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORIES = ["Stress", "Sommeil", "Autre"];
const STATUTS = ["brouillon", "publie", "archive"] as const;

const BADGE_STYLE: Record<string, { bg: string; text: string }> = {
  publie:   { bg: "#f0fdf4", text: "#15803d" },
  brouillon:{ bg: "#fffbeb", text: "#b45309" },
  archive:  { bg: "#f3f4f6", text: "#6b7280" },
};

function SegmentedSelector<T extends string>({
  values,
  selected,
  onSelect,
}: {
  values: readonly T[];
  selected: T;
  onSelect: (v: T) => void;
}) {
  return (
    <View style={styles.segmented}>
      {values.map((v) => (
        <TouchableOpacity
          key={v}
          onPress={() => onSelect(v)}
          style={[
            styles.segmentItem,
            selected === v && styles.segmentItemActive,
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.segmentText,
              selected === v && styles.segmentTextActive,
            ]}
            numberOfLines={1}
          >
            {v}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function RessourceCard({
  item,
  onModifier,
  onSupprimer,
}: {
  item: Ressource;
  onModifier: () => void;
  onSupprimer: () => void;
}) {
  const badge = BADGE_STYLE[item.statut_ress] ?? BADGE_STYLE.archive;

  return (
    <View style={styles.card}>
      {/* En-tête carte */}
      <View style={styles.cardHeader}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.titre_ress}
          </Text>
          <Text style={styles.cardCategorie}>{item.categorie_ress}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.text }]}>
            {item.statut_ress.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnEdit]}
          onPress={onModifier}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={13} color="#16a34a" style={{marginRight: 4}} />
          <Text style={styles.actionBtnEditText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnDelete]}
          onPress={onSupprimer}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={13} color="#ef4444" style={{marginRight: 4}} />
          <Text style={styles.actionBtnDeleteText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


export default function AdminPage() {
  const scrollRef = useRef<ScrollView>(null);

  const {
    ressources, form, setForm, message, chargement,
    idEnCoursEdition, validerFormulaire, supprimerRessource,
    preparerModification, annulerEdition, scrollToTopRef,
  } = useAdminRessources();


  scrollToTopRef.current = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  if (chargement) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#9ca3af" />
        <Text style={styles.loadingText}>Vérification des droits...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Administration</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>Admin</Text>
          </View>
        </View>
        <View style={styles.headerSubRow}>
          <Ionicons name="document-text-outline" size={13} color="#9ca3af" style={{marginRight: 4}} />
          <Text style={styles.headerSubtitle}>Gestion des ressources</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {!!message && (
          <View
            style={[
              styles.messageBanner,
              message.startsWith("✅") ? styles.messageBannerSuccess : styles.messageBannerError,
            ]}
          >
            <Text
              style={[
                styles.messageBannerText,
                message.startsWith("✅") ? styles.messageBannerTextSuccess : styles.messageBannerTextError,
              ]}
            >
              {message}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.formSection,
            idEnCoursEdition ? styles.formSectionEditing : styles.formSectionDefault,
          ]}
        >
          <View style={styles.sectionTitleRow}>
            <Ionicons name={idEnCoursEdition ? "create-outline" : "add-circle-outline"} size={15} color={idEnCoursEdition ? '#3b82f6' : '#22c55e'} />
            <Text style={styles.sectionTitle}>
              {idEnCoursEdition ? "Modifier la ressource" : "Nouvelle ressource"}
            </Text>
          </View>

          <TextInput
            placeholder="Titre de la ressource"
            placeholderTextColor="#9ca3af"
            value={form.titre_ress}
            onChangeText={(v) => setForm({ ...form, titre_ress: v })}
            style={styles.input}
            returnKeyType="next"
          />

          <TextInput
            placeholder={
              "SYNTAXE MARKDOWN :\n### Ton Sous-titre\n**Texte en gras**\n- Point de liste\n\n──────────────────────\nNote : Laissez un espace après le '###'"
            }
            placeholderTextColor="#9ca3af"
            value={form.contenu_ress}
            onChangeText={(v) => setForm({ ...form, contenu_ress: v })}
            multiline
            numberOfLines={8}
            style={[styles.input, styles.textarea]}
            textAlignVertical="top"
          />

          <View style={styles.selectorsRow}>
            <View style={styles.selectorGroup}>
              <Text style={styles.selectorLabel}>Catégorie</Text>
              <SegmentedSelector
                values={CATEGORIES as unknown as readonly string[]}
                selected={form.categorie_ress || "Stress"}
                onSelect={(v) => setForm({ ...form, categorie_ress: v })}
              />
            </View>
            <View style={styles.selectorGroup}>
              <Text style={styles.selectorLabel}>Statut</Text>
              <SegmentedSelector
                values={STATUTS}
                selected={form.statut_ress || "brouillon"}
                onSelect={(v) => setForm({ ...form, statut_ress: v as any })}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitBtn,
              idEnCoursEdition ? styles.submitBtnEdit : styles.submitBtnAdd,
            ]}
            onPress={validerFormulaire}
            activeOpacity={0.8}
          >
            <Ionicons name={idEnCoursEdition ? "checkmark-circle-outline" : "cloud-upload-outline"} size={16} color="#fff" style={{marginRight: 6}} />
            <Text style={styles.submitBtnText}>
              {idEnCoursEdition ? "Enregistrer les modifications" : "Publier la ressource"}
            </Text>
          </TouchableOpacity>

          {idEnCoursEdition && (
            <TouchableOpacity onPress={annulerEdition} style={styles.cancelBtn}>
              <Ionicons name="close-outline" size={14} color="#9ca3af" style={{marginRight: 2}} />
              <Text style={styles.cancelBtnText}>Annuler l'édition</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="folder-open-outline" size={15} color="#374151" />
              <Text style={styles.sectionTitle}>Ressources existantes</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{ressources.length}</Text>
            </View>
          </View>

          {ressources.map((item) => (
            <RessourceCard
              key={item.id_ress}
              item={item}
              onModifier={() => preparerModification(item)}
              onSupprimer={() => supprimerRessource(String(item.id_ress))}
            />
          ))}
        </View>
      </ScrollView>

      <AdminFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: "#9ca3af",
    fontStyle: "italic",
  },

  header: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 56 : 16,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  headerBadge: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#166534",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#9ca3af",
  },
  headerSubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    paddingBottom: 96,
    gap: 20,
    flexDirection: "column",
  },

  messageBanner: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  messageBannerSuccess: { backgroundColor: "#f0fdf4" },
  messageBannerError:   { backgroundColor: "#fef2f2" },
  messageBannerText: { fontSize: 13, fontWeight: "700", textAlign: "center" },
  messageBannerTextSuccess: { color: "#15803d" },
  messageBannerTextError:   { color: "#dc2626" },

  formSection: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 2,
  },
  formSectionDefault: {
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  formSectionEditing: {
    borderColor: "#60a5fa",
    shadowColor: "#3b82f6",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  input: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 13,
    color: "#1f2937",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textarea: {
    height: 160,
    paddingTop: 12,
    paddingBottom: 12,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },

  selectorsRow: {
    flexDirection: "column",
    gap: 10,
  },
  selectorGroup: {
    gap: 5,
  },
  selectorLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingLeft: 2,
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  segmentItemActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentText: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  segmentTextActive: {
    color: "#111827",
    fontWeight: "700",
  },

  submitBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  submitBtnAdd:  { backgroundColor: "#22c55e" },
  submitBtnEdit: { backgroundColor: "#3b82f6" },
  submitBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    color: "#9ca3af",
    textDecorationLine: "underline",
  },

  listSection: {
    gap: 12,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  countBadge: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  countBadgeText: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 0,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  cardCategorie: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16a34a",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  cardDivider: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f9fafb",
  },

  previewContainer: {
    maxHeight: 96,
    overflow: "hidden",
    position: "relative",
  },
  previewInner: {
    // pointer-events: none => géré par pointerEvents prop
  },
  previewFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.85)",
  },

  cardActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    flexDirection: "row",
  },
  actionBtnEdit: {
    borderColor: "#4ade80",
  },
  actionBtnEditText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16a34a",
  },
  actionBtnDelete: {
    borderColor: "#fecaca",
  },
  actionBtnDeleteText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ef4444",
  },
});

const markdownStyles = {
  body: {
    fontSize: 11,
    color: "#6b7280",
  },
  heading3: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#374151",
    textTransform: "uppercase" as const,
    marginTop: 6,
    marginBottom: 2,
  },
  bullet_list: {
    marginLeft: 12,
    marginBottom: 4,
  },
  list_item: {
    fontSize: 11,
    color: "#6b7280",
  },
  paragraph: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 4,
  },
  strong: {
    fontWeight: "700" as const,
    color: "#374151",
  },
};
