import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Download, Share2, Play, Clock } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

interface MediaListProps {
  items: Array<{
    id: string;
    type: 'image' | 'video';
    uri: string;
    thumbnail?: string;
    duration?: string;
    timestamp: string;
  }>;
  onMediaPress: (id: string) => void;
  onDownload: (id: string) => void;
  onShare: (id: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function MediaList({ items, onMediaPress, onDownload, onShare }: MediaListProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <AnimatedPressable
          key={item.id}
          entering={FadeInRight.delay(index * 100)}
          style={[styles.item, { backgroundColor: colors.card }]}
          onPress={() => onMediaPress(item.id)}>
          <View style={styles.mediaContainer}>
            <Image
              source={{ uri: item.thumbnail || item.uri }}
              style={styles.thumbnail}
              contentFit="cover"
              transition={200}
            />
            {item.type === 'video' && (
              <View style={styles.playButton}>
                <Play size={20} color="#FFFFFF" />
              </View>
            )}
          </View>
          <View style={styles.content}>
            <View style={styles.info}>
              <Text style={[styles.type, { color: colors.text }]}>
                {item.type === 'image' ? 'Photo' : 'Video'}
              </Text>
              <View style={styles.timestamp}>
                <Clock size={12} color={colors.text} />
                <Text style={[styles.time, { color: colors.text }]}>
                  {item.timestamp}
                </Text>
              </View>
            </View>
            <View style={styles.actions}>
              <Pressable
                style={[styles.iconButton, { backgroundColor: colors.primary }]}
                onPress={() => onDownload(item.id)}>
                <Download size={20} color="#FFFFFF" />
              </Pressable>
              <Pressable
                style={[styles.iconButton, { backgroundColor: colors.secondary }]}
                onPress={() => onShare(item.id)}>
                <Share2 size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </AnimatedPressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
  },
  mediaContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  info: {
    gap: 4,
  },
  type: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  timestamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -18 }, { translateY: -18 }],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});