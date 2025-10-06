import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isBlogPage = location.pathname === "/blogs";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className={`navbar ${isBlogPage ? 'blog-page' : ''}`}>
      <div className="navbar-brand">
        <span className="brand-icon">📝</span>
        <span className="brand-text">Blog App</span>
      </div>

      {/* Hamburger */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Nav links */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        {isBlogPage ? (
          <>
            <li>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="nav-info">
              <span>📖 You're viewing your blogs</span>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                Signup
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
