// src/pages/ResultsPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { downloadAsPdf, downloadAsDocx } from '../utils/downloadUtils';
import { Document, Page, pdfjs } from 'react-pdf';
import mammoth from 'mammoth';

// Import the CSS files directly into the component
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import DarkModeToggle from '../components/DarkModeToggle';
import Chatbot from '../components/Chatbot';

// This is the stable way to set up the PDF worker with Create React App
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [documentData, setDocumentData] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [originalFileType, setOriginalFileType] = useState('');
  const [originalFileContent, setOriginalFileContent] = useState(null);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    // If state is missing on page load/refresh, redirect to home
    if (!location.state || !location.state.file || !location.state.documentData) {
      console.warn("No file data found in location state. Redirecting to home.");
      navigate('/');
      return;
    }

    setIsLoading(true);
    const { file, documentData: data } = location.state;

    setDocumentData(data);
    setOriginalFile(file);
    const fileType = file.name.split('.').pop().toLowerCase();
    setOriginalFileType(fileType);

    const reader = new FileReader();

    if (fileType === 'docx') {
      reader.onload = (e) => {
        mammoth.convertToHtml({ arrayBuffer: e.target.result })
            .then(result => {
              setOriginalFileContent(result.value);
              setIsLoading(false);
            })
            .catch(error => {
              console.error('Error converting DOCX to HTML:', error);
              setOriginalFileContent('<p>Could not render this DOCX file.</p>');
              setIsLoading(false);
            });
      };
      reader.readAsArrayBuffer(file);
    } else if (fileType === 'txt') {
      reader.onload = (e) => {
        setOriginalFileContent(e.target.result);
        setIsLoading(false);
      };
      reader.readAsText(file);
    } else if (fileType === 'pdf') {
      // PDF loading is handled by its component's callbacks
      setIsLoading(false);
    } else {
      setOriginalFileContent('<p>Unsupported file type for preview.</p>');
      setIsLoading(false);
    }
  }, [location.state, navigate]);

  const handleDownload = (format) => {
    if (!documentData) return;
    const content = documentData.simplified || 'No content available.';
    const baseName = originalFile?.name.replace(/\.[^/.]+$/, "") || 'document';
    const filename = `${baseName}_simplified`;
    if (format === 'pdf') downloadAsPdf(content, `${filename}.pdf`);
    else if (format === 'docx') downloadAsDocx(content, `${filename}.docx`);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setOriginalFileContent('<p>Could not render this PDF file.</p>');
  }

  const renderOriginalContent = () => {
    if (!originalFile) return <p>Loading document...</p>;

    switch (originalFileType) {
      case 'pdf':
        return (
            <Document
                file={originalFile}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading="Loading PDF..."
            >
              {Array.from(new Array(numPages || 0), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
        );
      case 'docx':
        return <div dangerouslySetInnerHTML={{ __html: originalFileContent }} />;
      case 'txt':
        return <pre>{originalFileContent}</pre>;
      default:
        return <p>Unsupported file type for preview.</p>;
    }
  };

  // Render a loading state or null if redirecting
  if (!location.state) {
    return null;
  }

  return (
      <div className="results-page" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
        <DarkModeToggle />
        <header className="results-header" style={{ borderBottom: `1px solid ${theme.colors.border}`}}>
          <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            <span style={{ fontSize: '1.5rem' }}>⚖️</span>
            <h1 style={{ display: 'inline', marginLeft: '0.5rem', fontSize: '1.5rem', color: theme.colors.text }}>Jurify</h1>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/')}>Upload New</button>
          </div>
        </header>

        <div className="results-container">
          {documentData?.clauses?.length > 0 && (
            <div className="clauses-section" style={{ 
              marginBottom: '2rem', 
              padding: '1.5rem', 
              backgroundColor: theme.colors.cardBg, 
              borderRadius: '12px',
              border: `1px solid ${theme.colors.border}`
            }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Key Clauses Identified</h2>
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {documentData.clauses.map(clause => (
                  <div key={clause.id} style={{
                    minWidth: '250px',
                    padding: '1rem',
                    backgroundColor: theme.colors.hover,
                    borderRadius: '8px',
                    borderLeft: `4px solid ${clause.importance === 'high' ? '#ef4444' : theme.colors.primary}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{clause.type}</span>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '10px', 
                        backgroundColor: clause.importance === 'high' ? '#fee2e2' : '#e0e7ff',
                        color: clause.importance === 'high' ? '#ef4444' : '#4338ca'
                      }}>{clause.importance.toUpperCase()}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: theme.colors.textSecondary, display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {clause.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="split-view">
            <div className="document-pane">
              <h2>Original Document</h2>
              <div className="document-content original-preview">
                {renderOriginalContent()}
              </div>
            </div>
            <div className="document-pane">
              <h2>Simplified Version</h2>
              <div className="document-content">
                {isLoading ? 'Processing...' : (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {documentData?.simplified || 'No simplified text available.'}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="download-options">
            <button onClick={() => handleDownload('pdf')}>Download as PDF</button>
            <button onClick={() => handleDownload('docx')}>Download as DOCX</button>
          </div>
        </div>
        <Chatbot
            documentId={location.state?.documentId}
            documentText={documentData?.simplified}
        />
      </div>
  );
};

export default ResultsPage;