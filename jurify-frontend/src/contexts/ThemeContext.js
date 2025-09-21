// hrshnk-56/gen-ai-h2s/Gen-AI-H2S-e4b2d161f93b4d62888c5bbaa8763f3ebd19ebc2/jurify-frontend/src/contexts/ThemeContext.js
import React, {createContext, useContext, useState, useEffect} from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  // This effect now only sets the data-theme attribute, not the background style
  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const theme = {
    isDarkMode,
    colors: isDarkMode ? {
      // Dark mode: Orange to Yellow gradient colors
      background: '#111827',
      backgroundSecondary: '#1f2937',
      text: '#e5e7eb',
      textSecondary: '#9ca3af',
      primary: '#f97316',
      secondary: '#fbbf24',
      border: '#374151',
      cardBg: '#1f2937',
      headerBg: 'rgba(17, 24, 39, 0.8)',
      inputBg: '#374151',
      hover: '#374151',
    } : {
      // Light mode: Complementary Blues
      background: '#f9fafb',
      backgroundSecondary: '#ffffff',
      text: '#111827',
      textSecondary: '#6b7280',
      primary: '#2563eb',
      secondary: '#3b82f6',
      border: '#e5e7eb',
      cardBg: '#ffffff',
      headerBg: 'rgba(255, 255, 255, 0.8)',
      inputBg: '#ffffff',
      hover: '#f3f4f6',
    }
  };

  return (
      <ThemeContext.Provider value={{isDarkMode, toggleDarkMode, theme}}>
        {children}
      </ThemeContext.Provider>
  );
};