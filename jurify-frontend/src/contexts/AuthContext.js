import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingFile, setPendingFile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock authentication - replace with actual API call
    const mockUser = {
      id: 1,
      email: email,
      name: email.split('@')[0],
      token: 'mock-jwt-token'
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    
    // If there's a pending file, redirect to results
    if (pendingFile) {
      navigate('/results', { state: { file: pendingFile } });
      setPendingFile(null);
    } else {
      navigate('/dashboard');
    }
    
    return { success: true };
  };

  const signup = async (email, password) => {
    // Mock signup - replace with actual API call
    return login(email, password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const loginAsGuest = () => {
    const guestUser = {
      id: 'guest',
      email: 'guest@jurify.com',
      name: 'Guest User',
      isGuest: true
    };
    
    setUser(guestUser);
    localStorage.setItem('user', JSON.stringify(guestUser));
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    
    // If there's a pending file, redirect to results
    if (pendingFile) {
      navigate('/results', { state: { file: pendingFile } });
      setPendingFile(null);
    } else {
      navigate('/dashboard');
    }
  };

  const value = {
    user,
    loading,
    pendingFile,
    setPendingFile,
    login,
    signup,
    logout,
    loginAsGuest,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};