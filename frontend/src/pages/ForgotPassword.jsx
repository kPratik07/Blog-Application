import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../utils/validators";
import { passwordService } from "../services/password.service";
import "./Login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    const result = await passwordService.forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setMessage(result.data.message || "If this email is registered, you will receive an OTP shortly.");
      // Redirect after showing message
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 3000);
    } else {
      setError(result.error || "Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="login">
      <h2>Forgot Password</h2>
      <div className="login-container">
        <p className="login-subheading">
          Enter your email address and we'll send you an OTP to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
          {error && <p className="field-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "10px", color: "green", fontWeight: "500" }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Remember your password?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#1976d2",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
