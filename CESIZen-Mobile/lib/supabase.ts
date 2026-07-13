import 'react-native-get-random-values';
import * as aesjs from 'aes-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { Database } from '../lib/database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY doivent être définies (fichier .env à la racine de CESIZen-Mobile).'
  );
}

// Stockage de session chiffré pour le mobile (iOS/Android) : la clé de chiffrement est
// gardée dans le Keychain/Keystore via expo-secure-store, et seule la valeur chiffrée
// (illisible sans cette clé) est mise dans AsyncStorage, qui ne supporte pas nativement
// les gros volumes de données. Sur le web, SecureStore n'existe pas : on garde AsyncStorage
// simple, cohérent avec le comportement standard d'un navigateur.
// Basé sur le modèle documenté par Supabase pour Expo.
class SessionStorageChiffre {
  private async chiffrer(cle: string, valeur: string) {
    const cleChiffrement = crypto.getRandomValues(new Uint8Array(256 / 8));
    const chiffreur = new aesjs.ModeOfOperation.ctr(cleChiffrement, new aesjs.Counter(1));
    const octetsChiffres = chiffreur.encrypt(aesjs.utils.utf8.toBytes(valeur));

    await SecureStore.setItemAsync(cle, aesjs.utils.hex.fromBytes(cleChiffrement));

    return aesjs.utils.hex.fromBytes(octetsChiffres);
  }

  private async dechiffrer(cle: string, valeur: string) {
    const cleHex = await SecureStore.getItemAsync(cle);
    if (!cleHex) return null;

    const chiffreur = new aesjs.ModeOfOperation.ctr(
      aesjs.utils.hex.toBytes(cleHex),
      new aesjs.Counter(1)
    );
    const octetsDechiffres = chiffreur.decrypt(aesjs.utils.hex.toBytes(valeur));

    return aesjs.utils.utf8.fromBytes(octetsDechiffres);
  }

  async getItem(cle: string) {
    const valeurChiffree = await AsyncStorage.getItem(cle);
    if (!valeurChiffree) return null;
    return this.dechiffrer(cle, valeurChiffree);
  }

  async removeItem(cle: string) {
    await AsyncStorage.removeItem(cle);
    await SecureStore.deleteItemAsync(cle);
  }

  async setItem(cle: string, valeur: string) {
    const valeurChiffree = await this.chiffrer(cle, valeur);
    await AsyncStorage.setItem(cle, valeurChiffree);
  }
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: Platform.OS === 'web' ? AsyncStorage : new SessionStorageChiffre(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);