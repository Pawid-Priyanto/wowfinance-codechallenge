import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PokemonCard from '../component/PokemonCard';
import { useTheme } from '../context/ThemeContext';

interface Pokemon {
  name: string;
  url: string;
}

export default function HomeScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { isDarkMode, toggleTheme, theme } = useTheme();
  
  // --- STATE BARU UNTUK INFINITE SCROLL ---
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('@user_email');
      if (storedEmail) setEmail(storedEmail);
    };
    fetchUserEmail();
    
    // Panggil API saat halaman pertama kali dirender
    fetchInitialPokemons();
  }, []);

  // --- FUNGSI FETCH PERTAMA & REFRESH ---
  const fetchInitialPokemons = async () => {
    setErrorMsg('');
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=50');
      setPokemons(response.data.results);
      setNextUrl(response.data.next); // Simpan URL halaman berikutnya
    } catch (error) {
      setErrorMsg('Gagal mengambil data Pokemon.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --- FUNGSI FETCH TAMBAHAN (INFINITE SCROLL) ---
  const fetchMorePokemons = async () => {
    // Cegah API kepanggil dobel kalau lagi loading, atau kalau datanya udah habis
    if (isLoadingMore || !nextUrl) return; 

    setIsLoadingMore(true);
    try {
      const response = await axios.get(nextUrl);
      // Gabungkan data lama dengan data baru
      setPokemons((prevPokemons) => [...prevPokemons, ...response.data.results]);
      setNextUrl(response.data.next); // Update URL ke halaman selanjutnya lagi
    } catch (error) {
      console.log('Gagal load more:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchInitialPokemons();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  const navigateToDetail = useCallback((pokemon: Pokemon, id: string, imageUrl: string) => {
    navigation.navigate('Detail', { 
      pokemonName: pokemon.name,
      pokemonId: id,
      imageUrl: imageUrl
    });
  }, [navigation]);

  const renderPokemonItem = useCallback(({ item }: { item: Pokemon }) => (
    <PokemonCard 
      pokemon={item} 
      onPress={navigateToDetail} 
    />
  ), [navigateToDetail]);

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {errorMsg ? (
        <Text style={styles.emptyText}>{errorMsg}</Text>
      ) : (
        <Text style={styles.emptyText}>Tidak ada data Pokemon ditemukan.</Text>
      )}
    </View>
  );

  // --- KOMPONEN LOADING DI BAWAH (FOOTER) ---
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large"color={theme.primary} />
      </View>
    );
  };

  const logoutBtnStyle = [
  styles.logoutBtn, 
  { 
    backgroundColor: isDarkMode ? '#331a1a' : '#FDEDEC', 
    borderColor: isDarkMode ? '#662222' : '#E74C3C' 
  }
];

    useLayoutEffect(() => {
        navigation.setOptions({
        headerStyle: { backgroundColor: theme.card, elevation: 0, shadowOpacity: 0 },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '800' },
        });
    }, [navigation, theme]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View>
          <Text style={[styles.greeting, { color: theme.subText }]}>Hello, Trainer!</Text>
          <Text style={[styles.emailText, { color: theme.primary }]}>{email}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Tombol Dark Mode */}
          <TouchableOpacity onPress={toggleTheme} style={styles.themeBtn}>
            <Text style={{ fontSize: 20 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          
         <TouchableOpacity style={logoutBtnStyle} onPress={handleLogout}>
          <Text style={[styles.logoutText, { color: isDarkMode ? '#ff6b6b' : '#E74C3C' }]}>Logout</Text>
        </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.secondary} />
          <Text style={styles.loadingText}>Loading Pokédex...</Text>
        </View>
      ) : (
        <FlatList
          data={pokemons}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={renderPokemonItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
          
        
          onEndReached={fetchMorePokemons} // Fungsi yang dipanggil saat scroll ke bawah
          onEndReachedThreshold={0.5} // Trigger API saat scroll tersisa 50% dari bawah
          ListFooterComponent={renderFooter} // Tampilkan muter-muter di paling bawah
          
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
             colors={[theme.primary]}
            tintColor={theme.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F5F7' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15,
    borderBottomWidth: 1, borderBottomColor: '#E1E8ED', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4,
  },
  greeting: { fontSize: 14, color: '#7F8C8D', fontWeight: 'bold' },
  emailText: { fontSize: 16, color: '#2A75BB', fontWeight: '800' },
  logoutBtn: { backgroundColor: '#FDEDEC', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E74C3C' },
  logoutText: { color: '#E74C3C', fontWeight: 'bold', fontSize: 12 },
  listContainer: { padding: 20, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#2C3E50', fontWeight: '600' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 50 },
  emptyText: { fontSize: 16, color: '#7F8C8D', textAlign: 'center' },
  footerLoader: { paddingVertical: 20, alignItems: 'center' }, 
  themeBtn: { marginRight: 15, padding: 5 },
});