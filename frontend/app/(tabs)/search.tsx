import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const COLORS = {
  primary: '#4CA354',
  secondary: '#4B3DA3',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#5E5E5F',
  lightGray: '#D9D9D9',
  background: '#8BC485',
};

const SPORTS = ['All', 'Basketball', 'Tennis', 'Soccer', 'Volleyball'];
const BUILDINGS = ['All', 'Central Park', 'City Tennis Club', 'Sports Complex', 'Community Center'];

// Sample data - in a real app, this would come from your backend
const SAMPLE_GAMES = [
  {
    id: 1,
    title: 'Basketball at Central Park',
    sport: 'Basketball',
    building: 'Central Park',
    location: 'Central Park Basketball Court',
    time: 'Today, 3:00 PM - 5:00 PM',
    slots: 2,
  },
  {
    id: 2,
    title: 'Tennis Match',
    sport: 'Tennis',
    building: 'City Tennis Club',
    location: 'City Tennis Club',
    time: 'Tomorrow, 10:00 AM - 12:00 PM',
    slots: 1,
  },
  {
    id: 3,
    title: 'Soccer Game',
    sport: 'Soccer',
    building: 'Sports Complex',
    location: 'Sports Complex Field',
    time: 'Tomorrow, 2:00 PM - 4:00 PM',
    slots: 3,
  },
  {
    id: 4,
    title: 'Volleyball Tournament',
    sport: 'Volleyball',
    building: 'Community Center',
    location: 'Community Center Court',
    time: 'Saturday, 1:00 PM - 3:00 PM',
    slots: 4,
  },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedBuilding, setSelectedBuilding] = useState('All');
  const [selectedDistance, setSelectedDistance] = useState('5mi');

  const handleJoinGame = () => {
    Alert.alert(
      "Game Joined!",
      "You have successfully joined the game. You will be notified when the game starts.",
      [
        { text: "OK", onPress: () => router.push('/') }
      ]
    );
  };

  const clearFilters = () => {
    setSelectedSport('All');
    setSelectedBuilding('All');
    setSelectedDistance('5mi');
    setSearchQuery('');
  };

  // Filter games based on selected filters and search query
  const filteredGames = SAMPLE_GAMES.filter(game => {
    const matchesSport = selectedSport === 'All' || game.sport === selectedSport;
    const matchesBuilding = selectedBuilding === 'All' || game.building === selectedBuilding;
    const matchesSearch = searchQuery === '' || 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.building.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSport && matchesBuilding && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                  ]}>
                    {sport}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Building Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Building</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {BUILDINGS.map((building) => (
                <TouchableOpacity
                  key={building}
                  style={[
                    styles.filterChip,
                    selectedBuilding === building && styles.filterChipSelected
                  ]}
                  onPress={() => setSelectedBuilding(building)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedBuilding === building && styles.filterChipTextSelected
                  ]}>
                    {building}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Distance Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Distance</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['1mi', '5mi', '10mi', '25mi'].map((distance) => (
                <TouchableOpacity
                  key={distance}
                  style={[
                    styles.filterChip,
                    selectedDistance === distance && styles.filterChipSelected
                  ]}
                  onPress={() => setSelectedDistance(distance)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedDistance === distance && styles.filterChipTextSelected
                  ]}>
                    {distance}
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
          {filteredGames.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No games found matching your filters</Text>
            </View>
          ) : (
            filteredGames.map((game) => (
              <View key={game.id} style={styles.gameCard}>
                <View style={styles.gameHeader}>
                  <View>
                    <Text style={styles.gameTitle}>{game.title}</Text>
                    <View style={styles.availableSlots}>
                      <Text style={styles.slotsText}>{game.slots} slot{game.slots !== 1 ? 's' : ''} available</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.gameDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color={COLORS.gray} />
                    <Text style={styles.detailText}>{game.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color={COLORS.gray} />
                    <Text style={styles.detailText}>{game.time}</Text>
                  </View>
                </View>
                <View style={styles.gameActions}>
                  <TouchableOpacity 
                    style={styles.joinButton}
                    onPress={handleJoinGame}
                  >
                    <Text style={styles.joinButtonText}>Join Game</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.detailsButton}
                    onPress={() => router.push('/game-details')}
                  >
                    <Text style={styles.detailsButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    backgroundColor: COLORS.lightGray,
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
  },
  mainContainer: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 16,
  },
  filterSection: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 11,
    color: COLORS.gray,
    marginBottom: 2,
  },
  filterChip: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
    height: 24,
    justifyContent: 'center',
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.gray,
    fontSize: 11,
  },
  filterChipTextSelected: {
    color: COLORS.white,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 4,
    height: 24,
  },
  clearFiltersText: {
    color: COLORS.gray,
    fontSize: 11,
    marginLeft: 2,
  },
  resultsContainer: {
    paddingHorizontal: 16,
  },
  gameCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 12,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  availableSlots: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  slotsText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },
  gameDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: COLORS.gray,
    fontSize: 14,
  },
  gameActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  joinButtonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '500',
  },
  detailsButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  detailsButtonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '500',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
}); 