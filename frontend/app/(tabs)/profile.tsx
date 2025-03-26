import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Settings Button */}
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={24} color={COLORS.gray} />
        </TouchableOpacity>

        {/* Profile Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Ionicons name="person-circle" size={236} color={COLORS.lightGray} />
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="camera" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>"Hey! I love to meet new people!"</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsLeft}>
            <Text style={styles.statsLabel}>Most Played Sport:</Text>
            <Text style={styles.statsLabel}>Games Played:</Text>
            <Text style={styles.statsLabel}>Games Won:</Text>
          </View>
          <View style={styles.statsRight}>
            <Text style={styles.statsValue}>Basketball</Text>
            <Text style={styles.statsValue}>24</Text>
            <Text style={styles.statsValue}>10</Text>
          </View>
          <View style={styles.trophyContainer}>
            <Ionicons name="trophy" size={24} color={COLORS.black} />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 214,
    height: 214,
    borderRadius: 107,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  bioContainer: {
    backgroundColor: COLORS.white,
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 8,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  bioText: {
    fontSize: 16,
    color: COLORS.black,
  },
  statsContainer: {
    backgroundColor: COLORS.white,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'row',
  },
  statsLeft: {
    flex: 1,
  },
  statsRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statsLabel: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 24,
  },
  statsValue: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 24,
  },
  trophyContainer: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 