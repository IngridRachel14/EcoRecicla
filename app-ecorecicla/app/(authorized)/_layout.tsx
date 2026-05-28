import { useAuthSession } from '@/providers/AuthProvider';
import { Redirect, Stack } from 'expo-router';

export default function AuthorizedLayout() {
  const { token, isLoading } = useAuthSession();

  if (isLoading) return null;

  if (!token.current) {
    return <Redirect href="/(auth)/sign-up" />;
  }
   return <Stack screenOptions={{ headerShown: false }}/>;
}
