export interface GameParticipant {
  id: number;
  game_id: number;
  user_id: number;
  joined_at: string;
  first_name: string;
  last_name: string;
  username: string;
}

export interface JoinGameRequest {
  game_id: number;
  user_id: number;
}

export interface GameParticipantResponse {
  status: 'success' | 'error';
  data: GameParticipant | GameParticipant[] | { message: string };
} 