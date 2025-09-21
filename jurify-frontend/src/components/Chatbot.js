// src/components/Chatbot.js
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Chatbot = ({ documentId, documentText }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen && messages.length === 0) {
            setMessages([{
                sender: 'bot',
                text: `Hello! I have the context of your document. Ask me anything about it.`
            }]);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = { sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);

        // Use the simplified text for context and send only the user's question
        const contextText = documentText || '';
        const question = inputValue;

        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documentId, question: question, context: contextText }),
            });
            const data = await response.json();
            const botMessage = { sender: 'bot', text: data.answer || "Sorry, I couldn't find an answer." };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const chatIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="28" height="28">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457.167-.92.22-1.392h.028a2.25 2.25 0 01-1.012-2.248c.362-1.02.732-2.024 1.138-2.962C7.153 9.493 8.525 8.25 12 8.25c4.97 0 9 3.694 9 8.25z" />
        </svg>
    );

    const closeIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="28" height="28">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
            {isOpen && (
                <div className="chatbot-window" style={{
                    width: '350px',
                    height: '500px',
                    backgroundColor: theme.colors.cardBg,
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: `1px solid ${theme.colors.border}`,
                    marginBottom: '1rem'
                }}>
                    <header style={{
                        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                        color: 'white',
                        padding: '1rem',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                    }}>
                        Jurify AI Assistant
                    </header>
                    <div className="chatbot-messages" style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                marginBottom: '1rem',
                                display: 'flex',
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    maxWidth: '80%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '18px',
                                    backgroundColor: msg.sender === 'user' ? theme.colors.primary : theme.colors.hover,
                                    color: msg.sender === 'user' ? 'white' : theme.colors.text
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '18px',
                                    backgroundColor: theme.colors.hover,
                                    color: theme.colors.text
                                }}>
                                    <span className="typing-indicator"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} style={{
                        padding: '1rem',
                        borderTop: `1px solid ${theme.colors.border}`,
                        display: 'flex',
                        gap: '0.5rem'
                    }}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask a question..."
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: '8px',
                                backgroundColor: theme.colors.inputBg,
                                color: theme.colors.text,
                                fontSize: '1rem'
                            }}
                        />
                        <button type="submit" style={{
                            padding: '0.75rem',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: theme.colors.primary,
                            color: 'white',
                            cursor: 'pointer'
                        }}>
                            Send
                        </button>
                    </form>
                </div>
            )}
            <button onClick={toggleChat} style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: 'none',
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                float: 'right'
            }}>
                {isOpen ? closeIcon : chatIcon}
            </button>
        </div>
    );
};

export default Chatbot;