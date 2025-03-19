import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

export interface StatusMedia {
  id: string;
  type: 'image' | 'video';
  uri: string;
  timestamp: number;
  path: string;
}

// Define all possible WhatsApp status paths
const WHATSAPP_STATUS_PATHS = [
  // Standard WhatsApp paths
  'WhatsApp/Media/.Statuses',
  'Android/media/com.whatsapp/WhatsApp/Media/.Statuses',
  'storage/emulated/0/WhatsApp/Media/.Statuses',
  'storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/.Statuses',
  // Business WhatsApp paths
  'WhatsApp Business/Media/.Statuses',
  'Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses',
  'storage/emulated/0/WhatsApp Business/Media/.Statuses',
  'storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses'
].map(path => path.toLowerCase());

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];
const VIDEO_EXTENSIONS = ['.mp4', '.3gp', '.mov'];

async function getMediaFromPath(path: string): Promise<StatusMedia[]> {
  try {
    const files = await FileSystem.readDirectoryAsync(path);
    return files
      .filter(file => {
        const extension = file.toLowerCase().slice(file.lastIndexOf('.'));
        return IMAGE_EXTENSIONS.includes(extension) || VIDEO_EXTENSIONS.includes(extension);
      })
      .map(file => {
        const extension = file.toLowerCase().slice(file.lastIndexOf('.'));
        const isImage = IMAGE_EXTENSIONS.includes(extension);
        const fullPath = `${path}/${file}`;
        
        return {
          id: fullPath,
          type: isImage ? 'image' : 'video',
          uri: `file://${fullPath}`,
          timestamp: Date.now(), // We'll update this with actual file stats
          path: fullPath
        };
      });
  } catch (error) {
    console.log(`Could not scan directory ${path}:`, error);
    return [];
  }
}

export async function scanStatuses(): Promise<StatusMedia[]> {
  if (Platform.OS === 'web') {
    console.log('Status scanning is not available on web platform');
    return [];
  }

  const statuses: StatusMedia[] = [];

  try {
    // First try to get media from MediaLibrary
    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status === 'granted') {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: ['photo', 'video'],
        first: 50, // Limit to recent items
      });

      // Filter for WhatsApp status files
      const whatsappMedia = media.assets.filter(asset => {
        const path = asset.uri.toLowerCase();
        return WHATSAPP_STATUS_PATHS.some(statusPath => path.includes(statusPath));
      });

      for (const asset of whatsappMedia) {
        const extension = asset.filename.toLowerCase().slice(asset.filename.lastIndexOf('.'));
        const isImage = IMAGE_EXTENSIONS.includes(extension);
        const isVideo = VIDEO_EXTENSIONS.includes(extension);

        if (!isImage && !isVideo) continue;

        statuses.push({
          id: asset.id,
          type: isImage ? 'image' : 'video',
          uri: asset.uri,
          timestamp: asset.creationTime,
          path: asset.uri
        });
      }

      // Try to scan all possible paths directly
      if (FileSystem.documentDirectory) {
        for (const basePath of WHATSAPP_STATUS_PATHS) {
          const fullPath = `${FileSystem.documentDirectory}${basePath}`;
          const pathStatuses = await getMediaFromPath(fullPath);
          statuses.push(...pathStatuses);
        }
      }
    }

    // Remove duplicates based on URI
    const uniqueStatuses = Array.from(
      new Map(statuses.map(status => [status.uri, status])).values()
    );

    // Sort by timestamp, most recent first
    return uniqueStatuses.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error scanning status files:', error);
    return [];
  }
}

export async function watchStatuses(callback: (statuses: StatusMedia[]) => void) {
  if (Platform.OS === 'web') return;

  // Initial scan
  const initialStatuses = await scanStatuses();
  callback(initialStatuses);

  // Set up periodic scanning (every 30 seconds)
  const interval = setInterval(async () => {
    const updatedStatuses = await scanStatuses();
    callback(updatedStatuses);
  }, 30000);

  return () => clearInterval(interval);
}