import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { gameService } from '../services/gameService';
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

// Constants for dropdowns
const SPORTS = ['Tennis', 'Basketball', 'Volleyball', 'Badminton', 'Pickleball', 'Football', 'Soccer'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const PLAYER_COUNTS = Array.from({ length: 9 }, (_, i) => (i + 2).toString());

export default function EditGameScreen() {
  const { id } = useLocalSearchParams();
  const gameId = Number(id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');

  // Modal states
  const [showSportModal, setShowSportModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showSkillLevelModal, setShowSkillLevelModal] = useState(false);
  const [showPlayerCountModal, setShowPlayerCountModal] = useState(false);

  useEffect(() => {
    fetchGameDetails();
  }, [gameId]);

  const fetchGameDetails = async () => {
    try {
      setLoading(true);
      const response = await gameService.getGameById(gameId);
      if (response.status === 'success') {
        const game = response.data as Game;
        console.log('Game data received:', game);
        console.log('Sport value:', game.sport);
        setTitle(game.title);
        setSport(game.sport);
        const gameDate = new Date(game.date_time);
        setDate(gameDate);
        setTime(gameDate);
        setLocation(game.location);
        setDescription(game.description || '');
        setSkillLevel(game.skill_level);
        setMaxPlayers(game.max_players.toString());
      } else {
        Alert.alert('Error', 'Failed to load game details');
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
      Alert.alert('Error', 'Failed to load game details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !sport || !location || !skillLevel || !maxPlayers) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      const dateTime = new Date(date);
      dateTime.setHours(time.getHours());
      dateTime.setMinutes(time.getMinutes());

      const gameData = {
        title,
        sport,
        date_time: dateTime.toISOString(),
        location,
        description,
        skill_level: skillLevel,
        max_players: parseInt(maxPlayers),
      };

      const response = await gameService.updateGame(gameId, gameData);
      if (response.status === 'success') {
        Alert.alert(
          'Success',
          'Game updated successfully',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Error', 'Failed to update game');
      }
    } catch (error) {
      console.error('Error updating game:', error);
      Alert.alert('Error', 'Failed to update game');
    } finally {
      setSaving(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Game</Text>
        <View style={{ width: 40 }} /> {/* Empty view for spacing */}
      </View>

      {/* Form */}
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

          {/* Sport Selection */}
          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowSportModal(true)}
          >
            <Text style={styles.inputLabel}>Sport</Text>
            <Text style={[styles.inputValue, sport ? styles.selectedValue : styles.placeholderValue]}>
              {sport || 'Select Sport'}
            </Text>
          </TouchableOpacity>

          {/* Date Selection */}
          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputLabel}>Date</Text>
            <Text style={styles.inputValue}>
              {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {/* Time Selection */}
          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.inputLabel}>Time</Text>
            <Text style={styles.inputValue}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>

          {/* Location */}
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.textInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
              placeholderTextColor={COLORS.gray}
            />
          </View>

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
          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowSkillLevelModal(true)}
          >
            <Text style={styles.inputLabel}>Skill Level</Text>
            <Text style={styles.inputValue}>{skillLevel || 'Select Skill Level'}</Text>
          </TouchableOpacity>

          {/* Max Players */}
          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowPlayerCountModal(true)}
          >
            <Text style={styles.inputLabel}>Max Players</Text>
            <Text style={styles.inputValue}>{maxPlayers || 'Select Max Players'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity 
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      {/* Sport Selection Modal */}
      {showSportModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Sport</Text>
            {SPORTS.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.modalOption}
                onPress={() => {
                  setSport(s);
                  setShowSportModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
          minimumDate={new Date()}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              setTime(selectedTime);
            }
          }}
        />
      )}

      {/* Skill Level Modal */}
      {showSkillLevelModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Skill Level</Text>
            {SKILL_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                style={styles.modalOption}
                onPress={() => {
                  setSkillLevel(level);
                  setShowSkillLevelModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Player Count Modal */}
      {showPlayerCountModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Max Players</Text>
            {PLAYER_COUNTS.map((count) => (
              <TouchableOpacity
                key={count}
                style={styles.modalOption}
                onPress={() => {
                  setMaxPlayers(count);
                  setShowPlayerCountModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{count} players</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  input: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: COLORS.black,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputValue: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: COLORS.black,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
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
    color: COLORS.black,
    marginBottom: 16,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.black,
  },
  selectedValue: {
    color: COLORS.black,
  },
  placeholderValue: {
    color: COLORS.gray,
  },
}); 