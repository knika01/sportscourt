export interface GameParticipant {
  id: number;
  game_id: number;
  user_id: number;
  joined_at: string;
  username?: string; // Optional, will be populated when fetching participants
}

export interface JoinGameRequest {
  game_id: number;
  user_id: number;
}

export interface GameParticipantResponse {
  status: 'success' | 'error';
  data: GameParticipant | GameParticipant[] | { message: string };
} 