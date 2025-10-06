import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { passwordService } from "../services/password.service";
import "./Login.css";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || "";

  const [form, setForm] = useState({
    email: emailFromState,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.otp.trim()) newErrors.otp = "OTP is required";
    if (form.otp.length !== 6) newErrors.otp = "OTP must be 6 digits";
    if (!form.newPassword.trim()) newErrors.newPassword = "Password is required";
    if (form.newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";
    if (form.newPassword !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await passwordService.resetPassword(
      form.email,
      form.otp,
      form.newPassword
    );
    setLoading(false);

    if (result.success) {
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setErrors({ otp: result.error || "Failed to reset password" });
    }
  };

  return (
    <div className="login">
      <h2>Reset Password</h2>
      <div className="login-container">
        <p className="login-subheading">
          Enter the OTP sent to your email and your new password.
        </p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            readOnly={!!emailFromState}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <input
            type="text"
            name="otp"
            placeholder="Enter 6-digit OTP"
            value={form.otp}
            onChange={handleChange}
            maxLength="6"
          />
          {errors.otp && <p className="field-error">{errors.otp}</p>}

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3 3L21 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.58 10.58C10.2 10.96 10 11.47 10 12C10 13.66 11.34 15 13 15c.53 0 1.04-.2 1.42-.58"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.12 14.12C15.06 13.18 15.6 12.12 15.6 11C15.6 8.79 13.95 7.14 11.74 7.14C10.62 7.14 9.56 7.68 8.62 8.62"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="field-error">{errors.newPassword}</p>
          )}

          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="field-error">{errors.confirmPassword}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
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
