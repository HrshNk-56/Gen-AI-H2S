import React, { useState } from 'react';
import '../styles/Chatbot.css';

const Chatbot = ({ documentData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm here to help you understand this legal document. Ask me anything about the clauses, terms, or what they mean in plain English.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Mock responses for demonstration
  const getMockResponse = (question) => {
    const responses = {
      'termination': "According to the termination clause, this agreement ends on a specific date or when either party gives written notice. Even after the agreement ends, Company B must keep the confidential information secret for 5 more years.",
      'confidential': "Confidential information includes business secrets, customer lists, product plans, software, finances, and other business details. Company B cannot share this information with anyone without written permission from Company A.",
      'duration': "The confidentiality obligations last for 5 years after the agreement ends. This means even if the main agreement is terminated, the receiving party must still keep the information secret for that period.",
      'penalty': "This document doesn't specify penalties for breaking the agreement. However, violating a confidentiality agreement can typically result in legal action and potential damages.",
      'default': "I can help explain any part of this document. Try asking about specific clauses like 'What does the termination clause mean?' or 'What information is considered confidential?'"
    };

    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('termination') || lowerQuestion.includes('end')) {
      return responses.termination;
    } else if (lowerQuestion.includes('confidential') || lowerQuestion.includes('secret')) {
      return responses.confidential;
    } else if (lowerQuestion.includes('duration') || lowerQuestion.includes('how long')) {
      return responses.duration;
    } else if (lowerQuestion.includes('penalty') || lowerQuestion.includes('violation')) {
      return responses.penalty;
    } else {
      return responses.default;
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: getMockResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What does the termination clause mean?",
    "What information is considered confidential?",
    "How long do I need to keep information secret?",
    "What happens if I violate this agreement?"
  ];

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <h3>🤖 Ask AI About This Document</h3>
        <p>Get plain English explanations</p>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              <p>{message.content}</p>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot typing">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="suggested-questions">
        <p className="suggestions-label">Try asking:</p>
        {suggestedQuestions.map((question, index) => (
          <button 
            key={index}
            className="suggestion-btn"
            onClick={() => setInputValue(question)}
          >
            {question}
          </button>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about this document..."
          className="message-input"
        />
        <button 
          onClick={handleSendMessage}
          className="send-button"
          disabled={!inputValue.trim() || isTyping}
        >
          <span>📤</span>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;