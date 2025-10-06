export function isValidEmail(email) {
  // simple RFC-like email regex for client-side validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function passwordSuggestions(password) {
  const suggestions = [];
  if (password.length < 8)
    suggestions.push("Make it at least 8 characters long");
  if (!/[A-Z]/.test(password)) suggestions.push("Include an uppercase letter");
  if (!/[a-z]/.test(password)) suggestions.push("Include a lowercase letter");
  if (!/[0-9]/.test(password)) suggestions.push("Include a number");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    suggestions.push("Include a special character (e.g. !@#$%)");
  if (
    password.length >= 12 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    return { strength: "strong", suggestions: [] };
  }
  return { strength: "weak", suggestions };
}
