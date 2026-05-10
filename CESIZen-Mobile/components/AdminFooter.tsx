import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function AdminFooter() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const handleDeconnexion = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.from('log_activite').insert({
          type_action_log: 'déconnexion',
          statut_log: 'succès',
          id_util: user.id,
        });
      }
    } catch (e) {
      // Log échoué, on continue quand même
    }

    await Promise.race([
      supabase.auth.signOut(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 3000)
      ),
    ]).catch((e) => console.warn('signOut ignoré :', e.message));

    try {
      await AsyncStorage.clear();
    } catch {}

    router.replace('/connexion');
  };

  const navItems = [
    { href: '/admin/',                   icon: 'document-text-outline',      activeIcon: 'document-text',      label: 'Contenus'  },
    { href: '/admin/utilisateurs_admin', icon: 'people-outline',              activeIcon: 'people',             label: 'Membres'   },
    { href: '/admin/exercice_admin',     icon: 'fitness-outline',             activeIcon: 'fitness',            label: 'Exercices' },
    { href: '/admin/logs_admin',         icon: 'shield-checkmark-outline',    activeIcon: 'shield-checkmark',   label: 'Logs'      },
  ];

  return (
    <View style={styles.container}>
      {navItems.map(({ href, icon, activeIcon, label }) => (
        <Link key={href} href={href} asChild>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons
              name={isActive(href) ? (activeIcon as any) : (icon as any)}
              size={22}
              color={isActive(href) ? '#16A34A' : '#9CA3AF'}
            />
            <Text style={[styles.label, isActive(href) ? styles.activeText : styles.inactiveText]}>
              {label}
            </Text>
          </TouchableOpacity>
        </Link>
      ))}

      <TouchableOpacity onPress={handleDeconnexion} style={styles.navItem}>
        <Ionicons name="log-out-outline" size={22} color="#9CA3AF" />
        <Text style={[styles.label, styles.inactiveText]}>Quitter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 5,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  activeText: {
    color: '#16A34A',
  },
  inactiveText: {
    color: '#9CA3AF',
  },
});
