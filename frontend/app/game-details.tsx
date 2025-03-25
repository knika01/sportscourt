import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import MapView from 'react-native-maps';
import { GameParticipationButton } from '../components/GameParticipationButton';
import { gameService } from '@/services/gameService';
import { Game } from '@/types/game';
import { gameParticipantService } from '@/services/gameParticipantService';
import { GameParticipant } from '@/types/gameParticipant';

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
  const { id, isHost } = useLocalSearchParams();
  const gameId = Number(id);
  const isHostView = isHost === 'true';
  // TODO: Get actual user ID from auth context
  const userId = 1; // Temporary hardcoded user ID
  const [game, setGame] = useState<Game | null>(null);
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchParticipants = async () => {
    try {
      const response = await gameParticipantService.getGameParticipants(gameId);
      if (response.status === 'success') {
        setParticipants(response.data as GameParticipant[]);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchGameDetails();
    if (isHostView) {
      fetchParticipants();
    }
  }, [gameId]);

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchGameDetails();
      if (isHostView) {
        fetchParticipants();
      }
    }, [gameId, isHostView])
  );

  const handleParticipantChange = () => {
    fetchGameDetails(); // Refresh game details when participation changes
  };

  const handleDeleteGame = async () => {
    try {
      await gameService.deleteGame(gameId);
      Alert.alert(
        "Game Deleted",
        "You have successfully deleted the game.",
        [{ text: "OK", onPress: () => router.replace('/') }]
      );
    } catch (error) {
      console.error('Error deleting game:', error);
      Alert.alert('Error', 'Failed to delete the game');
    }
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

        {/* Sport */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sport</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>{game.sport}</Text>
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

        {/* Participants Section (Host View Only) */}
        {isHostView && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Participants</Text>
            <View style={styles.participantsContainer}>
              {participants.length === 0 ? (
                <Text style={styles.noParticipantsText}>No participants yet</Text>
              ) : (
                participants.map((participant) => (
                  <View key={participant.id} style={styles.participantRow}>
                    <Ionicons name="person-circle-outline" size={24} color={COLORS.gray} />
                    <Text style={styles.participantName}>User {participant.user_id}</Text>
                  </View>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <View style={styles.topButtons}>
          {isHostView ? (
            <>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => router.push(`/edit-game?id=${gameId}`)}
              >
                <Text style={styles.editButtonText}>Edit Details</Text>
                <Ionicons name="pencil-outline" size={20} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDeleteGame}
              >
                <Text style={styles.deleteButtonText}>Delete Game</Text>
                <Ionicons name="trash-outline" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.messageButton}>
                <Text style={styles.messageButtonText}>Message Host</Text>
                <Ionicons name="chatbubble" size={20} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.calendarButton}>
                <Text style={styles.calendarButtonText}>Add to GCal</Text>
                <Ionicons name="logo-google" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </>
          )}
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
  deleteButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  participantsContainer: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  participantName: {
    fontSize: 16,
    color: COLORS.black,
    marginLeft: 8,
  },
  noParticipantsText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    paddingVertical: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
}); 