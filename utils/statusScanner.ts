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

const WHATSAPP_STATUS_PATHS = [
  'content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses',
  'content://com.android.externalstorage.documents/tree/primary%3AWhatsApp%2FMedia%2F.Statuses',
  'content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp.w4b%2FWhatsApp%20Business%2FMedia%2F.Statuses'
];

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];
const VIDEO_EXTENSIONS = ['.mp4', '.3gp', '.mov'];

export async function scanStatuses(): Promise<StatusMedia[]> {
  if (Platform.OS === 'web') {
    console.log('Status scanning is not available on web platform');
    return [];
  }

  const statuses: StatusMedia[] = [];

  try {
    // First try to get media from MediaLibrary
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: ['photo', 'video'],
      first: 50, // Limit to recent items
    });

    // Filter for WhatsApp status files
    const whatsappMedia = media.assets.filter(asset => 
      asset.uri.includes('.Statuses') || 
      asset.filename.startsWith('status_')
    );

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

    // Sort by timestamp, most recent first
    return statuses.sort((a, b) => b.timestamp - a.timestamp);
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