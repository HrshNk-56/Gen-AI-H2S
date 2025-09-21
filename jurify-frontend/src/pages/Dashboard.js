import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import DarkModeToggle from '../components/DarkModeToggle';
import FileUploadV2 from '../components/FileUploadV2';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    // Load recent documents from localStorage or API
    const stored = localStorage.getItem('recentDocuments');
    if (stored) {
      setRecentDocuments(JSON.parse(stored));
    }
  }, []);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add to recent documents
        const newDoc = {
          id: data.documentId,
          name: file.name,
          date: new Date().toISOString(),
          size: file.size
        };
        
        const updated = [newDoc, ...recentDocuments].slice(0, 10);
        setRecentDocuments(updated);
        localStorage.setItem('recentDocuments', JSON.stringify(updated));
        
        // Navigate directly to results
        navigate('/results', { 
          state: { 
            file,
            documentId: data.documentId,
            documentData: data.data
          } 
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      // Fallback to mock data
      navigate('/results', { state: { file } });
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      transition: 'background-color 0.3s ease'
    }}>
      <DarkModeToggle />
      
      {/* Header */}
      <header style={{
        backgroundColor: theme.colors.headerBg,
        borderBottom: `1px solid ${theme.colors.border}`,
        padding: '1.5rem 2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '1.75rem' }}>⚖️</span>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              margin: 0
            }}>Jurify Dashboard</h1>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: theme.colors.hover,
              borderRadius: '8px'
            }}>
              <span>👤</span>
              <span style={{
                color: theme.colors.text,
                fontWeight: '500'
              }}>{user?.name || user?.email?.split('@')[0]}</span>
            </div>
            
            <button
              onClick={logout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                border: `1px solid ${theme.colors.error}`,
                color: theme.colors.error,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme.colors.error;
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = theme.colors.error;
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1280px',
        margin: '2rem auto',
        padding: '0 2rem'
      }}>
        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div
            onClick={() => setShowUpload(!showUpload)}
            style={{
              padding: '2rem',
              backgroundColor: theme.colors.cardBg,
              borderRadius: '12px',
              border: `1px solid ${theme.colors.border}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📤</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: theme.colors.text,
              marginBottom: '0.5rem'
            }}>Upload Document</h3>
            <p style={{
              color: theme.colors.textSecondary,
              fontSize: '0.9rem'
            }}>Process a new legal document</p>
          </div>

          <div style={{
            padding: '2rem',
            backgroundColor: theme.colors.cardBg,
            borderRadius: '12px',
            border: `1px solid ${theme.colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{
              fontSize: '3rem',
              fontWeight: '700',
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              margin: 0
            }}>{recentDocuments.length}</h3>
            <p style={{
              color: theme.colors.textSecondary,
              fontSize: '0.9rem'
            }}>Documents Processed</p>
          </div>

          <div style={{
            padding: '2rem',
            backgroundColor: theme.colors.cardBg,
            borderRadius: '12px',
            border: `1px solid ${theme.colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: theme.colors.success,
              margin: 0
            }}>60s</h3>
            <p style={{
              color: theme.colors.textSecondary,
              fontSize: '0.9rem'
            }}>Avg. Processing Time</p>
          </div>

          <div style={{
            padding: '2rem',
            backgroundColor: theme.colors.cardBg,
            borderRadius: '12px',
            border: `1px solid ${theme.colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✨</div>
            <h3 style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: theme.colors.warning,
              margin: 0
            }}>95%</h3>
            <p style={{
              color: theme.colors.textSecondary,
              fontSize: '0.9rem'
            }}>Accuracy Rate</p>
          </div>
        </div>

        {/* Upload Section (collapsible) */}
        {showUpload && (
          <div style={{
            marginBottom: '3rem',
            padding: '2rem',
            backgroundColor: theme.colors.cardBg,
            borderRadius: '12px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: theme.colors.text
              }}>Upload New Document</h2>
              <button
                onClick={() => setShowUpload(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: theme.colors.textSecondary
                }}
              >×</button>
            </div>
            <FileUploadV2 onFileUpload={handleFileUpload} />
          </div>
        )}

        {/* Recent Documents */}
        <div style={{
          backgroundColor: theme.colors.cardBg,
          borderRadius: '12px',
          border: `1px solid ${theme.colors.border}`,
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.hover
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: theme.colors.text,
              margin: 0
            }}>Recent Documents</h2>
          </div>
          
          {recentDocuments.length > 0 ? (
            <div style={{ padding: '1rem' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                    <th style={{
                      textAlign: 'left',
                      padding: '0.75rem',
                      color: theme.colors.textSecondary,
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase'
                    }}>Document</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '0.75rem',
                      color: theme.colors.textSecondary,
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase'
                    }}>Size</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '0.75rem',
                      color: theme.colors.textSecondary,
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase'
                    }}>Processed</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '0.75rem',
                      color: theme.colors.textSecondary,
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase'
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocuments.map((doc, index) => (
                    <tr 
                      key={doc.id}
                      style={{
                        borderBottom: index < recentDocuments.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.hover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{
                        padding: '1rem 0.75rem',
                        color: theme.colors.text
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.25rem' }}>📄</span>
                          <span style={{ fontWeight: '500' }}>{doc.name}</span>
                        </div>
                      </td>
                      <td style={{
                        padding: '1rem 0.75rem',
                        color: theme.colors.textSecondary,
                        fontSize: '0.9rem'
                      }}>{formatFileSize(doc.size)}</td>
                      <td style={{
                        padding: '1rem 0.75rem',
                        color: theme.colors.textSecondary,
                        fontSize: '0.9rem'
                      }}>{formatDate(doc.date)}</td>
                      <td style={{
                        padding: '1rem 0.75rem'
                      }}>
                        <button
                          onClick={() => {
                            // Navigate to results with stored document ID
                            navigate('/results', {
                              state: {
                                documentId: doc.id,
                                file: { name: doc.name }
                              }
                            });
                          }}
                          style={{
                            padding: '0.4rem 1rem',
                            backgroundColor: theme.colors.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            transition: 'opacity 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                          onMouseLeave={(e) => e.target.style.opacity = '1'}
                        >
                          View Results
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              padding: '4rem 2rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📭</div>
              <p style={{
                color: theme.colors.textSecondary,
                fontSize: '1rem',
                marginBottom: '1.5rem'
              }}>No documents processed yet</p>
              <button
                onClick={() => setShowUpload(true)}
                style={{
                  padding: '0.75rem 2rem',
                  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Upload Your First Document
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;