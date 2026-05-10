import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../lib/database.types';

export const supabase = createClient<Database>(
  'https://sdhqqvztxnbjecekkkkl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkaHFxdnp0eG5iamVjZWtra2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMDEwNTgsImV4cCI6MjA4NDY3NzA1OH0.KBfbxWgbZpEqmetXHAoVk8KVudrtjcPFuQVIX4PMkZo',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);