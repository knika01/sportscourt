import { api } from './api';
import { Game, CreateGameRequest } from '@/types/game';

class GameService {
  async searchGames(): Promise<Game[]> {
    const response = await api.get<Game[]>('/games/search');
    if (response.status === 'error' || !response.data) {
      throw new Error(response.message || 'Failed to fetch games');
    }
    return response.data;
  }

  async getGameById(gameId: number): Promise<Game> {
    const response = await api.get<Game>(`/games/${gameId}`);
    if (response.status === 'error' || !response.data) {
      throw new Error(response.message || 'Game not found');
    }
    return response.data;
  }

  async createGame(gameData: CreateGameRequest): Promise<Game> {
    const response = await api.post<Game>('/games', gameData);
    if (response.status === 'error' || !response.data) {
      throw new Error(response.message || 'Failed to create game');
    }
    return response.data;
  }

  async updateGame(gameId: number, gameData: Partial<Game>): Promise<Game> {
    const response = await api.put<Game>(`/games/${gameId}`, gameData);
    if (response.status === 'error' || !response.data) {
      throw new Error(response.message || 'Failed to update game');
    }
    return response.data;
  }

  async deleteGame(gameId: number): Promise<void> {
    const response = await api.delete(`/games/${gameId}`);
    if (response.status === 'error') {
      throw new Error(response.message || 'Failed to delete game');
    }
  }

  async getUserHostedGames(userId: number): Promise<Game[]> {
    const response = await api.get<Game[]>(`/games/hosted/${userId}`);
    if (response.status === 'error' || !response.data) {
      throw new Error(response.message || 'Failed to fetch hosted games');
    }
    return response.data;
  }

  async getUserJoinedGames(userId: number): Promise<Game[]> {
    const response = await api.get<Game[]>(`/games/joined/${userId}`);
    if (response.status === 'error' || !response.data) {
      throw new Error(response.message || 'Failed to fetch joined games');
    }
    return response.data;
  }
}

export const gameService = new GameService(); 