import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
}

class AuthService {
  // Store JWT token in localStorage
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Get JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Remove JWT token from localStorage
  removeToken(): void {
    localStorage.removeItem('token');
  }

  // Store user info in localStorage
  setUser(user: Omit<AuthResponse, 'token'>): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get user info from localStorage
  getUser(): Omit<AuthResponse, 'token'> | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Remove user info from localStorage
  removeUser(): void {
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Setup authorization header for API requests
  getAuthHeader(): { Authorization: string } | Record<string, never> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Register a new user
  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/api/auth/signup`,
        data
      );

      if (response.data && response.data.token) {
        this.setToken(response.data.token);
        this.setUser({
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName
        });
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw error;
    }
  }

  // Login user
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/api/auth/login`,
        data
      );

      if (response.data && response.data.token) {
        this.setToken(response.data.token);
        this.setUser({
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName
        });
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw error;
    }
  }

  // Logout user
  logout(): void {
    this.removeToken();
    this.removeUser();
  }
}

export default new AuthService(); 