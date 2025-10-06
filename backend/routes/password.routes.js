const express = require("express");
const bcrypt = require("bcrypt");
const { Usermodel } = require("../models/User.model");
const { Otpmodel } = require("../models/Otp.model");
const { generateOTP, sendOTPEmail } = require("../services/email.service");

const passwordRouter = express.Router();

// Forgot Password - Send OTP
passwordRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  try {
    // Check if user exists
    const user = await Usermodel.findOne({ email });
    
    // Security: Always return success message to prevent email enumeration
    // Only send OTP if user actually exists
    if (user) {
      // Generate OTP
      const otp = generateOTP();

      // Delete any existing OTPs for this email
      await Otpmodel.deleteMany({ email });

      // Save OTP to database
      await Otpmodel.create({ email, otp });

      // Send OTP via email
      const emailResult = await sendOTPEmail(email, otp);

      if (!emailResult.success) {
        console.error("Failed to send OTP email to:", email);
        return res.status(500).send({ message: "Failed to send email. Please try again." });
      }
    }

    // Always return success to prevent email enumeration attacks
    return res.send({ 
      message: "If this email is registered, you will receive an OTP shortly." 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).send({ message: "Error processing request" });
  }
});

// Verify OTP and Reset Password
passwordRouter.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    // Find OTP record
    const otpRecord = await Otpmodel.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).send({ message: "Invalid or expired OTP" });
    }

    // Find user
    const user = await Usermodel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 5);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Delete OTP after successful reset
    await Otpmodel.deleteMany({ email });

    return res.send({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).send({ message: "Error resetting password" });
  }
});

module.exports = { passwordRouter };
