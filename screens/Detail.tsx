import React, { useEffect, useState, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import PokemonCard from '../component/PokemonCard';
import { useTheme } from '../context/ThemeContext';

interface PokemonDetail {
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

export default function DetailScreen({ route, navigation }: any) {
  const { theme, isDarkMode } = useTheme();
  const { pokemonName, pokemonId } = route.params;

  const [details, setDetails] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync Header Color
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { 
        backgroundColor: theme.card, 
        elevation: 0, 
        shadowOpacity: 0 
      },
      headerTintColor: theme.text,
    });
  }, [navigation, theme]);

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

  const renderStatBar = (statName: string, baseStat: number) => {
    const percentage = Math.min((baseStat / 150) * 100, 100);
    
    return (
      <View style={styles.statRow} key={statName}>
        <Text style={[styles.statName, { color: theme.subText }]}>
          {statName.toUpperCase()}
        </Text>
        <Text style={[styles.statValue, { color: theme.text }]}>
          {baseStat}
        </Text>
        <View style={[styles.barBackground, { backgroundColor: isDarkMode ? '#333' : '#E1E8ED' }]}>
          <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: theme.primary }]} />
        </View>
      </View>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <PokemonCard 
          pokemon={{ 
            name: pokemonName, 
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}/` 
          }} 
          onPress={() => {}} 
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.subText }]}>Analyzing Pokémon...</Text>
          </View>
        ) : details ? (
          <View style={[styles.detailCard, { backgroundColor: theme.card, shadowColor: theme.primary }]}>
            
            {/* TYPES */}
            <View style={styles.typesContainer}>
              {details.types.map((t, index) => (
                <View key={index} style={[styles.typeBadge, { backgroundColor: theme.secondary }]}>
                  <Text style={styles.typeText}>{t.type.name}</Text>
                </View>
              ))}
            </View>

            {/* PHYSICAL INFO */}
            <View style={[styles.physicalContainer, { backgroundColor: isDarkMode ? '#252525' : '#F8F9FA' }]}>
              <View style={styles.physicalBox}>
                <Text style={[styles.physicalLabel, { color: theme.subText }]}>Weight</Text>
                <Text style={[styles.physicalValue, { color: theme.text }]}>{details.weight / 10} kg</Text>
              </View>
              <View style={[styles.physicalDivider, { backgroundColor: theme.border }]} />
              <View style={styles.physicalBox}>
                <Text style={[styles.physicalLabel, { color: theme.subText }]}>Height</Text>
                <Text style={[styles.physicalValue, { color: theme.text }]}>{details.height / 10} m</Text>
              </View>
            </View>

            {/* BASE STATS */}
            <Text style={[styles.sectionTitle, { color: theme.primary }]}>Base Stats</Text>
            <View style={styles.statsContainer}>
              {details.stats.map((s) => renderStatBar(s.stat.name, s.base_stat))}
            </View>

          </View>
        ) : (
          <Text style={[styles.errorText, { color: theme.accent }]}>Data tidak ditemukan.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  loadingContainer: { marginTop: 50, alignItems: 'center' },
  loadingText: { marginTop: 10, fontWeight: '600' },
  detailCard: {
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
    elevation: 8,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  typesContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 25, flexWrap: 'wrap' },
  typeBadge: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, marginHorizontal: 5 },
  typeText: { color: '#2C3E50', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 },
  physicalContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 30, borderRadius: 16, paddingVertical: 15 },
  physicalBox: { flex: 1, alignItems: 'center' },
  physicalDivider: { width: 2, height: 30 },
  physicalLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  physicalValue: { fontSize: 18, fontWeight: '900' },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 15 },
  statsContainer: { width: '100%' },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statName: { width: 70, fontSize: 11, fontWeight: '800' },
  statValue: { width: 35, fontSize: 13, fontWeight: 'bold', textAlign: 'right', marginRight: 10 },
  barBackground: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  errorText: { textAlign: 'center', marginTop: 20, fontWeight: 'bold' }
});