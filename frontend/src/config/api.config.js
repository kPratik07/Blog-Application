// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  TIMEOUT: 10000, // 10 seconds
  ENDPOINTS: {
    // Auth endpoints
    SIGNUP: "/signup",
    LOGIN: "/login",
    HEALTH: "/health",
    
    // Password reset endpoints
    FORGOT_PASSWORD: "/password/forgot-password",
    RESET_PASSWORD: "/password/reset-password",
    
    // Blog endpoints
    BLOGS: "/blogs",
    BLOG_CREATE: "/blogs/create",
    BLOG_EDIT: (id) => `/blogs/edit/${id}`,
    BLOG_DELETE: (id) => `/blogs/delete/${id}`,
  },
};

// Token management
export const TOKEN_KEY = "token";
export const USER_KEY = "user";
