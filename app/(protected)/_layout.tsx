import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext'

export default function ProtectedLayout() {
  const { session, isLoading } = useAuth();

  // Si on charge encore, on montre un écran blanc ou un spinner
  if (isLoading) return null;

  // Si PAS de session, on renvoie vers l'écran de login
  if (!session) {
    return <Redirect href="/signIn" />;
  }

  // Si OK, on affiche les pages du dossier
  return <Stack />;
}