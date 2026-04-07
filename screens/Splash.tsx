import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext'; // Import hook tema

export default function SplashScreen({ navigation }: any) {
  const { theme, isDarkMode } = useTheme(); // Ambil data tema
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Jalankan animasi
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('@user_token');
        
        setTimeout(() => {
          if (token) {
            navigation.replace('Home');
          } else {
            navigation.replace('Login');
          }
        }, 2500);
      } catch (error) {
        setTimeout(() => {
          navigation.replace('Login');
        }, 2500);
      }
    };

    checkAuth();
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View 
        style={[
          styles.content, 
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        {/* Desain Pokeball Dinamis */}
        <View style={[
          styles.pokeball, 
          { 
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
            borderColor: isDarkMode ? '#E1E8ED' : '#2C3E50',
            shadowColor: isDarkMode ? '#000' : '#2C3E50'
          }
        ]}>
          <View style={styles.pokeballTop} />
          <View style={[styles.pokeballBottom, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]} />
          <View style={[styles.pokeballLine, { backgroundColor: isDarkMode ? '#E1E8ED' : '#2C3E50' }]} />
          <View style={[
            styles.pokeballButton, 
            { 
              backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              borderColor: isDarkMode ? '#E1E8ED' : '#2C3E50' 
            }
          ]} />
        </View>

        <Text style={[styles.title, { textShadowColor: isDarkMode ? '#FFCB05' : 'rgba(255, 203, 5, 0.5)' }]}>
          Pokédex
        </Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>
          Gotta catch 'em all! ⚡️
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  pokeball: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 8,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  pokeballTop: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '50%',
    backgroundColor: '#E74C3C',
  },
  pokeballBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
  },
  pokeballLine: {
    position: 'absolute',
    width: '100%',
    height: 6,
  },
  pokeballButton: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 6,
    zIndex: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#2A75BB', 
    letterSpacing: 2,
    marginBottom: 8,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});