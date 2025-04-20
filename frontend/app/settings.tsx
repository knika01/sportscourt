import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';

const COLORS = {
  primary: '#4CA354',
  secondary: '#4B3DA3',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#5E5E5F',
  lightGray: '#D9D9D9',
  background: '#8BC485',
};

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const NOTIFICATION_OPTIONS = [
  { id: '30min', label: '30 minutes before game' },
  { id: '1hour', label: '1 hour before game' },
  { id: 'midgame', label: 'Mid-game updates' },
  { id: '24hour', label: '24 hour reminder' },
];

export default function SettingsScreen() {
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
  const [showSkillLevelModal, setShowSkillLevelModal] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const toggleNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(n => n !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
          title: "Settings"
        }} 
      />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.content}>
          {/* Skill Level Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skill Level</Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => setShowSkillLevelModal(true)}
            >
              <Text style={styles.dropdownText}>
                {selectedSkillLevel || 'Select Skill Level'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={COLORS.black} />
            </TouchableOpacity>
          </View>

          {/* Notification Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Preferences</Text>
            {NOTIFICATION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.checkboxContainer}
                onPress={() => toggleNotification(option.id)}
              >
                <View style={[styles.checkbox, selectedNotifications.includes(option.id) && styles.checkboxSelected]}>
                  {selectedNotifications.includes(option.id) && (
                    <Ionicons name="checkmark" size={16} color={COLORS.white} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Skill Level Modal */}
        {showSkillLevelModal && (
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Skill Level</Text>
              {SKILL_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedSkillLevel(level);
                    setShowSkillLevelModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.black,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.black,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: 16,
    color: COLORS.black,
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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