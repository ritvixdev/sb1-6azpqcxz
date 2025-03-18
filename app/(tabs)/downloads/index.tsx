import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Animated, { FadeIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Folder, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useWindowDimensions } from 'react-native';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

function LocationHeader() {
  const { colors } = useTheme();
  const isIOS = Platform.OS === 'ios';

  return (
    <Animated.View 
      entering={FadeIn}
      style={[
        styles.locationCard,
        {
          backgroundColor: isIOS ? 'transparent' : colors.card,
        }
      ]}>
      {isIOS && (
        <AnimatedBlurView
          intensity={80}
          tint={colors.background === '#000000' ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.locationContent}>
        <Folder size={24} color={colors.primary} />
        <Text style={[styles.locationPath, { color: colors.text }]}>
          Internal Storage/Downloads/WhatsApp Status
        </Text>
        <Pressable style={styles.changeButton}>
          <Text style={[styles.changeButtonText, { color: colors.primary }]}>Change</Text>
          <ChevronRight size={16} color={colors.primary} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

function ImagesTab() {
  const { colors } = useTheme();
  return (
    <View style={[styles.scene, { backgroundColor: colors.background }]}>
      <Text style={[styles.emptyText, { color: colors.text }]}>No images downloaded yet</Text>
    </View>
  );
}

function VideosTab() {
  const { colors } = useTheme();
  return (
    <View style={[styles.scene, { backgroundColor: colors.background }]}>
      <Text style={[styles.emptyText, { color: colors.text }]}>No videos downloaded yet</Text>
    </View>
  );
}

const renderScene = SceneMap({
  images: ImagesTab,
  videos: VideosTab,
});

export default function DownloadsScreen() {
  const { colors } = useTheme();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'images', title: 'Images' },
    { key: 'videos', title: 'Videos' },
  ]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LocationHeader />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            style={[styles.tabBar, { backgroundColor: colors.background }]}
            indicatorStyle={{ backgroundColor: colors.primary }}
            activeColor={colors.primary}
            inactiveColor={colors.text}
            labelStyle={styles.tabLabel}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  locationCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
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
  locationContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationPath: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  changeButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginRight: 4,
  },
  scene: {
    flex: 1,
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  tabLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    textTransform: 'none',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
});