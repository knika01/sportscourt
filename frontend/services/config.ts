export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api';

if (!process.env.EXPO_PUBLIC_API_URL) {
  console.warn('EXPO_PUBLIC_API_URL is not set. Using default URL:', API_URL);
} 