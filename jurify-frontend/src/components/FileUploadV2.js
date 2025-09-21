import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const FileUploadV2 = ({ onFileUpload, containerStyle = {} }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, setPendingFile } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    // Check if there's a pending file after login
    const pendingFileName = localStorage.getItem('pendingFileName');
    if (pendingFileName && isAuthenticated) {
      setError(`Please reselect your file: ${pendingFileName}`);
      localStorage.removeItem('pendingFileName');
    }
  }, [isAuthenticated]);

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
    // Reset states
    setError('');
    setUploadProgress(0);

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const validExtensions = ['pdf', 'doc', 'docx', 'txt'];

    if (!allowedTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setError('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      setPendingFile(file);
      localStorage.setItem('pendingFileName', file.name);
      navigate('/login');
      return;
    }

    // Set selected file and trigger upload
    setSelectedFile(file);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        // Trigger the parent's upload handler
        onFileUpload(file);
      }
    }, 100);
  };

  const openFileDialog = () => {
    inputRef.current.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div style={{
      ...containerStyle,
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div
        className="file-upload-zone"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        style={{
          padding: '3rem',
          backgroundColor: theme.colors.cardBg,
          border: `2px dashed ${dragActive ? theme.colors.primary : theme.colors.border}`,
          borderRadius: '16px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: dragActive ? 'scale(1.02)' : 'scale(1)',
          boxShadow: dragActive 
            ? '0 20px 40px rgba(102, 126, 234, 0.2)'
            : '0 10px 30px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 50% 50%, ${theme.isDarkMode ? 'rgba(102, 126, 234, 0.05)' : 'rgba(102, 126, 234, 0.03)'} 0%, transparent 70%)`,
          pointerEvents: 'none'
        }}></div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
        {!selectedFile ? (
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              {dragActive ? '📥' : '📄'}
            </div>
            
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: theme.colors.text,
              marginBottom: '0.5rem'
            }}>
              {dragActive ? 'Drop your document here' : 'Upload Legal Document'}
            </h3>
            
            <p style={{
              color: theme.colors.textSecondary,
              marginBottom: '1.5rem',
              fontSize: '0.95rem'
            }}>
              Drag & drop your file here, or click to browse
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
              style={{
                padding: '0.8rem 2rem',
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(139, 105, 20, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Select Document
            </button>

            <div style={{
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              {['PDF', 'DOC', 'DOCX', 'TXT'].map(format => (
                <span key={format} style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: theme.colors.hover,
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  color: theme.colors.textSecondary,
                  fontWeight: '500'
                }}>{format}</span>
              ))}
            </div>

            <p style={{
              marginTop: '1rem',
              fontSize: '0.85rem',
              color: theme.colors.textSecondary
            }}>
              Maximum file size: 10MB
            </p>
          </div>
        ) : (
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem',
              backgroundColor: theme.colors.hover,
              borderRadius: '12px',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: theme.colors.primary + '20',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  📄
                </div>
                <div>
                  <p style={{
                    fontWeight: '600',
                    color: theme.colors.text,
                    marginBottom: '0.25rem'
                  }}>{selectedFile.name}</p>
                  <p style={{
                    fontSize: '0.85rem',
                    color: theme.colors.textSecondary
                  }}>{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.cardBg,
                  border: `1px solid ${theme.colors.border}`,
                  color: theme.colors.text,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.cardBg;
                  e.currentTarget.style.color = theme.colors.text;
                  e.currentTarget.style.borderColor = theme.colors.border;
                }}
              >
                ×
              </button>
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    fontSize: '0.85rem',
                    color: theme.colors.textSecondary
                  }}>Uploading...</span>
                  <span style={{
                    fontSize: '0.85rem',
                    color: theme.colors.primary,
                    fontWeight: '600'
                  }}>{uploadProgress}%</span>
                </div>
                <div style={{
                  height: '6px',
                  backgroundColor: theme.colors.hover,
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${uploadProgress}%`,
                    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            )}

            {uploadProgress === 100 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                backgroundColor: theme.isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#d1fae5',
                borderRadius: '8px',
                color: '#10b981'
              }}>
                <span>✅</span>
                <span style={{ fontWeight: '500' }}>Processing document...</span>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: theme.isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fee',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            color: '#ef4444',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span>
            {error}
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: theme.colors.hover,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'start',
        gap: '0.75rem'
      }}>
        <span style={{ fontSize: '1.2rem' }}>🔒</span>
        <div>
          <p style={{
            fontWeight: '500',
            color: theme.colors.text,
            marginBottom: '0.25rem',
            fontSize: '0.9rem'
          }}>Your documents are secure</p>
          <p style={{
            fontSize: '0.85rem',
            color: theme.colors.textSecondary,
            lineHeight: '1.4'
          }}>
            Files are encrypted during upload and processed securely. We never store your documents permanently.
          </p>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FileUploadV2;