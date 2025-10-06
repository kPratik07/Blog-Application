// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail, passwordSuggestions } from "../utils/validators";
import { authService } from "../services/auth.service";
import "./Signup.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!isValidEmail(form.email))
      newErrors.email = "Please enter a valid email";
    if (!form.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const pwdInfo = passwordSuggestions(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Signup user
    const signupResult = await authService.signup(form);

    if (signupResult.success) {
      setMessage("Signup successful! Logging you in...");
      
      // Auto-login after successful signup
      const loginResult = await authService.login({
        email: form.email,
        password: form.password,
      });

      if (loginResult.success) {
        setForm({ name: "", email: "", password: "" });
        navigate("/blogs");
      } else {
        // Fallback: redirect to login page
        setForm({ name: "", email: "", password: "" });
        navigate("/login");
      }
    } else {
      setMessage(signupResult.error || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup Page</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <p className="signup-subheading">
          Create an account to get started with us!
        </p>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="field-error">{errors.name}</p>}

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
        {/* Password suggestions */}
        {form.password && (
          <div
            style={{
              fontSize: "13px",
              color: pwdInfo.strength === "strong" ? "green" : "#444",
              marginTop: "6px",
            }}
          >
            {pwdInfo.suggestions.length === 0 ? (
              <div>Strong password ✅</div>
            ) : (
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  Suggestions to improve password:
                </div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {pwdInfo.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button type="submit">Signup</button>
      </form>

      {message && (
        <p style={{ marginTop: "10px", color: "green", fontWeight: "500" }}>
          {message}
        </p>
      )}
    </div>
  );
}
