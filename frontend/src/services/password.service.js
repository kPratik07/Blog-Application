// Password Reset Service
import { apiClient } from "./api.client";
import { API_CONFIG } from "../config/api.config";

class PasswordService {
  // Request OTP for password reset
  async forgotPassword(email) {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.FORGOT_PASSWORD,
        { email }
      );
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Reset password with OTP
  async resetPassword(email, otp, newPassword) {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.RESET_PASSWORD,
        { email, otp, newPassword }
      );
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const passwordService = new PasswordService();
