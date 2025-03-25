import { API_URL } from './config';

interface UserResponse {
  status: 'success' | 'error';
  data?: any;
  message?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

const handleResponse = async (response: Response): Promise<UserResponse> => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  return data;
};

export const userService = {
  // Get user details
  getUserById: async (userId: number): Promise<UserResponse> => {
    try {
      const url = `${API_URL}/users/${userId}`;
      console.log('Fetching user details from:', url);
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  },
}; 