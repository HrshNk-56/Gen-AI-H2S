import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import LandingPageV2 from './pages/LandingPageV2';
import LoginPageV2 from './pages/LoginPageV2';
import ResultsPage from './pages/ResultsPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPageV2 />} />
            <Route path="/login" element={<LoginPageV2 />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;