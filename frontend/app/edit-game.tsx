import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { gameService } from '../services/gameService';
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

export default function EditGameScreen() {
  const { id } = useLocalSearchParams();
  const gameId = Number(id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [sport, setSport] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [description, setDescription] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
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

  useEffect(() => {
    fetchGameDetails();
  }, [gameId]);

  const fetchGameDetails = async () => {
    try {
      setLoading(true);
      const game = await gameService.getGameById(gameId);
      setTitle(game.title);
      setSport(game.sport);
      const gameDate = new Date(game.date_time);
      setDate(gameDate);
      setStartTime(gameDate);
      // Set end time to 1 hour after start time by default
      const endDate = new Date(gameDate);
      endDate.setHours(endDate.getHours() + 1);
      setEndTime(endDate);
      setDescription(game.description || '');
      setSkillLevel(game.skill_level);
      setMaxPlayers(game.max_players.toString());
      
      // Find and set the selected location
      const location = LOCATIONS.find(loc => loc.name === game.location);
      if (location) {
        setSelectedLocation(location);
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
      Alert.alert('Error', 'Failed to load game details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !sport || !selectedLocation || !skillLevel || !maxPlayers) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      const dateTime = new Date(date);
      dateTime.setHours(startTime.getHours());
      dateTime.setMinutes(startTime.getMinutes());

      const gameData = {
        title,
        sport,
        date_time: dateTime.toISOString(),
        location: selectedLocation.name,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        description,
        skill_level: skillLevel,
        max_players: parseInt(maxPlayers),
      };

      await gameService.updateGame(gameId, gameData);
      Alert.alert('Success', 'Game updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Game</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
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

          <TouchableOpacity style={styles.input} onPress={() => setShowSportModal(true)}>
            <Text style={styles.inputLabel}>Sport</Text>
            <Text style={styles.inputValue}>{sport || 'Select Sport'}</Text>
          </TouchableOpacity>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.inputValue}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="inline"
                  onChange={(e, d) => {
                    if (d) setDate(d);
                  }}
                  style={styles.datePicker}
                />
                <TouchableOpacity 
                  style={styles.calendarDoneButton} 
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.calendarDoneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View>
            <View style={styles.timeContainer}>
              <View style={[styles.input, styles.timeInput]}>
                <Text style={styles.inputLabel}>Start Time</Text>
                <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
                  <Text style={styles.inputValue}>
                    {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.input, styles.timeInput]}>
                <Text style={styles.inputLabel}>End Time</Text>
                <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
                  <Text style={styles.inputValue}>
                    {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {(showStartTimePicker || showEndTimePicker) && (
              <View style={styles.timePickerContainer}>
                <DateTimePicker
                  value={showStartTimePicker ? startTime : endTime}
                  mode="time"
                  display="spinner"
                  onChange={(e, t) => {
                    if (t) {
                      if (showStartTimePicker) {
                        setStartTime(t);
                      } else {
                        setEndTime(t);
                      }
                    }
                  }}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={() => {
                      if (showStartTimePicker) {
                        setShowStartTimePicker(false);
                      } else {
                        setShowEndTimePicker(false);
                      }
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.button, styles.doneButton]} 
                    onPress={() => {
                      if (showStartTimePicker) {
                        setShowStartTimePicker(false);
                      } else {
                        setShowEndTimePicker(false);
                      }
                    }}
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.input} onPress={() => setShowLocationModal(true)}>
            <Text style={styles.inputLabel}>Location</Text>
            <Text style={styles.inputValue}>{selectedLocation?.name || 'Select Location'}</Text>
          </TouchableOpacity>

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

          <TouchableOpacity style={styles.input} onPress={() => setShowSkillLevelModal(true)}>
            <Text style={styles.inputLabel}>Skill Level</Text>
            <Text style={styles.inputValue}>{skillLevel || 'Select Skill Level'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.input} onPress={() => setShowPlayerCountModal(true)}>
            <Text style={styles.inputLabel}>Max Players</Text>
            <Text style={styles.inputValue}>{maxPlayers || 'Select Max Players'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
      </TouchableOpacity>

      {/* Modals */}
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

      {showLocationModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Location</Text>
            {LOCATIONS.map((loc) => (
              <TouchableOpacity
                key={loc.name}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedLocation(loc);
                  setShowLocationModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{loc.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

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
    padding: 12,
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
  datePickerContainer: {
    marginTop: 10,
    marginHorizontal: -8,
  },
  datePicker: {
    width: '100%',
    height: 300,
  },
  calendarDoneButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
  calendarDoneButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
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
  timePickerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    marginTop: -8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  doneButton: {
    backgroundColor: COLORS.primary,
  },
  doneButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
  },
  cancelButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '500',
  },
}); 