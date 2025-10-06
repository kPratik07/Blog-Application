import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../utils/validators";
import { authService } from "../services/auth.service";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // initialize navigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear field error
  };

  const validate = () => {
    let newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!isValidEmail(form.email))
      newErrors.email = "Please enter a valid email";
    if (!form.password.trim()) newErrors.password = "Password is required";
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

    const result = await authService.login(form);

    if (result.success) {
      setMessage("Login successful!");
      setForm({ email: "", password: "" });
      navigate("/blogs");
    } else {
      setMessage(result.error || "Login failed");
    }
  };

  return (
    <div className="login">
      <h2>Login Page</h2>
      <div className="login-container">
        <p className="login-subheading">
          Welcome back! Please enter your details to continue.
        </p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
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
          {errors.password && <p className="field-error">{errors.password}</p>}

          <button type="submit">Login</button>
        </form>

        {message && (
          <p style={{ marginTop: "10px", color: "green", fontWeight: "500" }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          <span
            onClick={() => navigate("/forgot-password")}
            style={{
              color: "#1976d2",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "14px",
            }}
          >
            Forgot Password?
          </span>
        </p>
      </div>
    </div>
  );
}
