// hrshnk-56/gen-ai-h2s/Gen-AI-H2S-e4b2d161f93b4d62888c5bbaa8763f3ebd19ebc2/jurify-frontend/src/pages/LandingPageV2.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import DarkModeToggle from '../components/DarkModeToggle';
import FileUploadV2 from '../components/FileUploadV2';

const LandingPageV2 = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    // Process file
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
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
      setTimeout(() => {
        navigate('/results', { state: { file } });
      }, 1000);
    }
  };

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Simplification',
      description: 'Advanced neural networks break down complex legal language into plain English you can understand.',
      detail: 'Using BART and transformer models for accurate document analysis'
    },
    {
      icon: '⚡',
      title: 'Instant Processing',
      description: 'Upload your document and get results in seconds, not hours or days.',
      detail: '60-second average processing time for standard contracts'
    },
    {
      icon: '🎯',
      title: 'Clause Identification',
      description: 'Automatically highlights and explains important legal clauses in your document.',
      detail: 'Identifies liability, termination, payment, and confidentiality clauses'
    },
    {
      icon: '💬',
      title: 'Interactive Q&A',
      description: 'Ask questions about your document and get instant, contextual answers.',
      detail: 'Powered by semantic search and language understanding'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      transition: 'background-color 0.3s ease'
    }}>
      <DarkModeToggle />
      
      {/* Modern Sticky Navigation */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: isScrolled 
          ? (theme.isDarkMode ? 'rgba(31, 31, 31, 0.95)' : 'rgba(255, 255, 255, 0.95)')
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        borderBottom: isScrolled ? `1px solid ${theme.colors.border}` : 'none'
      }}>
        <nav style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span style={{ fontSize: '1.5rem' }}>⚖️</span>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              margin: 0
            }}>Jurify</h1>
            <span style={{
              backgroundColor: theme.isDarkMode ? '#374151' : '#f3f4f6',
              color: theme.colors.primary,
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>BETA</span>
          </div>

          {/* Navigation Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <a href="#features" style={{
              color: theme.colors.text,
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}>Features</a>
            <a href="#how-it-works" style={{
              color: theme.colors.text,
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}>How It Works</a>
            
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: theme.colors.hover,
                  borderRadius: '20px'
                }}>
                  <span style={{ fontSize: '1rem' }}>👤</span>
                  <span style={{
                    color: theme.colors.text,
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>{user?.name || user?.email?.split('@')[0]}</span>
                </div>
                <button onClick={logout} style={{
                  padding: '0.6rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#ef4444',
                  border: '2px solid #ef4444',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}>Sign Out</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} style={{
                  padding: '0.6rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: theme.colors.primary,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>Sign In</button>
                <button onClick={() => navigate('/login')} style={{
                  padding: '0.6rem 1.5rem',
                  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 15px rgba(139, 105, 20, 0.3)'
                }}>Get Started</button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section with Modern Gradient */}
      <section style={{
        padding: '4rem 2rem 6rem',
        background: theme.isDarkMode 
          ? 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, ${theme.isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)'} 0%, transparent 50%)`,
          pointerEvents: 'none'
        }}></div>

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Main Headline */}
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '1.5rem',
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            Understand Any Legal Document<br />In 60 Seconds
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: theme.colors.textSecondary,
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            Transform complex legal jargon into plain English with AI. 
            No legal expertise required.
          </p>

          {/* Upload Area - Premium Design */}
          <FileUploadV2 onFileUpload={handleFileUpload} />
        </div>
      </section>

      {/* Features Section with Interactive Cards */}
      <section id="features" style={{
        padding: '5rem 2rem',
        backgroundColor: theme.colors.backgroundSecondary
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: theme.colors.text,
              marginBottom: '1rem'
            }}>Why Choose Jurify?</h2>
            <p style={{
              fontSize: '1.1rem',
              color: theme.colors.textSecondary,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Cutting-edge AI technology meets user-friendly design to deliver the best legal document analysis experience
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveFeature(index)}
                style={{
                  padding: '2rem',
                  backgroundColor: theme.colors.cardBg,
                  borderRadius: '12px',
                  border: `1px solid ${activeFeature === index ? theme.colors.primary : theme.colors.border}`,
                  transition: 'all 0.3s ease',
                  transform: activeFeature === index ? 'translateY(-5px)' : 'translateY(0)',
                  boxShadow: activeFeature === index 
                    ? '0 20px 40px rgba(102, 126, 234, 0.2)'
                    : '0 5px 15px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '1rem'
                }}>{feature.icon}</div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.text,
                  marginBottom: '0.75rem'
                }}>{feature.title}</h3>
                <p style={{
                  color: theme.colors.textSecondary,
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>{feature.description}</p>
                <p style={{
                  fontSize: '0.85rem',
                  color: theme.colors.primary,
                  fontWeight: '500'
                }}>{feature.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Visual Process */}
      <section id="how-it-works" style={{
        padding: '5rem 2rem',
        backgroundColor: theme.colors.background
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: theme.colors.text,
              marginBottom: '1rem'
            }}>How It Works</h2>
            <p style={{
              fontSize: '1.1rem',
              color: theme.colors.textSecondary
            }}>Three simple steps to understanding your legal documents</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            position: 'relative'
          }}>
            {[
              { step: '1', title: 'Upload Document', desc: 'Drag and drop or select your legal document in PDF, DOC, or TXT format', icon: '📤' },
              { step: '2', title: 'AI Processing', desc: 'Our advanced AI analyzes and simplifies complex legal language instantly', icon: '🤖' },
              { step: '3', title: 'Get Results', desc: 'Review simplified text, highlighted clauses, and ask questions via chat', icon: '✅' }
            ].map((item, index) => (
              <div key={index} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 1.5rem',
                  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: 'white',
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    backgroundColor: theme.colors.cardBg,
                    color: theme.colors.primary,
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    border: `2px solid ${theme.colors.primary}`
                  }}>{item.step}</span>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.text,
                  marginBottom: '0.75rem'
                }}>{item.title}</h3>
                <p style={{
                  color: theme.colors.textSecondary,
                  lineHeight: '1.6'
                }}>{item.desc}</p>
                
                {index < 2 && (
                  <div style={{
                    position: 'absolute',
                    top: '40px',
                    right: '-1.5rem',
                    transform: 'translateX(50%)',
                    color: theme.colors.border,
                    fontSize: '2rem',
                    display: window.innerWidth > 768 ? 'block' : 'none'
                  }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        backgroundColor: theme.colors.headerBg,
        borderTop: `1px solid ${theme.colors.border}`,
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>⚖️</span>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              margin: 0
            }}>Jurify</h3>
          </div>
          <p style={{
            color: theme.colors.textSecondary,
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            AI-powered legal document simplification for hackathons
          </p>
          <p style={{ 
            color: theme.colors.textSecondary, 
            fontSize: '0.85rem'
          }}>
            ⚠️ This tool provides AI-powered simplification only and is not legal advice.
          </p>
          <p style={{
            marginTop: '1.5rem',
            color: theme.colors.textSecondary,
            fontSize: '0.85rem'
          }}>
            © 2025 Jurify Hackathon Project
          </p>
        </div>
      </footer>

      {/* Floating Animation Keyframes */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default LandingPageV2;