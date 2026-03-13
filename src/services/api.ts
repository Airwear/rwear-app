import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.airwear.com';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user_data');
          // Redirect to login would happen here
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post('/api/login', { email, password });
    return response.data;
  }

  async register(name: string, email: string, password: string) {
    const response = await this.api.post('/api/register', { name, email, password });
    return response.data;
  }

  async logout() {
    const response = await this.api.post('/api/logout');
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/api/user');
    return response.data;
  }

  // Training/Workout endpoints
  async getTrainings(params?: { category?: string; difficulty?: string }) {
    const response = await this.api.get('/api/trainings', { params });
    return response.data;
  }

  async getTraining(id: string) {
    const response = await this.api.get(`/api/trainings/${id}`);
    return response.data;
  }

  async getUserTrainings() {
    const response = await this.api.get('/api/user/trainings');
    return response.data;
  }

  // Video endpoints
  async getVideos(params?: { category?: string }) {
    const response = await this.api.get('/api/videos', { params });
    return response.data;
  }

  async getVideo(id: string) {
    const response = await this.api.get(`/api/videos/${id}`);
    return response.data;
  }

  // Coach endpoints
  async getCoaches() {
    const response = await this.api.get('/api/coaches');
    return response.data;
  }

  async getCoach(id: string) {
    const response = await this.api.get(`/api/coaches/${id}`);
    return response.data;
  }

  // Category endpoints
  async getCategories() {
    const response = await this.api.get('/api/categories');
    return response.data;
  }

  // Generic methods
  async get(url: string, config?: any) {
    const response = await this.api.get(url, config);
    return response.data;
  }

  async post(url: string, data?: any, config?: any) {
    const response = await this.api.post(url, data, config);
    return response.data;
  }

  async put(url: string, data?: any, config?: any) {
    const response = await this.api.put(url, data, config);
    return response.data;
  }

  async delete(url: string, config?: any) {
    const response = await this.api.delete(url, config);
    return response.data;
  }
}

export default new ApiService();
