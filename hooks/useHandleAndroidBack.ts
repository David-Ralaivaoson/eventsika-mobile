import { router, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';

export function useHandleAndroidBack() {
  const pathname = usePathname();

  useEffect(() => {
    const backAction = () => {
      // Si on est dans (tabs)/index, prévenir avant fermeture
      if (pathname === '/(tabs)/index') {
        Alert.alert('Quitter l’application', 'Voulez-vous vraiment quitter ?', [
          { text: 'Non', style: 'cancel' },
          { text: 'Oui', onPress: () => BackHandler.exitApp() },
        ]);
        return true; // empêche la fermeture par défaut
      }

      // Si on est dans une page enfant du tabs (ex: messages), revenir au tabs index
      if (pathname.startsWith('/(tabs)/messages')) {
        router.back();
        return true; // empêche la fermeture par défaut
      }

      // Sinon, navigation normale
      return false;
    };

    const handler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => handler.remove();
  }, [pathname]);
}
