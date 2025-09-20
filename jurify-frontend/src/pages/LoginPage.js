import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication - in real app, this would call an API
    console.log('Form submitted:', formData);
    // Redirect to landing page after "authentication"
    navigate('/');
  };

  const handleGuestMode = () => {
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>⚖️ Jurify</h1>
          <p className="login-subtitle">Demystify Legal Documents with AI</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          <button type="submit" className="auth-btn primary">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

          {isLogin && (
            <a href="#forgot" className="forgot-password">
              Forgot Password?
            </a>
          )}
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="social-login">
          <button className="social-btn google">
            <span className="social-icon">🔍</span>
            Continue with Google
          </button>
          <button className="social-btn github">
            <span className="social-icon">⚡</span>
            Continue with GitHub
          </button>
        </div>

        <div className="guest-section">
          <p>Just want to try it out?</p>
          <button onClick={handleGuestMode} className="guest-btn">
            Continue as Guest
          </button>
          <p className="guest-note">
            <em>Perfect for hackathon judging - no signup required!</em>
          </p>
        </div>

        <div className="terms-notice">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy.
            <br />
            <small>⚠️ This tool provides AI assistance only and is not legal advice.</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;