import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

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
        // Request media library permissions
        const mediaPermission = await MediaLibrary.requestPermissionsAsync();
        
        if (mediaPermission.status !== 'granted') {
          setError('Permission to access media library is required');
          setIsLoading(false);
          return;
        }

        // On Android, we also need storage permissions for direct file access
        if (Platform.OS === 'android') {
          const storagePermission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
          
          if (!storagePermission.granted) {
            setError('Storage access permission is required');
            setIsLoading(false);
            return;
          }
        }

        setHasPermission(true);
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