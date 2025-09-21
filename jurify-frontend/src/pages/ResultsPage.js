// hrshnk-56/gen-ai-h2s/Gen-AI-H2S-e4b2d161f93b4d62888c5bbaa8763f3ebd19ebc2/jurify-frontend/src/pages/ResultsPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { downloadAsPdf, downloadAsDocx } from '../utils/downloadUtils';
import { Document, Page, pdfjs } from 'react-pdf';
import mammoth from 'mammoth';
// CSS imports are now in App.css and have been removed from here
import DarkModeToggle from '../components/DarkModeToggle';
import Chatbot from '../components/Chatbot';

// PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [documentData, setDocumentData] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [originalFileType, setOriginalFileType] = useState('');
  const [originalFileContent, setOriginalFileContent] = useState(null);

  // States for PDF rendering
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    if (location.state?.documentData) {
      setDocumentData(location.state.documentData);
    }
    if (location.state?.file) {
      const file = location.state.file;
      setOriginalFile(file);
      const fileType = file.name.split('.').pop().toLowerCase();
      setOriginalFileType(fileType);

      // Process file for rendering
      const reader = new FileReader();
      if (fileType === 'docx') {
        reader.onload = async (e) => {
          try {
            const result = await mammoth.convertToHtml({ arrayBuffer: e.target.result });
            setOriginalFileContent(result.value);
          } catch (error) {
            console.error('Error converting DOCX to HTML:', error);
            setOriginalFileContent('<p>Could not render this DOCX file.</p>');
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (fileType === 'txt') {
        reader.onload = (e) => setOriginalFileContent(e.target.result);
        reader.readAsText(file);
      }
    }
  }, [location.state]);

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

  const renderOriginalContent = () => {
    if (!originalFile) return <p>Loading document...</p>;

    switch (originalFileType) {
      case 'pdf':
        return (
            <Document file={originalFile} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from(new Array(numPages), (el, index) => (
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
                {documentData?.simplified || 'Processing...'}
              </div>
            </div>
          </div>
          <div className="download-options">
            <button onClick={() => handleDownload('pdf')}>Download as PDF</button>
            <button onClick={() => handleDownload('docx')}>Download as DOCX</button>
          </div>
        </div>
        <Chatbot documentId={location.state?.documentId} />
      </div>
  );
};

export default ResultsPage;