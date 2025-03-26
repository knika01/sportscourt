import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { gameService } from '@/services/gameService';
import { userService } from '@/services/userService';
import { Game } from '@/types/game';
import { gameParticipantService } from '@/services/gameParticipantService';
import { useAuth } from '@/context/AuthContext';

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

export default function HomeScreen() {
  const [myGames, setMyGames] = useState<Game[]>([]);
  const [hostedGames, setHostedGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const { user } = useAuth();

  const fetchUserData = async () => {
    if (!user?.id) return;
    try {
      const response = await userService.getUserById(user.id);
      if (response.status === 'success' && response.data) {
        setUserName(response.data.first_name);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchMyGames = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const response = await gameService.getUserJoinedGames(user.id);
      setMyGames(response || []);
    } catch (error) {
      console.error('Error fetching user games:', error);
      Alert.alert('Error', 'Failed to load your games');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHostedGames = async () => {
    if (!user?.id) return;
    try {
      const response = await gameService.getUserHostedGames(user.id);
      setHostedGames(response || []);
    } catch (error) {
      console.error('Error fetching hosted games:', error);
      Alert.alert('Error', 'Failed to load your hosted games');
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
      fetchMyGames();
      fetchHostedGames();
      fetchUserData();
    }
  }, [user]);

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) {
        fetchMyGames();
        fetchHostedGames();
        fetchUserData();
      }
    }, [user])
  );

  const handleLeaveGame = async (gameId: number) => {
    if (!user?.id) return;
    try {
      await gameParticipantService.leaveGame(gameId, user.id);
      Alert.alert(
        "Game Left",
        "You have successfully left the game.",
        [{ text: "OK", onPress: fetchMyGames }]
      );
    } catch (error) {
      console.error('Error leaving game:', error);
      Alert.alert('Error', 'Failed to leave the game');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.name}>{userName || 'User'}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* My Games Section */}
        <Text style={styles.sectionTitle}>My Games</Text>
        
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : myGames.length === 0 ? (
          <View style={styles.noGamesContainer}>
            <Text style={styles.noGamesText}>You haven't joined any games yet</Text>
            <TouchableOpacity 
              style={styles.findGamesButton}
              onPress={() => router.push('/search')}
            >
              <Text style={styles.findGamesButtonText}>Find games now!</Text>
            </TouchableOpacity>
          </View>
        ) : (
          myGames.map((game) => (
            <View key={game.id} style={styles.gameCard}>
              <View style={styles.gameHeader}>
                <View>
                  <Text style={styles.gameTitle}>{game.title}</Text>
                  <View style={styles.availableSlots}>
                    <Text style={styles.slotsText}>You're in!</Text>
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
                  <Text style={styles.detailText}>
                    {formatDate(game.date_time)}, {formatTime(game.date_time)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="football-outline" size={16} color={COLORS.gray} />
                  <Text style={styles.detailText}>{game.sport}</Text>
                </View>
                {game.description && (
                  <View style={styles.detailRow}>
                    <Ionicons name="information-circle-outline" size={16} color={COLORS.gray} />
                    <Text style={styles.detailText}>{game.description}</Text>
                  </View>
                )}
              </View>
              <View style={styles.gameActions}>
                <TouchableOpacity 
                  style={styles.leaveButton}
                  onPress={() => handleLeaveGame(game.id)}
                >
                  <Text style={styles.leaveButtonText}>Leave Game</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.detailsButton, { marginRight: 0 }]}
                  onPress={() => router.push(`/game-details?id=${game.id}`)}
                >
                  <Text style={styles.detailsButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Hosted Games Section */}
        <Text style={styles.sectionTitle}>Games You Host</Text>
        
        {hostedGames.length === 0 ? (
          <Text style={styles.noGamesText}>You haven't hosted any games yet</Text>
        ) : (
          hostedGames.map((game) => (
            <View key={game.id} style={styles.gameCard}>
              <View style={styles.gameHeader}>
                <View>
                  <Text style={styles.gameTitle}>{game.title}</Text>
                  <View style={styles.availableSlots}>
                    <Text style={styles.slotsText}>You're hosting!</Text>
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
                  <Text style={styles.detailText}>
                    {formatDate(game.date_time)}, {formatTime(game.date_time)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="football-outline" size={16} color={COLORS.gray} />
                  <Text style={styles.detailText}>{game.sport}</Text>
                </View>
                {game.description && (
                  <View style={styles.detailRow}>
                    <Ionicons name="information-circle-outline" size={16} color={COLORS.gray} />
                    <Text style={styles.detailText}>{game.description}</Text>
                  </View>
                )}
              </View>
              <View style={styles.gameActions}>
                <TouchableOpacity 
                  style={[styles.detailsButton, { marginRight: 0 }]}
                  onPress={() => router.push(`/game-details?id=${game.id}&isHost=true`)}
                >
                  <Text style={styles.detailsButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Create Game Button */}
      <TouchableOpacity 
        style={styles.createGameButton}
        onPress={() => router.push('/create-game')}
      >
        <Ionicons name="add" size={24} color={COLORS.white} />
        <Text style={styles.createGameText}>Create a Game</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.primary,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.black,
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
  createGameButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 30,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createGameText: {
    color: COLORS.white,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  noGamesContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noGamesText: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 16,
    textAlign: 'center',
  },
  findGamesButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  findGamesButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  leaveButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  leaveButtonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  deleteButtonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '500',
  },
});
