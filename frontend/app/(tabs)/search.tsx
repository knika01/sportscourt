import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { gameService } from '@/services/gameService';
import { Game } from '@/types/game';

const COLORS = {
  primary: '#4CA354',
  secondary: '#4B3DA3',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#5E5E5F',
  lightGray: '#D9D9D9',
  background: '#8BC485',
};

const SPORTS = ['Basketball', 'Tennis', 'Soccer', 'Volleyball', 'Badminton', 'Pickleball', 'Football'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const LOCATIONS = [
  { name: 'Palmer Field', latitude: 42.2808, longitude: -83.7430 },
  { name: 'Mitchell Field', latitude: 42.2800, longitude: -83.7400 },
  { name: 'Fuller Park', latitude: 42.2790, longitude: -83.7420 },
  { name: 'North Campus Recreation Building', latitude: 42.2810, longitude: -83.7410 },
  { name: 'Intramural Sports Building', latitude: 42.2820, longitude: -83.7400 },
  { name: 'Hadley Center', latitude: 42.2830, longitude: -83.7390 },
  { name: 'Sports Coliseum', latitude: 42.2840, longitude: -83.7380 },
  { name: 'Hubbard Road Rec Fields', latitude: 42.2850, longitude: -83.7370 },
  { name: 'Baits Tennis Courts', latitude: 42.2860, longitude: -83.7360 }
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const games = await gameService.searchGames();
      setGames(games);
      setError(null);
    } catch (error) {
      console.error('Error fetching games:', error);
      setError('Failed to fetch games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchGames();
    }, [])
  );

  const clearFilters = () => {
    setSelectedSport(null);
    setSelectedSkillLevel(null);
    setSelectedLocation(null);
    setSearchQuery('');
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = !selectedSport || game.sport === selectedSport;
    const matchesSkillLevel = !selectedSkillLevel || game.skill_level === selectedSkillLevel;
    const matchesLocation = !selectedLocation || game.location === selectedLocation;
    
    return matchesSearch && matchesSport && matchesSkillLevel && matchesLocation;
  });

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleString();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search games..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContainer}>
        {/* Filters */}
        <View style={styles.filtersContainer}>
          {/* Sport Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Sport</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
            >
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  !selectedSport && styles.filterChipSelected
                ]}
                onPress={() => setSelectedSport(null)}
              >
                <Text style={[
                  styles.filterChipText,
                  !selectedSport && styles.filterChipTextSelected
                ]}>All</Text>
              </TouchableOpacity>
              {SPORTS.map((sport) => (
                <TouchableOpacity
                  key={sport}
                  style={[
                    styles.filterChip,
                    selectedSport === sport && styles.filterChipSelected
                  ]}
                  onPress={() => setSelectedSport(sport)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedSport === sport && styles.filterChipTextSelected
                  ]}>{sport}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Skill Level Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Skill Level</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {SKILL_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.filterChip,
                    selectedSkillLevel === level && styles.filterChipSelected
                  ]}
                  onPress={() => setSelectedSkillLevel(level)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedSkillLevel === level && styles.filterChipTextSelected
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Location Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Location</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  !selectedLocation && styles.filterChipSelected
                ]}
                onPress={() => setSelectedLocation(null)}
              >
                <Text style={[
                  styles.filterChipText,
                  !selectedLocation && styles.filterChipTextSelected
                ]}>All</Text>
              </TouchableOpacity>
              {LOCATIONS.map((location) => (
                <TouchableOpacity
                  key={location.name}
                  style={[
                    styles.filterChip,
                    selectedLocation === location.name && styles.filterChipSelected
                  ]}
                  onPress={() => setSelectedLocation(location.name)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedLocation === location.name && styles.filterChipTextSelected
                  ]}>
                    {location.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Clear Filters Button */}
          <TouchableOpacity 
            style={styles.clearFiltersButton}
            onPress={clearFilters}
          >
            <Ionicons name="close-circle" size={20} color={COLORS.gray} />
            <Text style={styles.clearFiltersText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Search Results */}
        <View style={styles.resultsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : filteredGames.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No games found matching your filters</Text>
            </View>
          ) : (
            filteredGames.map((game) => (
              <TouchableOpacity 
                key={game.id} 
                style={styles.gameCard}
                onPress={() => router.push(`/game-details?id=${game.id}`)}
              >
                <View style={styles.gameHeader}>
                  <View>
                    <Text style={styles.gameTitle}>{game.title}</Text>
                    <View style={styles.availableSlots}>
                      <Text style={styles.slotsText}>Skill Level: {game.skill_level}</Text>
                    </View>
                  </View>
                </View>
                {game.description && (
                  <Text style={styles.gameDescription} numberOfLines={2}>
                    {game.description}
                  </Text>
                )}
                <View style={styles.gameDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color={COLORS.gray} />
                    <Text style={styles.detailText}>{game.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color={COLORS.gray} />
                    <Text style={styles.detailText}>{formatDateTime(game.date_time)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="football-outline" size={16} color={COLORS.gray} />
                    <Text style={styles.detailText}>{game.sport}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="people-outline" size={16} color={COLORS.gray} />
                    <Text style={styles.detailText}>Max Players: {game.max_players}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: COLORS.black,
  },
  mainContainer: {
    flex: 1,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.black,
    fontSize: 14,
  },
  filterChipTextSelected: {
    color: COLORS.white,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  clearFiltersText: {
    color: COLORS.gray,
    marginLeft: 4,
  },
  resultsContainer: {
    padding: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.gray,
    fontSize: 16,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: COLORS.gray,
    fontSize: 16,
  },
  gameCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameHeader: {
    marginBottom: 8,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  availableSlots: {
    marginTop: 4,
  },
  slotsText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  gameDescription: {
    color: COLORS.gray,
    fontSize: 14,
    marginBottom: 8,
  },
  gameDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    color: COLORS.gray,
    fontSize: 14,
  },
}); 