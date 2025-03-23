import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

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
  const handleJoinGame = () => {
    Alert.alert(
      "Game Joined!",
      "You have successfully joined the game. You will be notified when the game starts.",
      [
        { text: "OK", onPress: () => router.push('/') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.name}>First Last</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* My Games Section */}
        <Text style={styles.sectionTitle}>My Games</Text>
        
        {/* Game Card 1 - Personal Game */}
        <View style={styles.gameCard}>
          <View style={styles.gameHeader}>
            <View>
              <Text style={styles.gameTitle}>Basketball at Central Park</Text>
              <View style={styles.availableSlots}>
                <Text style={styles.slotsText}>You're in!</Text>
              </View>
            </View>
          </View>
          <View style={styles.gameDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color={COLORS.gray} />
              <Text style={styles.detailText}>Central Park Basketball Court</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color={COLORS.gray} />
              <Text style={styles.detailText}>Today, 3:00 PM - 5:00 PM</Text>
            </View>
          </View>
          <View style={styles.gameActions}>
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => router.push('/game-details')}
            >
              <Text style={styles.detailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommended Games Section */}
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        
        {/* Game Card 2 - Recommended Game */}
        <View style={styles.gameCard}>
          <View style={styles.gameHeader}>
            <View>
              <Text style={styles.gameTitle}>Tennis Match</Text>
              <View style={styles.availableSlots}>
                <Text style={styles.slotsText}>1 slot available</Text>
              </View>
            </View>
          </View>
          <View style={styles.gameDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color={COLORS.gray} />
              <Text style={styles.detailText}>City Tennis Club</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color={COLORS.gray} />
              <Text style={styles.detailText}>Tomorrow, 10:00 AM - 12:00 PM</Text>
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  createGameText: {
    color: COLORS.white,
    marginLeft: 8,
    fontWeight: '500',
  },
});
