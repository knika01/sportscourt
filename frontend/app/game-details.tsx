import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import MapView from 'react-native-maps';

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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Game Details</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Sport */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sport</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>Basketball</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.black} />
          </View>
        </View>

        {/* Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time</Text>
          <View style={styles.timeContainer}>
            <View style={styles.timeInput}>
              <Text style={styles.timeText}>03/02/25, 3:00 PM</Text>
            </View>
            <Text style={styles.timeSeparator}>-</Text>
            <View style={styles.timeInput}>
              <Text style={styles.timeText}>03/02/25, 5:00 PM</Text>
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationInput}>
            <Text style={styles.locationText}>IM Courts 3</Text>
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
            <Text style={styles.dropdownText}>Intermediate</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.black} />
          </View>
        </View>

        {/* Player Count */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Player Count</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>4/6 players</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.black} />
          </View>
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
        <TouchableOpacity 
          style={styles.joinButton}
          onPress={handleJoinGame}
        >
          <Text style={styles.joinButtonText}>Join Game</Text>
          <Ionicons name="calendar" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
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
  timeSeparator: {
    fontSize: 20,
    color: COLORS.white,
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
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  joinButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
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
    backgroundColor: '#4285F4', // Google Blue
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