export interface Game {
  id: number;
  title: string;
  sport: string;
  location: string;
  latitude: number;
  longitude: number;
  date_time: string;
  description: string | null;
  skill_level: string;
  max_players: number;
  created_at: string;
  created_by: number;
}

export interface CreateGameRequest {
  title: string;
  sport: string;
  location: string;
  date_time: string;
  description: string | null;
  skill_level: string;
  max_players: number;
  created_by: number;
}

export interface GameResponse {
  status: 'success' | 'error';
  data: Game | Game[];
  message?: string;
} 