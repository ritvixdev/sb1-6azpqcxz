import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import { Download, Share2, X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface MediaViewerProps {
  uri: string;
  type: 'image' | 'video';
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function MediaViewer({ uri, type, onClose, onDownload, onShare }: MediaViewerProps) {
  const { colors } = useTheme();
  const video = React.useRef<Video>(null);

  return (
    <View style={styles.container}>
      <Animated.View 
        entering={FadeIn}
        exiting={FadeOut}
        style={StyleSheet.absoluteFill}>
        <AnimatedBlurView
          intensity={90}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Pressable style={styles.closeButton} onPress={onClose}>
        <X color="#FFFFFF" size={24} />
      </Pressable>

      <View style={styles.mediaContainer}>
        {type === 'image' ? (
          <Image
            source={{ uri }}
            style={styles.media}
            contentFit="contain"
            transition={200}
          />
        ) : (
          <Video
            ref={video}
            source={{ uri }}
            style={styles.media}
            useNativeControls
            resizeMode="contain"
            isLooping
            shouldPlay
          />
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={onDownload}>
          <Download color="#FFFFFF" size={24} />
        </Pressable>
        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.secondary }]}
          onPress={onShare}>
          <Share2 color="#FFFFFF" size={24} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  mediaContainer: {
    width: width,
    height: height - 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  actions: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});