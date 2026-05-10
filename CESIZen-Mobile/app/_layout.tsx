import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { supabase } from '@/lib/supabase';

export {
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const redirectDone = useRef(false);

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      if (redirectDone.current) return;

      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) return;

      const { data: profil } = await supabase
        .from('utilisateur')
        .select('type_util')
        .eq('id_util', session.user.id)
        .single();

      redirectDone.current = true;

      if (profil?.type_util === 'Administrateur') {
        router.replace('/admin');
      } else if (profil?.type_util) {
        router.replace('/dashboard');
      }
    };

    checkSessionAndRedirect();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="connexion" options={{ headerShown: false }} />
        <Stack.Screen name="inscription" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="admin/exercice_admin" options={{ headerShown: false }} />
        <Stack.Screen name="conditions" options={{ title: 'Mentions Légales', headerShown: true }} />
      </Stack>
    </ThemeProvider>
  );
}
