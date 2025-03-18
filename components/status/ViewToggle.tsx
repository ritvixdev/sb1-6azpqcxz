import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Grid2x2 as Grid, Grid3x3, AlignJustify } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

export type GridType = 'single' | 'double' | 'triple';

interface ViewToggleProps {
  gridType: GridType;
  onToggle: (type: GridType) => void;
}

export default function ViewToggle({ gridType, onToggle }: ViewToggleProps) {
  const { colors } = useTheme();

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ 
      translateX: withSpring(
        gridType === 'single' ? 0 : 
        gridType === 'double' ? 36 : 72
      ) 
    }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Animated.View
        style={[
          styles.indicator,
          { backgroundColor: colors.primary },
          indicatorStyle,
        ]}
      />
      <Pressable
        style={styles.button}
        onPress={() => onToggle('single')}>
        <AlignJustify
          size={20}
          color={gridType === 'single' ? '#FFFFFF' : colors.text}
        />
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => onToggle('double')}>
        <Grid
          size={20}
          color={gridType === 'double' ? '#FFFFFF' : colors.text}
        />
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => onToggle('triple')}>
        <Grid3x3
          size={20}
          color={gridType === 'triple' ? '#FFFFFF' : colors.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 120,
    height: 40,
    borderRadius: 20,
    padding: 4,
    position: 'relative',
  },
  indicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
    top: 4,
    left: 4,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});