import { FooterNav } from '@/components/Footer';
import { Input } from '@/components/Input';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfil } from '../controllers/useProfil';
import { ProfilLabels } from '../models/profil.model';

export default function ProfilPage() {
  const { form, setForm, message, loading, handleUpdate, handleDelete, handleLogout, handlePasswordReset } = useProfil();

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
      <ActivityIndicator size="large" color="#16a34a" />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      <View style={{ padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#16a34a' }}>
            {ProfilLabels.titre}
          </Text>

          <TouchableOpacity
            onPress={handleLogout}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            style={{
              backgroundColor: '#FEF2F2',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#EF4444', fontWeight: '600', fontSize: 13 }}>
              {ProfilLabels.boutons.deconnexion}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: '#f9fafb' }}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
      >
        {/* SECTION INFOS */}
        <View style={{
          backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12,
          elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
        }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 }}>
            {ProfilLabels.sections.infos}
          </Text>
          <Input
            value={form.prenom_util}
            onChangeText={(t) => setForm({ ...form, prenom_util: t })}
            placeholder={ProfilLabels.inputs.prenom}
          />
          <Input
            value={form.nom_util}
            onChangeText={(t) => setForm({ ...form, nom_util: t })}
            placeholder={ProfilLabels.inputs.nom}
          />
          <Input
            type="email"
            value={form.email_util}
            onChangeText={(t) => setForm({ ...form, email_util: t })}
            placeholder={ProfilLabels.inputs.email}
          />
          {message ? (
            <Text style={{ textAlign: 'center', color: message.startsWith('✅') ? '#16a34a' : '#ef4444', fontWeight: '600', fontSize: 14, marginTop: 4 }}>
              {message}
            </Text>
          ) : null}
          <TouchableOpacity
            onPress={handleUpdate}
            style={{
              backgroundColor: '#16a34a', borderRadius: 10,
              paddingVertical: 12, alignItems: 'center', marginTop: 16,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
              {ProfilLabels.boutons.sauvegarder}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{
          backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12,
          elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
        }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }}>
            🔒 Sécurité
          </Text>
          <Text style={{ fontSize: 13, color: '#6b7280', lineHeight: 20, marginBottom: 16 }}>
            Pour modifier votre mot de passe, un lien de réinitialisation sécurisé vous sera envoyé par e-mail.
          </Text>
          <TouchableOpacity
            onPress={handlePasswordReset}
            style={{
              borderRadius: 10, paddingVertical: 12, alignItems: 'center',
              borderWidth: 1.5, borderColor: '#e5e7eb', backgroundColor: '#f9fafb',
            }}
          >
            <Text style={{ color: '#374151', fontWeight: '600', fontSize: 13 }}>
              Réinitialiser mon mot de passe
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{
          backgroundColor: '#fef2f2', borderRadius: 16, padding: 16, marginBottom: 12,
          borderWidth: 1, borderColor: '#fecaca',
        }}>
          <Text style={{ fontSize: 13, color: '#f87171', lineHeight: 20, marginBottom: 16 }}>
            La suppression de votre compte entraînera la suppression définitive de vos données, conformément au RGPD.
          </Text>
          <TouchableOpacity
            onPress={handleDelete}
            style={{
              backgroundColor: '#ef4444', borderRadius: 10,
              paddingVertical: 12, alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>
              Supprimer mon compte définitivement
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FooterNav estConnecte={true} />
    </SafeAreaView>
  );
}
