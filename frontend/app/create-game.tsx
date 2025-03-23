import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

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

export default function CreateGameScreen() {
  // Form state
  const [sport, setSport] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [playerCount, setPlayerCount] = useState('');

  // Modal states
  const [showSportModal, setShowSportModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showSkillLevelModal, setShowSkillLevelModal] = useState(false);
  const [showPlayerCountModal, setShowPlayerCountModal] = useState(false);

  const handlePost = () => {
    // TODO: Implement game creation logic
    console.log('Creating game:', {
      sport,
      date,
      startTime,
      endTime,
      location,
      description,
      skillLevel,
      playerCount,
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Game</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          {/* Sport Selection */}
          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowSportModal(true)}
          >
            <Text style={styles.inputLabel}>Sport</Text>
            <Text style={styles.inputValue}>{sport || 'Select Sport'}</Text>
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
          <View style={styles.timeContainer}>
            <TouchableOpacity 
              style={[styles.input, styles.timeInput]}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={styles.inputLabel}>Start Time</Text>
              <Text style={styles.inputValue}>
                {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.input, styles.timeInput]}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={styles.inputLabel}>End Time</Text>
              <Text style={styles.inputValue}>
                {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>

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

          {/* Player Count */}
          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowPlayerCountModal(true)}
          >
            <Text style={styles.inputLabel}>Player Count</Text>
            <Text style={styles.inputValue}>{playerCount || 'Select Player Count'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Post Button */}
      <TouchableOpacity 
        style={styles.postButton}
        onPress={handlePost}
      >
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>

      {/* Modals */}
      {showSportModal && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Sport</Text>
            {SPORTS.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.modalItem}
                onPress={() => {
                  setSport(s);
                  setShowSportModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

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
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowStartTimePicker(false);
            if (selectedTime) {
              setStartTime(selectedTime);
            }
          }}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowEndTimePicker(false);
            if (selectedTime) {
              setEndTime(selectedTime);
            }
          }}
        />
      )}

      {showSkillLevelModal && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Skill Level</Text>
            {SKILL_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                style={styles.modalItem}
                onPress={() => {
                  setSkillLevel(level);
                  setShowSkillLevelModal(false);
                }}
              >
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
              <TouchableOpacity
                key={count}
                style={styles.modalItem}
                onPress={() => {
                  setPlayerCount(count);
                  setShowPlayerCountModal(false);
                }}
              >
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
}); 