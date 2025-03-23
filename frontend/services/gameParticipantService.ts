import { API_URL } from './config';
import { GameParticipant, JoinGameRequest, GameParticipantResponse } from '../types/gameParticipant';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const gameParticipantService = {
  // Join a game
  joinGame: async (data: JoinGameRequest): Promise<GameParticipantResponse> => {
    try {
      const url = `${API_URL}/participants/join`;
      console.log('Joining game at:', url, 'with data:', data);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error joining game:', error);
      throw error;
    }
  },

  // Leave a game
  leaveGame: async (gameId: number, userId: number): Promise<GameParticipantResponse> => {
    try {
      const url = `${API_URL}/participants/${gameId}/${userId}`;
      console.log('Leaving game at:', url);
      const response = await fetch(url, {
        method: 'DELETE',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error leaving game:', error);
      throw error;
    }
  },

  // Get all participants for a game
  getGameParticipants: async (gameId: number): Promise<GameParticipantResponse> => {
    try {
      const url = `${API_URL}/participants/game/${gameId}`;
      console.log('Fetching game participants from:', url);
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching game participants:', error);
      throw error;
    }
  },

  // Get all games a user is participating in
  getUserGames: async (userId: number): Promise<GameParticipantResponse> => {
    try {
      const url = `${API_URL}/participants/user/${userId}`;
      console.log('Fetching user games from:', url);
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching user games:', error);
      throw error;
    }
  },

  // Delete all participants
  deleteAllParticipants: async (): Promise<GameParticipantResponse> => {
    try {
      const url = `${API_URL}/participants/all`;
      console.log('Deleting all participants at:', url);
      const response = await fetch(url, {
        method: 'DELETE',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting all participants:', error);
      throw error;
    }
  },
}; 