import React from 'react';
import '../styles/ClauseHighlighter.css';

const ClauseHighlighter = ({ clauses, onClauseSelect, selectedClause }) => {
  const getClauseIcon = (type) => {
    const icons = {
      'Confidentiality': '🔒',
      'Termination': '📅',
      'Definition': '📖',
      'Liability': '⚠️',
      'Payment': '💰'
    };
    return icons[type] || '📄';
  };

  const getImportanceColor = (importance) => {
    const colors = {
      'high': '#ff4757',
      'medium': '#ffa502', 
      'low': '#2ed573'
    };
    return colors[importance] || '#57606f';
  };

  return (
    <div className="clause-highlighter">
      <div className="section-header">
        <h3>🎯 Key Clauses Detected</h3>
        <p className="clause-count">{clauses.length} important clauses found</p>
      </div>

      <div className="clauses-list">
        {clauses.map((clause) => (
          <div 
            key={clause.id}
            className={`clause-item ${selectedClause?.id === clause.id ? 'selected' : ''}`}
            onClick={() => onClauseSelect(clause)}
          >
            <div className="clause-header">
              <div className="clause-type">
                <span className="clause-icon">{getClauseIcon(clause.type)}</span>
                <span className={`clause-tag ${clause.color}`}>{clause.type}</span>
              </div>
              <div 
                className="importance-indicator"
                style={{ backgroundColor: getImportanceColor(clause.importance) }}
                title={`${clause.importance} importance`}
              >
                {clause.importance}
              </div>
            </div>
            
            <h4 className="clause-title">{clause.title}</h4>
            
            <div className="clause-preview">
              <div className="original-preview">
                <strong>Original:</strong> {clause.content}
              </div>
              <div className="simplified-preview">
                <strong>Simplified:</strong> {clause.simplified}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="legend">
        <h4>Clause Types:</h4>
        <div className="legend-items">
          <span className="legend-item blue">🔒 Confidentiality</span>
          <span className="legend-item orange">📅 Termination</span>
          <span className="legend-item green">📖 Definition</span>
          <span className="legend-item red">⚠️ Liability</span>
          <span className="legend-item purple">💰 Payment</span>
        </div>
      </div>
    </div>
  );
};

export default ClauseHighlighter;