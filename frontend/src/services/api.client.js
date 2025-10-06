// API Client with interceptors and error handling
import { API_CONFIG, TOKEN_KEY } from "../config/api.config";

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Build headers with auth token
  getHeaders(customHeaders = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle API response
  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("user");
        
        // Only redirect if not already on login/signup page
        if (!window.location.pathname.includes("/login") && 
            !window.location.pathname.includes("/signup")) {
          window.location.href = "/login";
        }
      }

      // Throw error with message from server
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return data;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: this.getHeaders(options.headers),
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please try again.");
      }
      
      throw error;
    }
  }

  // HTTP Methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
