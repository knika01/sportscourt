// create-game.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { gameService } from '../services/gameService';
import { useAuth } from '@/context/AuthContext';

const COLORS = {
  primary: '#4CA354',
  secondary: '#4B3DA3',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#5E5E5F',
  lightGray: '#D9D9D9',
  background: '#8BC485',
};

const SPORTS = ['Tennis', 'Basketball', 'Volleyball', 'Badminton', 'Pickleball', 'Football', 'Soccer'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const PLAYER_COUNTS = Array.from({ length: 9 }, (_, i) => (i + 2).toString());

const LOCATIONS = [
  { name: 'Palmer Field', latitude: 42.2808, longitude: -83.7323},
  { name: 'Mitchell Field', latitude: 42.2859, longitude: -83.7225},
  { name: 'Fuller Park', latitude: 42.2881, longitude: -83.7289},
  { name: 'North Campus Recreation Building', latitude: 42.2961, longitude: -83.7189},
  { name: 'Intramural Sports Building', latitude: 42.2961, longitude: -83.7418},
  { name: 'Hadley Center', latitude: 42.2782, longitude: -83.7327},
  { name: 'Sports Coliseum', latitude: 42.27228, longitude: -83.74596},
  { name: 'Hubbard Road Rec Fields', latitude: 42.2946, longitude: -83.7227},
  { name: 'Baits Tennis Courts', latitude: 42.2931, longitude: -83.72409},
];

export default function CreateGameScreen() {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [sport, setSport] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [description, setDescription] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [playerCount, setPlayerCount] = useState('');
  type Location = {
    name: string;
    latitude: number;
    longitude: number;
  };
  
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  const [showSportModal, setShowSportModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showSkillLevelModal, setShowSkillLevelModal] = useState(false);
  const [showPlayerCountModal, setShowPlayerCountModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    if (!title || !sport || !selectedLocation || !skillLevel || !playerCount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to create a game');
      return;
    }

    try {
      setIsLoading(true);
      const dateTime = new Date(date);
      dateTime.setHours(startTime.getHours());
      dateTime.setMinutes(startTime.getMinutes());

      const gameData = {
        title,
        sport,
        location: selectedLocation.name,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        date_time: dateTime.toISOString(),
        description: description.trim() || null,
        skill_level: skillLevel,
        max_players: parseInt(playerCount),
        created_by: user.id,
      };

      await gameService.createGame(gameData);

      Alert.alert('Success', 'Game created successfully!', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch (error) {
      console.error('Error creating game:', error);
      Alert.alert('Error', 'Failed to create game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Game</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          {/* Title */}
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter game title"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          {/* Sport */}
          <TouchableOpacity style={styles.input} onPress={() => setShowSportModal(true)}>
            <Text style={styles.inputLabel}>Sport</Text>
            <Text style={styles.inputValue}>{sport || 'Select Sport'}</Text>
          </TouchableOpacity>

          {/* Date */}
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.inputLabel}>Date</Text>
            <Text style={styles.inputValue}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {/* Start & End Time */}
          <View style={styles.timeContainer}>
            <TouchableOpacity style={[styles.input, styles.timeInput]} onPress={() => setShowStartTimePicker(true)}>
              <Text style={styles.inputLabel}>Start Time</Text>
              <Text style={styles.inputValue}>
                {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.input, styles.timeInput]} onPress={() => setShowEndTimePicker(true)}>
              <Text style={styles.inputLabel}>End Time</Text>
              <Text style={styles.inputValue}>
                {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Location Dropdown */}
          <TouchableOpacity style={styles.input} onPress={() => setShowLocationModal(true)}>
            <Text style={styles.inputLabel}>Location</Text>
            <Text style={styles.inputValue}>{selectedLocation?.name || 'Select Location'}</Text>
          </TouchableOpacity>

          {/* Description */}
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter game description"
              placeholderTextColor={COLORS.gray}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Skill Level */}
          <TouchableOpacity style={styles.input} onPress={() => setShowSkillLevelModal(true)}>
            <Text style={styles.inputLabel}>Skill Level</Text>
            <Text style={styles.inputValue}>{skillLevel || 'Select Skill Level'}</Text>
          </TouchableOpacity>

          {/* Player Count */}
          <TouchableOpacity style={styles.input} onPress={() => setShowPlayerCountModal(true)}>
            <Text style={styles.inputLabel}>Player Count</Text>
            <Text style={styles.inputValue}>{playerCount || 'Select Player Count'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Post Button */}
      <TouchableOpacity style={[styles.postButton, isLoading && styles.postButtonDisabled]} onPress={handlePost} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.postButtonText}>Post</Text>}
      </TouchableOpacity>

      {/* Modals */}
      {showSportModal && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Sport</Text>
            {SPORTS.map((s) => (
              <TouchableOpacity key={s} style={styles.modalItem} onPress={() => { setSport(s); setShowSportModal(false); }}>
                <Text style={styles.modalItemText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {showLocationModal && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Location</Text>
            {LOCATIONS.map((loc) => (
              <TouchableOpacity key={loc.name} style={styles.modalItem} onPress={() => { setSelectedLocation(loc); setShowLocationModal(false); }}>
                <Text style={styles.modalItemText}>{loc.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={(e, d) => { setShowDatePicker(false); if (d) setDate(d); }} />}
      {showStartTimePicker && <DateTimePicker value={startTime} mode="time" display="default" onChange={(e, t) => { setShowStartTimePicker(false); if (t) setStartTime(t); }} />}
      {showEndTimePicker && <DateTimePicker value={endTime} mode="time" display="default" onChange={(e, t) => { setShowEndTimePicker(false); if (t) setEndTime(t); }} />}
      {showSkillLevelModal && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Skill Level</Text>
            {SKILL_LEVELS.map((level) => (
              <TouchableOpacity key={level} style={styles.modalItem} onPress={() => { setSkillLevel(level); setShowSkillLevelModal(false); }}>
                <Text style={styles.modalItemText}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {showPlayerCountModal && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Player Count</Text>
            {PLAYER_COUNTS.map((count) => (
              <TouchableOpacity key={count} style={styles.modalItem} onPress={() => { setPlayerCount(count); setShowPlayerCountModal(false); }}>
                <Text style={styles.modalItemText}>{count} players</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    backgroundColor: COLORS.background,
    minHeight: '100%',
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  inputValue: {
    fontSize: 16,
    color: COLORS.black,
  },
  textInput: {
    fontSize: 16,
    color: COLORS.black,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  postButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.black,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.black,
  },
  postButtonDisabled: {
    opacity: 0.7,
  },
}); 