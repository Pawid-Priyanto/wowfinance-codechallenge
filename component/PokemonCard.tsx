import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const PokemonCard = ({ pokemon, onPress }: any) => {
  // PokeAPI list hanya mengembalikan 'name' dan 'url'.
  // Kita harus mengekstrak ID dari URL untuk mendapatkan gambar resminya.
  // Contoh URL: "https://pokeapi.co/api/v2/pokemon/1/" -> ID-nya adalah 1
  const pokemonId = pokemon.url.split('/')[6];
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  const {theme} = useTheme()

  return (
   <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]} 
      onPress={() => onPress(pokemon, pokemonId, imageUrl)}
      activeOpacity={0.7}
    >
      <View style={[styles.imageContainer, { backgroundColor: theme.background }]}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.idText, { color: theme.subText }]}>#{pokemonId.padStart(3, '0')}</Text>
        <Text style={[styles.nameText, { color: theme.text }]}>{pokemon.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Menggunakan React.memo untuk mencegah re-render yang tidak perlu pada FlatList
export default React.memo(PokemonCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#2A75BB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F2F5F7',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  image: {
    width: 65,
    height: 65,
  },
  infoContainer: {
    flex: 1,
  },
  idText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2C3E50',
    textTransform: 'capitalize',
  },
});