import { Stack } from "expo-router";
import "../../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          contentStyle: { backgroundColor: 'white' } 
        }} 
      />
      <Stack.Screen 
        name="connexion" 
        options={{ 
          headerShown: false,
          contentStyle: { backgroundColor: 'white' } 
        }} 
      />
      <Stack.Screen 
        name="modal" 
        options={{ presentation: 'modal', title: 'Infos' }} 
      />
    </Stack>
  );
}