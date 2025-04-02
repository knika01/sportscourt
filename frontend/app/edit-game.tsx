import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
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

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function EditGameScreen() {
  const { id } = useLocalSearchParams();
  const gameId = Number(id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [sport, setSport] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');

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
      const game = await gameService.getGameById(gameId);
      setTitle(game.title);
      setSport(game.sport);
      const gameDate = new Date(game.date_time);
      setDate(gameDate);
      setTime(gameDate);
      setLocationName(game.location_name);
      setLatitude(game.latitude);
      setLongitude(game.longitude);
      setDescription(game.description || '');
      setSkillLevel(game.skill_level);
      setMaxPlayers(game.max_players.toString());
    } catch (error) {
      console.error('Error fetching game details:', error);
      Alert.alert('Error', 'Failed to load game details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !sport || !locationName || latitude === null || longitude === null || !skillLevel || !maxPlayers) {
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
        location_name: locationName,
        latitude,
        longitude,
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
            <Text style={[styles.inputValue, sport ? styles.selectedValue : styles.placeholderValue]}>
              {sport || 'Select Sport'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.inputLabel}>Date</Text>
            <Text style={styles.inputValue}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.inputLabel}>Time</Text>
            <Text style={styles.inputValue}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Location</Text>
            <GooglePlacesAutocomplete
              placeholder="Search for a location"
              fetchDetails
              onPress={(data, details = null) => {
                if (!details) return;
                setLocationName(data.description);
                setLatitude(details.geometry.location.lat);
                setLongitude(details.geometry.location.lng);
              }}
              query={{
                key: GOOGLE_MAPS_API_KEY,
                language: 'en',
              }}
              textInputProps={{
                value: locationName,
                onChangeText: setLocationName,
              }}
              styles={{
                textInput: {
                  height: 40,
                  color: COLORS.black,
                  fontSize: 16,
                  borderRadius: 8,
                  backgroundColor: COLORS.lightGray,
                  paddingHorizontal: 10,
                },
                container: {
                  flex: 0,
                },
              }}
              enablePoweredByContainer={false}
            />
          </View>

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

      {/* Modals omitted for brevity (unchanged) */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.primary,
  },
  backButton: { padding: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.white },
  content: { flex: 1 },
  formContainer: { padding: 20 },
  input: { marginBottom: 20 },
  inputLabel: { fontSize: 16, fontWeight: '500', color: COLORS.black, marginBottom: 8 },
  textInput: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: COLORS.black,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
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
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '500' },
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
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black, marginBottom: 16 },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalOptionText: { fontSize: 16, color: COLORS.black },
  selectedValue: { color: COLORS.black },
  placeholderValue: { color: COLORS.gray },
});
