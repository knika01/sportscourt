import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

class ApiService {
  private async getHeaders(): Promise<Headers> {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user.token) {
          headers.append('Authorization', `Bearer ${user.token}`);
        }
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      return {
        status: 'error',
        message: 'Failed to fetch data',
      };
    }
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      return {
        status: 'error',
        message: 'Failed to create data',
      };
    }
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error);
      return {
        status: 'error',
        message: 'Failed to update data',
      };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error);
      return {
        status: 'error',
        message: 'Failed to delete data',
      };
    }
  }
}

export const api = new ApiService(); 