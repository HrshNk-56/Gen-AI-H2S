import React from 'react';
import '../styles/DocumentView.css';

const DocumentView = ({ originalText, simplifiedText, activeView, selectedClause }) => {
  const renderTextWithHighlights = (text, isOriginal = true) => {
    // Simple highlighting for demonstration
    // In a real implementation, this would be more sophisticated
    return text.split('\n').map((line, index) => (
      <p key={index} className={`document-line ${selectedClause ? 'has-selection' : ''}`}>
        {line}
      </p>
    ));
  };

  return (
    <div className={`document-view ${activeView}`}>
      {(activeView === 'original' || activeView === 'both') && (
        <div className="document-panel original">
          <div className="panel-header">
            <h3>📄 Original Document</h3>
            <div className="panel-badge original-badge">Complex Legal Text</div>
          </div>
          <div className="document-content">
            {renderTextWithHighlights(originalText, true)}
          </div>
        </div>
      )}

      {(activeView === 'simplified' || activeView === 'both') && (
        <div className="document-panel simplified">
          <div className="panel-header">
            <h3>✨ Simplified Version</h3>
            <div className="panel-badge simplified-badge">Plain English</div>
          </div>
          <div className="document-content">
            {renderTextWithHighlights(simplifiedText, false)}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentView;