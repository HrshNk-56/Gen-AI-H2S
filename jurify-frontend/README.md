# 🏛️ Jurify - Legal Document Simplifier

> **Demystify Legal Documents with AI**

Jurify is a React-based web application that uses AI to simplify complex legal documents into plain English, highlight key clauses, and provide an interactive Q&A chatbot for document understanding.

## ✨ Features

### 1. 🏠 Landing Page / Upload
- **Drag & Drop File Upload**: Intuitive file upload interface
- **Multi-format Support**: PDF, DOC, DOCX, TXT files
- **Professional Branding**: Clean, modern UI with legal/AI theme
- **How It Works**: Visual explanation of the 3-step process

### 2. 📄 Document Simplification
- **Side-by-Side View**: Original vs Simplified content
- **Readability Score**: Visual representation of complexity reduction
- **Toggle Views**: Switch between original, simplified, or both
- **Processing Animation**: Engaging loading states

### 3. 🎯 Key Clause Highlighting
- **Automatic Detection**: AI identifies important legal clauses
- **Color-Coded Categories**: 
  - 🔒 **Blue** - Confidentiality
  - 📅 **Orange** - Termination
  - 📖 **Green** - Definitions
  - ⚠️ **Red** - Liability
  - 💰 **Purple** - Payment
- **Importance Levels**: High, medium, low priority indicators
- **Interactive Selection**: Click clauses to highlight in document

### 4. 🤖 AI Q&A Chatbot
- **Natural Language Queries**: Ask questions about the document
- **Plain English Answers**: Get explanations in simple terms
- **Suggested Questions**: Pre-built common queries
- **Real-time Chat**: Interactive conversation interface

### 5. 🔐 Optional Authentication
- **Guest Mode**: Perfect for demos and hackathon judging
- **Social Login**: Google and GitHub integration
- **Traditional Auth**: Email/password signup and login

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jurify-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
jurify-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── FileUpload.js    # Drag & drop file upload
│   │   ├── DocumentView.js  # Side-by-side document viewer
│   │   ├── ClauseHighlighter.js  # Key clause detection & highlighting
│   │   └── Chatbot.js       # AI Q&A chat interface
│   ├── pages/               # Main application pages
│   │   ├── LandingPage.js   # Homepage with upload
│   │   ├── LoginPage.js     # Authentication (optional)
│   │   └── ResultsPage.js   # Main results dashboard
│   ├── styles/              # CSS styling files
│   │   ├── App.css          # Global styles
│   │   ├── LandingPage.css  # Landing page styles
│   │   ├── ResultsPage.css  # Results page styles
│   │   └── [component].css  # Component-specific styles
│   ├── App.js               # Main app with routing
│   └── index.js            # Application entry point
├── public/
│   └── index.html          # HTML template
└── package.json            # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
- **Primary**: `#4f46e5` (Indigo)
- **Success**: `#10b981` (Emerald)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)
- **Clause Colors**:
  - Blue: `#3b82f6` (Confidentiality)
  - Green: `#10b981` (Definitions)
  - Orange: `#f59e0b` (Termination)
  - Red: `#ef4444` (Liability)
  - Purple: `#8b5cf6` (Payment)

### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', etc.)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## 🛠️ Development Workflow

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (⚠️ irreversible)

### Key Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "react-scripts": "5.0.1"
}
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: 1200px+ (Full sidebar layout)
- **Tablet**: 768px-1199px (Stacked layout)
- **Mobile**: <768px (Single column, touch-friendly)

## 🎯 Demo Features

Perfect for hackathon demonstrations:

1. **Guest Mode**: No signup required - judges can try immediately
2. **Mock Data**: Pre-loaded sample legal document for instant demo
3. **Interactive Elements**: All features work without backend integration
4. **Visual Feedback**: Clear loading states and animations
5. **Professional UI**: Polished interface that impresses judges

## 🔮 Future Enhancements

- **Backend Integration**: Connect to real AI/ML services
- **Document Export**: Download simplified versions
- **Multi-language Support**: International legal documents
- **Template Library**: Pre-built document templates
- **Collaboration**: Share and collaborate on document analysis
- **Analytics**: Usage tracking and insights

## 🚀 Deployment

### Production Build
```bash
npm run build
```

The `build` folder contains optimized files ready for deployment to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React and modern web technologies
- Designed for legal document accessibility
- Created for hackathon demonstration

---

**Note**: This is a frontend prototype with mock data. For production use, integrate with actual AI/ML services for document processing and analysis.

## 📞 Support

For questions or support, please create an issue in the repository or contact the development team.

**Happy Coding! 🚀⚖️**