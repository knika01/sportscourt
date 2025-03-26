import { api } from './api';
import { GameParticipant } from '../types/gameParticipant';

class GameParticipantService {
  async getGameParticipants(gameId: number): Promise<GameParticipant[]> {
    try {
      const response = await api.get<GameParticipant[]>(`/game-participants/game/${gameId}`);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch game participants');
    }
  }

  async joinGame(gameId: number, userId: number): Promise<void> {
    try {
      await api.post('/game-participants/join', { game_id: gameId, user_id: userId });
    } catch (error) {
      throw new Error('Failed to join game');
    }
  }

  async leaveGame(gameId: number, userId: number): Promise<void> {
    try {
      await api.delete(`/game-participants/${gameId}/${userId}`);
    } catch (error) {
      throw new Error('Failed to leave game');
    }
  }

  async getUserGames(userId: number): Promise<GameParticipant[]> {
    try {
      const response = await api.get<GameParticipant[]>(`/game-participants/user/${userId}`);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user games');
    }
  }
}

export const gameParticipantService = new GameParticipantService(); 