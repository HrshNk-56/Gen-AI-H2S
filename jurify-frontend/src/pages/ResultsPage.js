// hrshnk-56/gen-ai-h2s/Gen-AI-H2S-e4b2d161f93b4d62888c5bbaa8763f3ebd19ebc2/jurify-frontend/src/pages/ResultsPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { downloadAsPdf, downloadAsDocx } from '../utils/downloadUtils';
import DarkModeToggle from '../components/DarkModeToggle';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [documentData, setDocumentData] = useState(null);
  const [originalFileName, setOriginalFileName] = useState('document');

  useEffect(() => {
    if (location.state?.documentData) {
      setDocumentData(location.state.documentData);
    }
    if (location.state?.file?.name) {
      setOriginalFileName(location.state.file.name);
    }
  }, [location.state]);

  const handleDownload = (format) => {
    if (!documentData) return;
    
    const content = documentData.simplified || 'No content available.';
    const baseName = originalFileName.replace(/\.[^/.]+$/, "");
    const simplifiedFilename = `${baseName}_simplified`;

    if (format === 'pdf') {
      downloadAsPdf(content, `${simplifiedFilename}.pdf`);
    } else if (format === 'docx') {
      downloadAsDocx(content, `${simplifiedFilename}.docx`);
    }
  };

  return (
    <div className="results-page" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <DarkModeToggle />
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <span style={{ fontSize: '1.5rem' }}>⚖️</span>
        <h1 style={{ display: 'inline', marginLeft: '0.5rem', fontSize: '1.5rem', color: theme.colors.text }}>Jurify</h1>
      </div>
      
      <div className="results-container">
        <div className="split-view">
          <div className="document-pane">
            <h2>Original Document</h2>
            <div className="document-content">
              {documentData?.original || 'Loading content...'}
            </div>
          </div>
          <div className="document-pane">
            <h2>Simplified Version</h2>
            <div className="document-content">
              {documentData?.simplified || 'Processing...'}
            </div>
          </div>
        </div>
        <div className="download-options">
          <button onClick={() => handleDownload('pdf')}>Download as PDF</button>
          <button onClick={() => handleDownload('docx')}>Download as DOCX</button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;