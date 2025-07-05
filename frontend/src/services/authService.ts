import axios from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest, User, WeatherForecast } from '../types/auth';

const API_BASE_URL = 'http://localhost:5153/api'; // Updated to match actual running port

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL;

// Add request interceptor to include credentials
axios.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Network error occurred',
        errors: ['Unable to connect to server']
      };
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('Sending registration data:', userData);
      const response = await axios.post<AuthResponse>('/auth/register', userData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Registration error details:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      if (error.response?.data) {
        const data = error.response.data;
        // Normalize validation errors that may come in different shapes
        if (data.errors) {
          // "errors" can be an array of strings **or** an object where keys are field names and values are string arrays
          let extracted: string[] = [];
          if (Array.isArray(data.errors)) {
            extracted = data.errors;
          } else {
            // Collect all values and flatten
            extracted = Object.values(data.errors).flat() as string[];
          }

          return {
            success: false,
            message: data.message || data.title || 'Validation errors occurred',
            errors: extracted
          } as AuthResponse;
        }
        // Fallback to whatever shape the backend returns that already matches AuthResponse
        return data as AuthResponse;
      }
      return {
        success: false,
        message: 'Network error occurred',
        errors: ['Unable to connect to server']
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axios.get<AuthResponse>('/auth/me');
      return response.data.user || null;
    } catch (error) {
      return null;
    }
  },

  async checkAuth(): Promise<boolean> {
    try {
      const response = await axios.get<AuthResponse>('/auth/check');
      return response.data.success;
    } catch (error) {
      return false;
    }
  },

  async getWeatherForecast(): Promise<WeatherForecast[]> {
    try {
      const response = await axios.get<WeatherForecast[]>('/weather/forecast');
      return response.data;
    } catch (error) {
      console.error('Weather forecast error:', error);
      return [];
    }
  },

  async getCurrentWeather(): Promise<WeatherForecast | null> {
    try {
      const response = await axios.get<WeatherForecast>('/weather/current');
      return response.data;
    } catch (error) {
      console.error('Current weather error:', error);
      return null;
    }
  },

  async getCitiesWeather(): Promise<any[]> {
    try {
      const response = await axios.get<any[]>('/weather/cities');
      return response.data;
    } catch (error) {
      console.error('Cities weather error:', error);
      return [];
    }
  }
}; 