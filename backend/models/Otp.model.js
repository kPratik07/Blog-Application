const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 }, // Auto-delete after 10 minutes
  }
);

const Otpmodel = mongoose.model("otp", OtpSchema);

module.exports = { Otpmodel };
