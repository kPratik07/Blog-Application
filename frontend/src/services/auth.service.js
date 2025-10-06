// Authentication Service
import { apiClient } from "./api.client";
import { API_CONFIG, TOKEN_KEY, USER_KEY } from "../config/api.config";

class AuthService {
  // Signup user
  async signup(userData) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.SIGNUP, userData);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
      
      // Store token and user data
      if (response.token) {
        this.setToken(response.token);
      }
      if (response.user) {
        this.setUser(response.user);
      }

      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // Token management
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  // User management
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }
}

// Export singleton instance
export const authService = new AuthService();
