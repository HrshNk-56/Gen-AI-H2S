import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    // Simulate processing and navigate to results
    setTimeout(() => {
      navigate('/results', { state: { file } });
    }, 1000);
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <div className="logo">
            <h1>⚖️ Jurify</h1>
          </div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="main-content">
        <div className="hero-section">
          <h2 className="tagline">Demystify Legal Documents with AI</h2>
          <p className="subtitle">
            Upload contracts for instant, simplified insights.
          </p>

          {/* How it Works */}
          <div className="how-it-works">
            <div className="step">
              <div className="step-icon">📄</div>
              <h4>Upload</h4>
              <p>Upload your legal document</p>
            </div>
            <div className="step">
              <div className="step-icon">🤖</div>
              <h4>Simplify</h4>
              <p>AI analyzes and simplifies</p>
            </div>
            <div className="step">
              <div className="step-icon">💬</div>
              <h4>Ask AI</h4>
              <p>Get answers in plain English</p>
            </div>
          </div>

          {/* Upload Section */}
          <div className="upload-section">
            <FileUpload onFileUpload={handleFileUpload} />
            <div className="supported-formats">
              <p>Supported formats: PDF, DOC, DOCX, TXT</p>
            </div>
            <div className="disclaimer">
              <p><em>⚠️ This tool provides AI-powered simplification only and is not legal advice.</em></p>
            </div>
          </div>

          {uploadedFile && (
            <div className="processing-indicator">
              <div className="spinner"></div>
              <p>Processing your document...</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Jurify. Built for legal document simplification.</p>
      </footer>
    </div>
  );
};

export default LandingPage;