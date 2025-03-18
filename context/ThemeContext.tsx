import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof themes.light;
}

const themes = {
  light: {
    background: '#FFFFFF',
    text: '#1A1A1A',
    primary: '#007AFF',
    secondary: '#5856D6',
    border: '#E5E5EA',
    card: '#F2F2F7',
    error: '#FF3B30',
    success: '#34C759',
  },
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    border: '#38383A',
    card: '#1C1C1E',
    error: '#FF453A',
    success: '#30D158',
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  colors: themes.dark,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme() as Theme;
  const [theme, setTheme] = useState<Theme>(systemTheme || 'dark');

  useEffect(() => {
    setTheme(systemTheme || 'dark');
  }, [systemTheme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);