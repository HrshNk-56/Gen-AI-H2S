// hrshnk-56/gen-ai-h2s/Gen-AI-H2S-e4b2d161f93b4d62888c5bbaa8763f3ebd19ebc2/jurify-frontend/src/pages/LoginPageV2.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import DarkModeToggle from '../components/DarkModeToggle';

const LoginPageV2 = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, signup } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a pending file
    const pendingFile = localStorage.getItem('pendingFile');
    if (pendingFile) {
      setError('Please login to upload your document');
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          setLoading(false);
          return;
        }
        await signup(formData.email, formData.password);
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    backgroundColor: theme.colors.inputBg,
    color: theme.colors.text,
    outline: 'none',
    transition: 'all 0.2s'
  };

  return (
    <div className="login-page" style={{backgroundColor: theme.colors.background}}>
      <DarkModeToggle />
      
      {/* Left Side - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: '100%',
          maxWidth: '450px'
        }}>
          {/* Logo */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '2rem',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            <span style={{ fontSize: '2rem' }}>⚖️</span>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              margin: 0
            }}>Jurify</h1>
          </div>

          {/* Welcome Text */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: theme.colors.text,
              marginBottom: '0.5rem'
            }}>
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p style={{
              color: theme.colors.textSecondary,
              fontSize: '0.95rem'
            }}>
              {isLogin 
                ? 'Enter your credentials to access your documents'
                : 'Start simplifying legal documents with AI'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: theme.isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fee',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              color: '#ef4444',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: theme.colors.text,
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required={!isLogin}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.border}
                />
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: theme.colors.text,
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                onBlur={(e) => e.target.style.borderColor = theme.colors.border}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: theme.colors.text,
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={isLogin ? 'Enter your password' : 'At least 8 characters'}
                  required
                  style={{...inputStyle, paddingRight: '3rem'}}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.border}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: theme.colors.textSecondary,
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: theme.colors.text,
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter your password"
                  required={!isLogin}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.border}
                />
              </div>
            )}

            {isLogin && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <input type="checkbox" />
                  <span style={{
                    color: theme.colors.textSecondary,
                    fontSize: '0.9rem'
                  }}>Remember me</span>
                </label>
                <a href="#forgot" style={{
                  color: theme.colors.primary,
                  fontSize: '0.9rem',
                  textDecoration: 'none'
                }}>Forgot password?</a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: loading 
                  ? theme.colors.border
                  : `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s',
                marginBottom: '1.5rem'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <p style={{
            textAlign: 'center',
            color: theme.colors.textSecondary,
            fontSize: '0.9rem'
          }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  name: ''
                });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: theme.colors.primary,
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Terms */}
          <p style={{
            marginTop: '2rem',
            fontSize: '0.8rem',
            color: theme.colors.textSecondary,
            textAlign: 'center',
            lineHeight: '1.5'
          }}>
            By continuing, you agree to Jurify's{' '}
            <a href="#terms" style={{ color: theme.colors.primary }}>Terms of Service</a> and{' '}
            <a href="#privacy" style={{ color: theme.colors.primary }}>Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div style={{
        flex: 1,
        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        position: 'relative',
        display: window.innerWidth < 1024 ? 'none' : 'flex'
      }}>
        {/* Pattern Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 30% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 70% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
          pointerEvents: 'none'
        }}></div>

        {/* Content */}
        <div style={{
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          zIndex: 1,
          maxWidth: '400px'
        }}>
          <div style={{
            fontSize: '5rem',
            marginBottom: '2rem',
            animation: 'float 3s ease-in-out infinite'
          }}>
            📜
          </div>
          
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            Simplify Legal Documents in Seconds
          </h2>
          
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.95,
            lineHeight: '1.6',
            marginBottom: '3rem'
          }}>
            Join thousands of users who trust Jurify to understand their contracts, agreements, and legal documents with AI-powered clarity.
          </p>

          {/* Features */}
          <div style={{
            display: 'grid',
            gap: '1rem',
            textAlign: 'left'
          }}>
            {[
              { icon: '✅', text: 'Custom AI analysis' },
              { icon: '🔒', text: 'Secure & confidential' },
              { icon: '💬', text: 'Interactive Q&A chat' },
              { icon: '📥', text: 'Download simplified versions' }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}>
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default LoginPageV2;