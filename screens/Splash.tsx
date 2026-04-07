import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Menjalankan animasi fade dan scale secara bersamaan
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

    // Pengecekan status login
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('@user_token');
        
        // Memberikan jeda 2.5 detik agar animasi splash screen terlihat
        setTimeout(() => {
          if (token) {
            navigation.replace('Home');
          } else {
            navigation.replace('Login');
          }
        }, 2500);
      } catch (error) {
        // Jika terjadi error, fallback ke halaman login
        setTimeout(() => {
          navigation.replace('Login');
        }, 2500);
      }
    };

    checkAuth();
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content, 
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        {/* Desain Pokeball menggunakan View bawaan */}
        <View style={styles.pokeball}>
          <View style={styles.pokeballTop} />
          <View style={styles.pokeballBottom} />
          <View style={styles.pokeballLine} />
          <View style={styles.pokeballButton} />
        </View>

        <Text style={styles.title}>Pokédex</Text>
        <Text style={styles.subtitle}>Gotta catch 'em all! ⚡️</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  // --- Styling Pokeball ---
  pokeball: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: '#2C3E50',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#2C3E50',
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
    backgroundColor: '#FFFFFF',
  },
  pokeballLine: {
    position: 'absolute',
    width: '100%',
    height: 6,
    backgroundColor: '#2C3E50',
  },
  pokeballButton: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 6,
    borderColor: '#2C3E50',
  },
  // --- Styling Text ---
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#2A75BB', 
    letterSpacing: 2,
    marginBottom: 8,
    textShadowColor: '#FFCB05', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '600',
    letterSpacing: 1,
  },
});