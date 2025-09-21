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
        // Load theme preference from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        } else {
            // Check system preference
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

  const theme = {
    isDarkMode,
    colors: isDarkMode ? {
      // Dark mode colors with orange-yellow gradient
      background: '#0f1419',
      backgroundSecondary: '#1a1f2e',
      text: '#e1e8ed',
      textSecondary: '#9ca3af',
      primary: '#f97316',  // Orange
      primaryDark: '#ea580c',
      secondary: '#fbbf24', // Yellow
      border: '#2d3748',
      cardBg: '#1a1f2e',
      headerBg: '#141821',
      inputBg: '#1a1f2e',
      hover: '#252d3d',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      gradientStart: '#f97316',
      gradientEnd: '#fbbf24'
    } : {
      // Light mode colors - complementary to orange-yellow
      background: '#fafbfc',
      backgroundSecondary: '#ffffff',
      text: '#1a202c',
      textSecondary: '#4a5568',
      primary: '#ea580c',  // Darker orange for light mode
      primaryDark: '#c2410c',
      secondary: '#f59e0b', // Amber
      border: '#e2e8f0',
      cardBg: '#ffffff',
      headerBg: '#ffffff',
      inputBg: '#ffffff',
      hover: '#f7fafc',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      gradientStart: '#ea580c',
      gradientEnd: '#f59e0b'
    }
  };

    return (
        <ThemeContext.Provider value={{isDarkMode, toggleDarkMode, theme}}>
            {children}
        </ThemeContext.Provider>
    );
};