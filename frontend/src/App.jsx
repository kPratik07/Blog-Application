// src/App.jsx
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Blogs from "./pages/Blogs";
import HomePage from "./pages/HomePage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <div>
      <Navbar />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/blogs" element={<Blogs />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
