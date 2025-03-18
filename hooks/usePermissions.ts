import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export function usePermissions() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function requestPermissions() {
      if (Platform.OS === 'web') {
        setHasPermission(true);
        setIsLoading(false);
        return;
      }

      try {
        const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
        
        if (status === 'granted') {
          setHasPermission(true);
        } else if (canAskAgain) {
          const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
          setHasPermission(newStatus === 'granted');
        } else {
          setError('Permission to access media library is required');
        }
      } catch (err) {
        setError('Failed to request permissions');
        console.error('Permission error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    requestPermissions();
  }, []);

  return { hasPermission, isLoading, error };
}