import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Animated
} from 'react-native';
import axios from 'axios';
import PokemonCard from '../component/PokemonCard';

// Interface untuk data detail dari API
interface PokemonDetail {
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

export default function DetailScreen({ route }: any) {
  // Menangkap parameter yang dikirim dari HomeScreen
  const { pokemonName, pokemonId, imageUrl } = route.params;

  const [details, setDetails] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        setDetails(response.data);
      } catch (error) {
        console.log('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [pokemonId]);

  // Fungsi untuk merender bar status dengan warna yang berbeda
  const renderStatBar = (statName: string, baseStat: number) => {
    // Menghitung persentase (asumsi max stat 150 agar bar tidak kepanjangan)
    const percentage = Math.min((baseStat / 150) * 100, 100);
    
    return (
      <View style={styles.statRow} key={statName}>
        <Text style={styles.statName}>{statName.toUpperCase()}</Text>
        <Text style={styles.statValue}>{baseStat}</Text>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${percentage}%` }]} />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        
        {/* --- IMPLEMENTASI DRY PRINCIPLE --- */}
        {/* Kita menggunakan ulang (reuse) PokemonCard yang sama persis dari HomeScreen */}
        <PokemonCard 
          // Kita harus merekonstruksi object pokemon agar bisa dibaca oleh PokemonCard
          pokemon={{ 
            name: pokemonName, 
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}/` 
          }} 
          onPress={() => {}} // Kosongkan fungsi klik agar kartu tidak bisa diklik lagi di halaman ini
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2A75BB" />
            <Text style={styles.loadingText}>Analyzing Pokémon...</Text>
          </View>
        ) : details ? (
          <View style={styles.detailCard}>
            
            {/* TIPE POKEMON (Bisa lebih dari 1) */}
            <View style={styles.typesContainer}>
              {details.types.map((t, index) => (
                <View key={index} style={styles.typeBadge}>
                  <Text style={styles.typeText}>{t.type.name}</Text>
                </View>
              ))}
            </View>

            {/* FISIK (Tinggi & Berat) */}
            {/* Catatan: API mengembalikan nilai dalam desimeter dan hektogram, kita bagi 10 agar jadi Meter dan Kg */}
            <View style={styles.physicalContainer}>
              <View style={styles.physicalBox}>
                <Text style={styles.physicalLabel}>Weight</Text>
                <Text style={styles.physicalValue}>{details.weight / 10} kg</Text>
              </View>
              <View style={styles.physicalDivider} />
              <View style={styles.physicalBox}>
                <Text style={styles.physicalLabel}>Height</Text>
                <Text style={styles.physicalValue}>{details.height / 10} m</Text>
              </View>
            </View>

            {/* BASE STATS */}
            <Text style={styles.sectionTitle}>Base Stats</Text>
            <View style={styles.statsContainer}>
              {details.stats.map((s) => 
                renderStatBar(s.stat.name, s.base_stat)
              )}
            </View>

          </View>
        ) : (
          <Text style={styles.errorText}>Data tidak ditemukan.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5F7',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
    elevation: 8,
    shadowColor: '#2A75BB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
    flexWrap: 'wrap',
  },
  typeBadge: {
    backgroundColor: '#FFCB05', // Pikachu Yellow
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  typeText: {
    color: '#2C3E50',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
  },
  physicalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingVertical: 15,
  },
  physicalBox: {
    flex: 1,
    alignItems: 'center',
  },
  physicalDivider: {
    width: 2,
    height: 30,
    backgroundColor: '#E1E8ED',
  },
  physicalLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  physicalValue: {
    fontSize: 18,
    color: '#2C3E50',
    fontWeight: '900',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2A75BB',
    marginBottom: 15,
  },
  statsContainer: {
    width: '100%',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statName: {
    width: 70,
    fontSize: 11,
    color: '#7F8C8D',
    fontWeight: '800',
  },
  statValue: {
    width: 35,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'right',
    marginRight: 10,
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E1E8ED',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#2A75BB', // Pokemon Blue
    borderRadius: 4,
  },
  errorText: {
    textAlign: 'center',
    color: '#E74C3C',
    marginTop: 20,
    fontWeight: 'bold',
  }
});