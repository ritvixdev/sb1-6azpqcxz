import React from 'react';
import { View, StyleSheet, Dimensions, Pressable, Platform } from 'react-native';
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
  const isIOS = Platform.OS === 'ios';

  const getItemDimensions = () => {
    const padding = GAP * 2; // Container padding
    const availableWidth = width - padding;
    const columnCount = gridType === 'single' ? 1 : gridType === 'double' ? 2 : 3;
    const gapSpace = GAP * (columnCount - 1);
    const itemWidth = (availableWidth - gapSpace) / columnCount;
    
    // For single column, make height 3:2 ratio
    // For other grids, make it square
    const itemHeight = gridType === 'single' ? itemWidth * 0.75 : itemWidth;
    
    return { width: itemWidth, height: itemHeight };
  };

  const { width: itemWidth, height: itemHeight } = getItemDimensions();

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <AnimatedPressable
          key={item.id}
          entering={FadeInDown.delay(index * 50).springify()}
          style={[
            styles.item,
            {
              width: itemWidth,
              height: itemHeight,
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
          <Animated.View 
            entering={FadeInDown.delay(index * 100)}
            style={[styles.overlay, { height: gridType === 'triple' ? 40 : 56 }]}>
            <Pressable
              style={[styles.iconButton, { width: gridType === 'triple' ? 32 : 40, height: gridType === 'triple' ? 32 : 40 }]}
              onPress={() => onDownload(item.id)}>
              <Download size={gridType === 'triple' ? 16 : 20} color="#FFFFFF" />
            </Pressable>
            <Pressable
              style={[styles.iconButton, { width: gridType === 'triple' ? 32 : 40, height: gridType === 'triple' ? 32 : 40 }]}
              onPress={() => onShare(item.id)}>
              <Share2 size={gridType === 'triple' ? 16 : 20} color="#FFFFFF" />
            </Pressable>
          </Animated.View>
        </AnimatedPressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: GAP,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  item: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
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
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  iconButton: {
    borderRadius: 20,
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