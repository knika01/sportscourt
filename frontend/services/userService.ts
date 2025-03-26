import { api } from './api';

export interface UserResponse {
  status: 'success' | 'error';
  message?: string;
  data?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    token?: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

class UserService {
  async login(data: LoginRequest): Promise<UserResponse> {
    return api.post<UserResponse['data']>('/auth/login', data);
  }

  async signup(data: SignupRequest): Promise<UserResponse> {
    return api.post<UserResponse['data']>('/auth/signup', data);
  }

  async getUserById(userId: number): Promise<UserResponse> {
    return api.get<UserResponse['data']>(`/users/${userId}`);
  }
}

export const userService = new UserService(); 