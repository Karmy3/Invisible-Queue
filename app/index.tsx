import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { session, isLoading } = useAuth();

  // On attend que Supabase vérifie s'il y a une session enregistrée
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#c4dcfe" />
      </View>
    );
  }

  // Si on a une session, on va directement à l'accueil
  if (session) {
    return <Redirect href="/home" />;
  }

  // Sinon, on va vers l'écran  de bienvenue
  return <Redirect href="/choice" />;
}