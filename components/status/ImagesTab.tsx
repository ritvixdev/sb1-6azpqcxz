import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Download, Share2 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeIn } from 'react-native-reanimated';
import MediaViewer from './MediaViewer';

const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1682687220742-aba19b51f6d2?w=500&q=80',
  'https://images.unsplash.com/photo-1682687220063-4742bd7c98d7?w=500&q=80',
  'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=500&q=80',
];

export default function ImagesTab() {
  const { colors } = useTheme();
  const isIOS = Platform.OS === 'ios';
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDownload = async (uri: string) => {
    // Implement download logic
    console.log('Downloading:', uri);
  };

  const handleShare = async (uri: string) => {
    // Implement share logic
    console.log('Sharing:', uri);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}>
      {DEMO_IMAGES.map((uri, index) => (
        <Animated.View
          key={uri}
          entering={FadeIn.delay(index * 100)}
          style={[
            styles.card,
            {
              backgroundColor: isIOS ? colors.card : colors.background,
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 4,
                },
              }),
            },
          ]}>
          <Pressable onPress={() => setSelectedImage(uri)}>
            <Image source={{ uri }} style={styles.image} />
            <View style={styles.overlay}>
              <Pressable
                style={styles.iconButton}
                onPress={() => handleDownload(uri)}>
                <Download size={24} color="#FFFFFF" />
              </Pressable>
              <Pressable
                style={styles.iconButton}
                onPress={() => handleShare(uri)}>
                <Share2 size={24} color="#FFFFFF" />
              </Pressable>
            </View>
          </Pressable>
        </Animated.View>
      ))}

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
    padding: 16,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});