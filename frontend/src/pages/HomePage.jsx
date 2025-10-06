import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Floating decorations */}
      <div className="floating-bg">
        <div className="float-item 🎈">🎈</div>
        <div className="float-item 💎">💎</div>
        <div className="float-item 💫">💫</div>
        <div className="float-item 🎈">🎈</div>
        <div className="float-item 💎">💎</div>
      </div>

      {/* Main content */}
      <div className="home-content">
        <h1 className="home-title">📝 Welcome to Blog Application</h1>
        <p className="home-subtitle">
          Share your thoughts, stories, and experiences with the world 🌍
        </p>
        <p className="home-desc">
          ✨ Create blogs effortlessly, read inspiring posts, and connect with
          like-minded readers. Whether you’re a beginner or a seasoned writer,
          this is your space to express ideas and creativity.
        </p>
        <p className="home-note">
          🚀 Start exploring by signing up — your words deserve to be heard.
        </p>
      </div>
    </div>
  );
}

export default Home;
