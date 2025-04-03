import axios, { AxiosRequestConfig } from 'axios';
import authService from './authService';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class ApiService {
  // Get user profile
  async getUserProfile() {
    try {
      const response = await apiClient.get('/api/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create an order
  async createOrder(orderData: any) {
    try {
      const response = await apiClient.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get user orders with pagination
  async getUserOrders(page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') {
    try {
      const response = await apiClient.get('/api/orders', {
        params: { page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic GET method
  async get(endpoint: string, params?: Record<string, any>) {
    try {
      const config: AxiosRequestConfig = {};
      if (params) {
        config.params = params;
      }
      const response = await apiClient.get(endpoint, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic POST method
  async post(endpoint: string, data: any) {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic PUT method
  async put(endpoint: string, data: any) {
    try {
      const response = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic DELETE method
  async delete(endpoint: string) {
    try {
      const response = await apiClient.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ApiService(); 