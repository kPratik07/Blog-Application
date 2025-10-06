const nodemailer = require("nodemailer");
const { Resend } = require("resend");
require("dotenv").config();

// Create transporter
// For testing: Using Ethereal (fake SMTP) - No real emails sent
// For production: Switch to Gmail/SendGrid
const createTransporter = async () => {
  // If using real Gmail (production)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.USE_REAL_EMAIL === "true") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  
  // For testing: Create fake account automatically
  const testAccount = await nodemailer.createTestAccount();
  console.log("📧 Using Ethereal Email for testing");
  console.log("📧 No real emails will be sent");
  
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const emailHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>You have requested to reset your password. Use the OTP below to proceed:</p>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="color: #4CAF50; letter-spacing: 5px; margin: 0;">${otp}</h1>
      </div>
      <p style="color: #666;">This OTP will expire in <strong>10 minutes</strong>.</p>
      <p style="color: #666;">If you didn't request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">Blog Application - Password Reset Service</p>
    </div>
  `;

  // Use Resend if API key is configured
  console.log("🔍 Checking Resend API Key:", process.env.RESEND_API_KEY ? "Found" : "Not Found");
  
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "paste-your-resend-api-key-here") {
    console.log("📧 Using Resend to send email...");
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || "Blog App <onboarding@resend.dev>",
        to: email,
        subject: "Password Reset OTP - Blog Application",
        html: emailHTML,
      });

      if (error) {
        console.error("Resend error:", error);
        return { success: false, error: error.message };
      }

      console.log("✅ Email sent via Resend to:", email);
      return { success: true };
    } catch (error) {
      console.error("Resend send error:", error);
      return { success: false, error: error.message };
    }
  }

  // Fallback to Nodemailer (Gmail or Ethereal)
  const transporter = await createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Blog App" <noreply@blogapp.com>',
    to: email,
    subject: "Password Reset OTP - Blog Application",
    html: emailHTML,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    // For Ethereal testing - show preview URL
    if (process.env.USE_REAL_EMAIL !== "true") {
      console.log("📧 OTP Email Preview URL:", nodemailer.getTestMessageUrl(info));
      console.log("📧 OTP Code:", otp);
      console.log("📧 Copy the OTP from console to test!");
    }
    
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { generateOTP, sendOTPEmail };
