import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  RefObject
} from 'react';

type AuthContextType = {
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  token: RefObject<string | null>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  signIn: async () => { },
  signOut: async () => { },
  token: { current: null },
  isLoading: true
});

export function useAuthSession() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const tokenRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    (async () => {
      const storedToken = await AsyncStorage.getItem('@token');
      if (!storedToken) {
        if (isMounted) setIsLoading(false);
        return;
      }
      if (storedToken) {
        try {
          const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL!}/auth/validate-token`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            },
            signal: controller.signal
          });

          if (!res.ok) throw new Error('Token inválido');

          if (isMounted) {
            tokenRef.current = storedToken;
            router.replace('/(authorized)/(tabs)');
          }
        } catch (error: any) {
          if (error.name === 'AbortError') {
            return;
          }

          if (isMounted) {
            await AsyncStorage.removeItem('@token');
            tokenRef.current = null;
            router.replace('/(auth)/sign-up');
          }
        } finally {
          if (isMounted) setIsLoading(false);
        }
      } else {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const signIn = useCallback(async (token: string) => {
    await AsyncStorage.setItem('@token', token);
    tokenRef.current = token;
    router.replace('/(authorized)/(tabs)');
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem('@token');
    tokenRef.current = null;
    router.push('/(auth)/sign-up');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        token: tokenRef,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
