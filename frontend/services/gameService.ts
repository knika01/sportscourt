import { API_URL } from './config';
import { Game, CreateGameRequest, GameResponse } from '@/types/game';

interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const gameService = {
  // Fetch all games with optional filters
  fetchAllGames: async (filters?: { location?: string; skill_level?: string; date?: string }): Promise<GameResponse> => {
    try {
      let url = `${API_URL}/games`;
      const params = new URLSearchParams();
      
      if (filters?.location) params.append('location', filters.location);
      if (filters?.skill_level) params.append('skill_level', filters.skill_level);
      if (filters?.date) params.append('date', filters.date);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log('Fetching games from:', url);
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  },

  // Get games for a specific user
  getUserGames: async (userId: number): Promise<GameResponse> => {
    try {
      const url = `${API_URL}/games/user/${userId}`;
      console.log('Fetching user games from:', url);
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching user games:', error);
      throw error;
    }
  },

  // Get games where user is the host
  getUserHostedGames: async (userId: number): Promise<GameResponse> => {
    try {
      const url = `${API_URL}/games/hosted/${userId}`;
      console.log('Fetching user hosted games from:', url);
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching user hosted games:', error);
      throw error;
    }
  },

  // Get a single game by ID
  getGameById: async (id: number): Promise<GameResponse> => {
    try {
      const url = `${API_URL}/games/${id}`;
      console.log('Fetching game details from:', url);
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching game details:', error);
      throw error;
    }
  },

  // Create a new game
  createGame: async (data: CreateGameRequest): Promise<GameResponse> => {
    try {
      const url = `${API_URL}/games`;
      console.log('Creating game at:', url, 'with data:', data);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  },

  // Update a game
  updateGame: async (id: number, data: Partial<Game>): Promise<GameResponse> => {
    try {
      const url = `${API_URL}/games/${id}`;
      console.log('Updating game at:', url, 'with data:', data);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  },

  // Delete a game
  deleteGame: async (id: number): Promise<GameResponse> => {
    try {
      const url = `${API_URL}/games/${id}`;
      console.log('Deleting game at:', url);
      const response = await fetch(url, {
        method: 'DELETE',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  },
}; 