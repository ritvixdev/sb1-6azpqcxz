import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { usePermissions } from '@/hooks/usePermissions';
import ViewToggle, { GridType } from '@/components/status/ViewToggle';
import ImagesTab from '@/components/status/ImagesTab';
import VideosTab from '@/components/status/VideosTab';
import { scanStatuses, watchStatuses, type StatusMedia } from '@/utils/statusScanner';

export default function StatusScreen() {
  const { colors } = useTheme();
  const layout = useWindowDimensions();
  const { hasPermission, isLoading, error } = usePermissions();
  const [index, setIndex] = useState(0);
  const [gridType, setGridType] = useState<GridType>('double');
  const [statuses, setStatuses] = useState<StatusMedia[]>([]);
  const [routes] = useState([
    { key: 'images', title: 'Images' },
    { key: 'videos', title: 'Videos' },
  ]);

  useEffect(() => {
    if (hasPermission && Platform.OS === 'android') {
      const loadStatuses = async () => {
        const initialStatuses = await scanStatuses();
        setStatuses(initialStatuses);
      };

      loadStatuses();
      const unsubscribe = watchStatuses(setStatuses);
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [hasPermission]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    const props = {
      gridType,
      statuses: statuses.filter(s => 
        route.key === 'images' ? s.type === 'image' : s.type === 'video'
      ),
    };
    
    return route.key === 'images' ? 
      <ImagesTab {...props} /> : 
      <VideosTab {...props} />;
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Status</Text>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <View>
            <TabBar
              {...props}
              style={[styles.tabBar, { backgroundColor: colors.background }]}
              indicatorStyle={{ backgroundColor: colors.primary }}
              activeColor={colors.primary}
              inactiveColor={colors.text}
              labelStyle={styles.tabLabel}
            />
            <View style={styles.toggleContainer}>
              <ViewToggle gridType={gridType} onToggle={setGridType} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
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
  toggleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  error: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});