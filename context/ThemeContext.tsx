import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: {
    background: '#F2F5F7',
    card: '#FFFFFF',
    text: '#2C3E50',
    subText: '#7F8C8D',
    border: '#E1E8ED',
    primary: '#2A75BB',
    secondary: '#FFCB05',
    accent: '#E74C3C',
  }
});

export const ThemeProvider = ({ children }: any) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const savedTheme = await AsyncStorage.getItem('@user_theme');
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
  };

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('@user_theme', newMode ? 'dark' : 'light');
  };

  
  const theme = {
    background: isDarkMode ? '#121212' : '#F2F5F7',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#E1E8ED' : '#2C3E50',
    subText: isDarkMode ? '#AAB8C2' : '#7F8C8D',
    border: isDarkMode ? '#333333' : '#E1E8ED',
    primary: '#2A75BB',
    secondary: '#FFCB05',
    accent: isDarkMode ? '#BB86FC' : '#E74C3C',
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);