import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import MapView from 'react-native-maps';
import { GameParticipationButton } from '../components/GameParticipationButton';
import { gameService } from '@/services/gameService';
import { Game } from '@/types/game';

// Colors from Figma
const COLORS = {
  primary: '#4CA354', // Green color
  secondary: '#4B3DA3', // Blue color
  white: '#FFFFFF',
  black: '#000000',
  gray: '#5E5E5F',
  lightGray: '#D9D9D9',
  background: '#8BC485', // Light green background
};

export default function GameDetailsScreen() {
  const { id } = useLocalSearchParams();
  const gameId = Number(id);
  // TODO: Get actual user ID from auth context
  const userId = 1; // Temporary hardcoded user ID
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGameDetails();
  }, [gameId]);

  const fetchGameDetails = async () => {
    try {
      setLoading(true);
      const response = await gameService.getGameById(gameId);
      if (response.status === 'success') {
        console.log('Game data received:', response.data);
        setGame(response.data as Game);
      } else {
        setError('Failed to load game details');
      }
    } catch (err) {
      setError('Failed to load game details');
      console.error('Error fetching game details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipantChange = () => {
    fetchGameDetails(); // Refresh game details when participation changes
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !game) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Game not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Game Details</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Title</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>{game.title}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              {game.description !== null ? game.description : 'No description provided'}
            </Text>
          </View>
        </View>

        {/* Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time</Text>
          <View style={styles.timeContainer}>
            <View style={styles.timeInput}>
              <Text style={styles.timeText}>
                {new Date(game.date_time).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationInput}>
            <Text style={styles.locationText}>{game.location}</Text>
          </View>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
          </View>
        </View>

        {/* Skill Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skill Level</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>{game.skill_level}</Text>
          </View>
        </View>

        {/* Player Count */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Player Count</Text>
          <GameParticipationButton
            gameId={gameId}
            userId={userId}
            maxPlayers={game.max_players}
            onParticipantChange={handleParticipantChange}
          />
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <View style={styles.topButtons}>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.messageButtonText}>Message Host</Text>
            <Ionicons name="chatbubble" size={20} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.calendarButton}>
            <Text style={styles.calendarButtonText}>Add to GCal</Text>
            <Ionicons name="logo-google" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.gray,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.black,
  },
  descriptionContainer: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.black,
    lineHeight: 24,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeInput: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  timeText: {
    fontSize: 16,
    color: COLORS.black,
  },
  locationInput: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.black,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
    color: COLORS.black,
  },
  mapContainer: {
    height: 159,
    borderRadius: 7,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  map: {
    flex: 1,
  },
  bottomButtons: {
    padding: 20,
    gap: 12,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  messageButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  calendarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  calendarButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
}); 