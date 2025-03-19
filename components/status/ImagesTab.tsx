import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import MediaGrid from './MediaGrid';
import MediaList from './MediaList';
import MediaViewer from './MediaViewer';
import type { GridType } from './ViewToggle';

const DEMO_IMAGES = [
  {
    id: '1',
    type: 'image' as const,
    uri: 'https://images.unsplash.com/photo-1682687220742-aba19b51f6d2?w=500&q=80',
    timestamp: Date.now() - 1000 * 60 * 60,
  },
  {
    id: '2',
    type: 'image' as const,
    uri: 'https://images.unsplash.com/photo-1682687220063-4742bd7c98d7?w=500&q=80',
    timestamp: Date.now() - 1000 * 60 * 30,
  },
  {
    id: '3',
    type: 'image' as const,
    uri: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=500&q=80',
    timestamp: Date.now(),
  },
];

interface ImagesTabProps {
  gridType: GridType;
  viewMode?: 'grid' | 'list';
}

export default function ImagesTab({ gridType, viewMode = 'grid' }: ImagesTabProps) {
  const { colors } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDownload = async (id: string) => {
    const image = DEMO_IMAGES.find(img => img.id === id);
    if (image) {
      console.log('Downloading:', image.uri);
    }
  };

  const handleShare = async (id: string) => {
    const image = DEMO_IMAGES.find(img => img.id === id);
    if (image) {
      console.log('Sharing:', image.uri);
    }
  };

  const handleMediaPress = (id: string) => {
    const image = DEMO_IMAGES.find(img => img.id === id);
    if (image) {
      setSelectedImage(image.uri);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}>
      {viewMode === 'grid' ? (
        <MediaGrid
          items={DEMO_IMAGES}
          gridType={gridType}
          onMediaPress={handleMediaPress}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      ) : (
        <MediaList
          items={DEMO_IMAGES.map(img => ({
            ...img,
            timestamp: new Date(img.timestamp).toLocaleTimeString(),
          }))}
          onMediaPress={handleMediaPress}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      )}

      {selectedImage && (
        <MediaViewer
          uri={selectedImage}
          type="image"
          onClose={() => setSelectedImage(null)}
          onDownload={() => handleDownload(selectedImage)}
          onShare={() => handleShare(selectedImage)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});