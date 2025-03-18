import React from 'react';
import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Download, Share2, Play } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import type { GridType } from './ViewToggle';

const { width } = Dimensions.get('window');
const GAP = 12;

interface MediaGridProps {
  items: Array<{
    id: string;
    type: 'image' | 'video';
    uri: string;
    thumbnail?: string;
    duration?: string;
  }>;
  gridType: GridType;
  onMediaPress: (id: string) => void;
  onDownload: (id: string) => void;
  onShare: (id: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function MediaGrid({ items, gridType, onMediaPress, onDownload, onShare }: MediaGridProps) {
  const { colors } = useTheme();

  const getItemWidth = () => {
    const columnCount = gridType === 'single' ? 1 : gridType === 'double' ? 2 : 3;
    return (width - (GAP * (columnCount + 1))) / columnCount;
  };

  const itemWidth = getItemWidth();

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <AnimatedPressable
          key={item.id}
          entering={FadeInDown.delay(index * 100)}
          style={[
            styles.item,
            {
              backgroundColor: colors.card,
              width: itemWidth,
              height: gridType === 'single' ? itemWidth * 1.5 : itemWidth,
            },
          ]}
          onPress={() => onMediaPress(item.id)}>
          <Image
            source={{ uri: item.thumbnail || item.uri }}
            style={styles.media}
            contentFit="cover"
            transition={200}
          />
          {item.type === 'video' && (
            <View style={styles.playButton}>
              <Play size={24} color="#FFFFFF" />
            </View>
          )}
          <View style={styles.overlay}>
            <Pressable
              style={styles.iconButton}
              onPress={() => onDownload(item.id)}>
              <Download size={20} color="#FFFFFF" />
            </Pressable>
            <Pressable
              style={styles.iconButton}
              onPress={() => onShare(item.id)}>
              <Share2 size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </AnimatedPressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    padding: GAP,
  },
  item: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
});