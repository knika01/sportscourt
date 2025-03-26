import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { gameParticipantService } from '../services/gameParticipantService';
import { GameParticipant } from '../types/gameParticipant';
import { router } from 'expo-router';

interface GameParticipationButtonProps {
  gameId: number;
  userId: number;
  maxPlayers: number;
  onParticipantChange?: () => void;
}

export const GameParticipationButton: React.FC<GameParticipationButtonProps> = ({
  gameId,
  userId,
  maxPlayers,
  onParticipantChange,
}) => {
  const [isParticipating, setIsParticipating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    checkParticipation();
  }, [gameId, userId]);

  const checkParticipation = async () => {
    try {
      const participants = await gameParticipantService.getGameParticipants(gameId);
      setParticipantCount(participants.length);
      setIsParticipating(participants.some(p => p.user_id === userId));
    } catch (error) {
      console.error('Error checking participation:', error);
    }
  };

  const handleParticipation = async () => {
    setIsLoading(true);
    try {
      if (isParticipating) {
        await gameParticipantService.leaveGame(gameId, userId);
        setIsParticipating(false);
        setParticipantCount(prev => prev - 1);
      } else {
        if (participantCount >= maxPlayers) {
          alert('Game is full!');
          return;
        }
        await gameParticipantService.joinGame(gameId, userId);
        setIsParticipating(true);
        setParticipantCount(prev => prev + 1);
        // Navigate to home page after successfully joining
        router.replace('/');
      }
      onParticipantChange?.();
    } catch (error) {
      console.error('Error handling participation:', error);
      alert('Failed to update participation status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isParticipating ? styles.leaveButton : styles.joinButton,
        ]}
        onPress={handleParticipation}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            {isParticipating ? 'Leave Game' : 'Join Game'}
          </Text>
        )}
      </TouchableOpacity>
      <Text style={styles.participantCount}>
        {participantCount}/{maxPlayers} participants
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#4CAF50',
  },
  leaveButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  participantCount: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
}); 