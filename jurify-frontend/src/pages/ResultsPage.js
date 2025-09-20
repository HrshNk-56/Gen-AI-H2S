import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DocumentView from '../components/DocumentView';
import ClauseHighlighter from '../components/ClauseHighlighter';
import Chatbot from '../components/Chatbot';
import '../styles/ResultsPage.css';

// Mock data for demonstration
const MOCK_DOCUMENT_DATA = {
  original: `CONFIDENTIALITY AGREEMENT

This Confidentiality Agreement ("Agreement") is entered into on [DATE] by and between Company A ("Disclosing Party") and Company B ("Receiving Party").

1. CONFIDENTIAL INFORMATION
The Receiving Party acknowledges that it may have access to certain confidential information of the Disclosing Party. Confidential Information includes, but is not limited to, technical data, trade secrets, know-how, research, product plans, products, services, customers, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances, or other business information.

2. NON-DISCLOSURE
The Receiving Party agrees not to disclose, reveal, or make available to any third party any Confidential Information received from the Disclosing Party without the prior written consent of the Disclosing Party.

3. TERMINATION
This Agreement shall terminate on [DATE] or upon written notice by either party. The obligations of the Receiving Party under this Agreement shall survive termination and continue for a period of five (5) years.`,
  
  simplified: `SIMPLE CONFIDENTIALITY AGREEMENT

This agreement is between Company A (who shares information) and Company B (who receives information).

1. WHAT IS CONFIDENTIAL INFORMATION?
Company B acknowledges they might see private information from Company A. This private information includes things like business secrets, customer lists, product plans, software, finances, and other business details.

2. KEEPING INFORMATION SECRET
Company B promises not to tell anyone else about Company A's private information without getting written permission first.

3. WHEN THIS AGREEMENT ENDS
This agreement ends on [DATE] or when either company decides to end it in writing. Even after the agreement ends, Company B must keep the secrets for 5 more years.`,

  clauses: [
    {
      id: 1,
      type: 'Confidentiality',
      color: 'blue',
      title: 'Non-Disclosure Clause',
      content: 'The Receiving Party agrees not to disclose, reveal, or make available to any third party any Confidential Information...',
      simplified: 'Company B promises not to tell anyone else about Company A\'s private information without written permission.',
      importance: 'high'
    },
    {
      id: 2,
      type: 'Termination',
      color: 'orange',
      title: 'Agreement Duration',
      content: 'This Agreement shall terminate on [DATE] or upon written notice by either party...',
      simplified: 'This agreement ends on a specific date or when either company wants to end it.',
      importance: 'medium'
    },
    {
      id: 3,
      type: 'Definition',
      color: 'green',
      title: 'Confidential Information Definition',
      content: 'Confidential Information includes, but is not limited to, technical data, trade secrets, know-how...',
      simplified: 'Private information includes business secrets, customer lists, product plans, and other business details.',
      importance: 'high'
    }
  ],

  readabilityScore: {
    original: 14,
    simplified: 8
  }
};

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('both');
  const [selectedClause, setSelectedClause] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      setDocumentData(MOCK_DOCUMENT_DATA);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNewUpload = () => {
    navigate('/');
  };

  const handleClauseSelect = (clause) => {
    setSelectedClause(clause);
  };

  if (loading) {
    return (
      <div className="results-page loading">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Processing your document...</h2>
          <p>Analyzing clauses and simplifying content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      {/* Header */}
      <header className="results-header">
        <div className="header-content">
          <h1>⚖️ Jurify</h1>
          <div className="file-info">
            <span className="file-name">
              📄 {location.state?.file?.name || 'Sample Contract.pdf'}
            </span>
            <button className="new-upload-btn" onClick={handleNewUpload}>
              Upload New Document
            </button>
          </div>
        </div>
      </header>

      <main className="results-main">
        {/* Readability Score */}
        <div className="readability-section">
          <div className="score-badge original">
            Original: Grade {documentData.readabilityScore.original}
          </div>
          <div className="arrow">→</div>
          <div className="score-badge simplified">
            Simplified: Grade {documentData.readabilityScore.simplified}
          </div>
        </div>

        <div className="content-layout">
          {/* Document View Section */}
          <div className="document-section">
            <div className="view-controls">
              <button 
                className={activeView === 'original' ? 'active' : ''}
                onClick={() => setActiveView('original')}
              >
                Original Only
              </button>
              <button 
                className={activeView === 'both' ? 'active' : ''}
                onClick={() => setActiveView('both')}
              >
                Side-by-Side
              </button>
              <button 
                className={activeView === 'simplified' ? 'active' : ''}
                onClick={() => setActiveView('simplified')}
              >
                Simplified Only
              </button>
            </div>

            <DocumentView 
              originalText={documentData.original}
              simplifiedText={documentData.simplified}
              activeView={activeView}
              selectedClause={selectedClause}
            />
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            {/* Clause Highlighter */}
            <ClauseHighlighter 
              clauses={documentData.clauses}
              onClauseSelect={handleClauseSelect}
              selectedClause={selectedClause}
            />

            {/* Chatbot */}
            <Chatbot documentData={documentData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;