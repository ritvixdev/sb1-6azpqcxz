import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Play } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const DEMO_VIDEOS = [
  {
    thumbnail: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=500&q=80',
    duration: '0:45',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1682687220063-4742bd7c98d7?w=500&q=80',
    duration: '1:20',
  },
];

export default function VideosTab() {
  const { colors } = useTheme();
  const isIOS = Platform.OS === 'ios';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}>
      {DEMO_VIDEOS.map((video, index) => (
        <Animated.View
          key={video.thumbnail}
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
          <View style={styles.thumbnailContainer}>
            <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
            <View style={styles.playButton}>
              <Play size={24} color="#FFFFFF" />
            </View>
            <View style={styles.duration}>
              <Text style={styles.durationText}>{video.duration}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <Pressable
              style={[styles.button, { backgroundColor: colors.primary }]}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}>
              <Text style={styles.buttonText}>Download</Text>
            </Pressable>
            <Pressable
              style={[styles.button, { backgroundColor: colors.secondary }]}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}>
              <Text style={styles.buttonText}>Share</Text>
            </Pressable>
          </View>
        </Animated.View>
      ))}
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
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  duration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
});