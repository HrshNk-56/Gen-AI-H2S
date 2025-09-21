import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/ResultsPage.css';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [documentData, setDocumentData] = useState(null);

  useEffect(() => {
    if (location.state?.documentData) {
      setDocumentData(location.state.documentData);
    }
  }, [location.state]);

  return (
    <div className="results-page">
      <div className="results-container">
        <div className="split-view">
          <div className="original-document">
            <h2>Original Document</h2>
            <div className="document-content">
              {documentData?.original || 'No content available'}
            </div>
          </div>
          <div className="simplified-document">
            <h2>Simplified Version</h2>
            <div className="document-content">
              {documentData?.simplified || 'No content available'}
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