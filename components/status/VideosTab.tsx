import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import MediaGrid from './MediaGrid';
import MediaList from './MediaList';
import MediaViewer from './MediaViewer';
import type { GridType } from './ViewToggle';

const DEMO_VIDEOS = [
  {
    id: '1',
    type: 'video' as const,
    uri: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=500&q=80',
    timestamp: Date.now() - 1000 * 60 * 60,
    duration: '0:45',
  },
  {
    id: '2',
    type: 'video' as const,
    uri: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-with-smartphone-6894-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1682687220063-4742bd7c98d7?w=500&q=80',
    timestamp: Date.now(),
    duration: '1:20',
  },
];

interface VideosTabProps {
  gridType: GridType;
  viewMode?: 'grid' | 'list';
}

export default function VideosTab({ gridType, viewMode = 'grid' }: VideosTabProps) {
  const { colors } = useTheme();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleDownload = async (id: string) => {
    const video = DEMO_VIDEOS.find(v => v.id === id);
    if (video) {
      console.log('Downloading:', video.uri);
    }
  };

  const handleShare = async (id: string) => {
    const video = DEMO_VIDEOS.find(v => v.id === id);
    if (video) {
      console.log('Sharing:', video.uri);
    }
  };

  const handleMediaPress = (id: string) => {
    const video = DEMO_VIDEOS.find(v => v.id === id);
    if (video) {
      setSelectedVideo(video.uri);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}>
      {viewMode === 'grid' ? (
        <MediaGrid
          items={DEMO_VIDEOS}
          gridType={gridType}
          onMediaPress={handleMediaPress}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      ) : (
        <MediaList
          items={DEMO_VIDEOS.map(video => ({
            ...video,
            timestamp: new Date(video.timestamp).toLocaleTimeString(),
          }))}
          onMediaPress={handleMediaPress}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      )}

      {selectedVideo && (
        <MediaViewer
          uri={selectedVideo}
          type="video"
          onClose={() => setSelectedVideo(null)}
          onDownload={() => handleDownload(selectedVideo)}
          onShare={() => handleShare(selectedVideo)}
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