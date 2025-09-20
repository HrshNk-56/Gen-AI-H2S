import React, { useState, useRef } from 'react';
import '../styles/FileUpload.css';

const FileUpload = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (allowedTypes.includes(file.type)) {
      setSelectedFile(file);
      onFileUpload(file);
    } else {
      alert('Please upload a PDF, DOC, DOCX, or TXT file.');
    }
  };

  const openFileDialog = () => {
    inputRef.current.click();
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-zone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={inputRef}
          type="file"
          className="file-input"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
        <div className="upload-content">
          <div className="upload-icon">📁</div>
          <h3>Upload your legal document</h3>
          <p>Drag & drop your file here, or <span className="click-text">click to browse</span></p>
          {selectedFile && (
            <div className="selected-file">
              <p>✅ Selected: {selectedFile.name}</p>
            </div>
          )}
        </div>
      </div>
      
      <button 
        className="upload-btn"
        onClick={openFileDialog}
        disabled={!!selectedFile}
      >
        {selectedFile ? 'Processing...' : 'Choose File'}
      </button>
    </div>
  );
};

export default FileUpload;