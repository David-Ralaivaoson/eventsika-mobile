import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type Token = {
  id: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

type AuthContextType = {
  user: User | null;
  session: Token | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const segments = useSegments();

  // 🔹 Vérifie la session au démarrage
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('token');
        if (!savedToken) {
          setUser(null);
          setSession(null);
          return;
        }

        const res = await fetch('http://192.168.88.4:3000/me', {
          headers: { Authorization: `Bearer ${savedToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setSession(data.token);
        } else {
          await AsyncStorage.removeItem('token');
          setUser(null);
          setSession(null);
        }
      } catch (err) {
        console.log('Erreur de récupération de session', err);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // 🔹 Redirection automatique selon l’état de connexion
  useEffect(() => {
    if (loading) return; // ⚠️ attendre la fin du loading

    const publicRoutes = ['login', 'init-screen', 'signup'];
    const currentRoute = segments[segments.length - 1];
    const inPublicGroup = publicRoutes.includes(currentRoute);

    if (!user && !inPublicGroup) {
      router.replace('/init-screen'); // Non connecté → init-screen
    } else if (user && inPublicGroup) {
      router.replace('/(tabs)'); // Connecté → app principale
    }
  }, [user, segments, loading]);

  // 🔹 Connexion
  const login = async (token: string) => {
    try {
      await AsyncStorage.setItem('token', token);

      const res = await fetch('http://192.168.88.4:3000/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Impossible de récupérer la session');

      const data = await res.json();
      setUser(data.user);
      setSession(data.token);

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erreur lors du login :', error);
    }
  };

  // 🔹 Déconnexion
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
    setSession(null);
    router.replace('/init-screen');
  };

  // 🔹 Loader personnalisé pendant que la session est récupérée
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#1e40af" />
        <Text className="mt-2 text-blue-700 text-lg">Chargement...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Hook pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
