import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Image as ImageIcon, Download, Settings } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { theme, colors } = useTheme();
  const isIOS = Platform.OS === 'ios';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: isIOS ? 88 : 64,
          paddingBottom: isIOS ? 28 : 12,
          paddingTop: 12,
          elevation: isIOS ? 0 : 4,
          shadowColor: isIOS ? colors.border : undefined,
          shadowOffset: isIOS ? { width: 0, height: -2 } : undefined,
          shadowOpacity: isIOS ? 0.1 : undefined,
          shadowRadius: isIOS ? 4 : undefined,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 12,
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="status"
        options={{
          title: 'Status',
          tabBarIcon: ({ color, size }) => <ImageIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="downloads"
        options={{
          title: 'Downloads',
          tabBarIcon: ({ color, size }) => <Download size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}