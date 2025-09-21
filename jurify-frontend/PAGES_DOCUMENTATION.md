# Jurify Pages Documentation & Application Flow

## 📍 Page Routes Overview

| Route | Page Component | Access | Purpose |
|-------|---------------|--------|---------|
| `/login` | LoginPage | Public | User authentication (login/signup) |
| `/` | LandingPage | Protected | Main page with file upload |
| `/results` | ResultsPage | Protected | Document analysis results |

---

## 🔄 Application Flow Diagram

```
┌─────────────┐
│   START     │
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  App Loads  │
└─────┬───────┘
      │
      ▼
┌─────────────────────────────┐
│  User Authenticated?        │
└─────┬───────────┬───────────┘
      │ NO        │ YES
      ▼           ▼
┌──────────┐  ┌──────────────┐
│LoginPage │  │ LandingPage  │
└─────┬────┘  └──────┬───────┘
      │              │
      │              ▼
      │         ┌──────────────┐
      │         │Upload File   │
      │         └──────┬───────┘
      │                │
      └────────────────▼
                 ┌──────────────┐
                 │ ResultsPage  │
                 └──────────────┘
```

---

## 📄 Page Details

### 1. **LoginPage** (`/login`)

**Location**: `src/pages/LoginPage.js`

**Purpose**: Entry point for unauthenticated users

**Features**:
- Login/Signup toggle tabs
- Email and password authentication
- Social login buttons (Google, GitHub)
- Guest mode for quick access
- Form validation and error handling

**User Actions**:
1. **Login**: Enter credentials → Redirects to LandingPage (`/`)
2. **Sign Up**: Create new account → Redirects to LandingPage (`/`)
3. **Guest Mode**: Skip authentication → Redirects to LandingPage (`/`)
4. **Social Login**: (UI ready, backend integration pending)

**Components Used**:
- Uses `AuthContext` for authentication
- No child components

**State Management**:
- `isLogin` - Toggle between login/signup
- `formData` - User input (email, password, confirmPassword)
- `error` - Error messages
- `loading` - Form submission state

---

### 2. **LandingPage** (`/`)

**Location**: `src/pages/LandingPage.js`

**Purpose**: Main application entry after authentication

**Features**:
- Navigation header with user info
- File upload area
- Supported formats display
- Processing indicator
- Logout functionality

**User Actions**:
1. **Upload File**: Select/drag document → Redirects to ResultsPage (`/results`)
2. **Logout**: Click logout → Redirects to LoginPage (`/login`)
3. **Navigation**: Access About/Contact sections (anchors)

**Components Used**:
- `FileUpload` - Drag-and-drop file upload component
- Uses `AuthContext` for user info and logout

**State Management**:
- `uploadedFile` - Currently selected file
- Receives `user` from AuthContext

---

### 3. **ResultsPage** (`/results`)

**Location**: `src/pages/ResultsPage.js`

**Purpose**: Display document analysis results

**Features**:
- Side-by-side document view (original vs simplified)
- View toggle controls (original/both/simplified)
- Clause highlighting sidebar
- AI chatbot for Q&A
- Download options (TXT, HTML, JSON)
- Upload new document button

**User Actions**:
1. **Toggle Views**: Switch between document display modes
2. **Select Clauses**: Click to highlight specific clauses
3. **Chat with AI**: Ask questions about the document
4. **Download**: Export simplified document in various formats
5. **New Upload**: Return to LandingPage (`/`)

**Components Used**:
- `DocumentView` - Document display component
- `ClauseHighlighter` - Clause analysis component
- `Chatbot` - AI Q&A interface
- Uses `downloadUtils` for export functionality

**State Management**:
- `activeView` - Current document view mode
- `selectedClause` - Currently highlighted clause
- `documentData` - Processed document content
- `loading` - Processing state
- `showDownloadMenu` - Download dropdown visibility

---

## 🔐 Authentication Flow

### Protected Routes
Routes wrapped with `ProtectedRoute` component:
- `/` (LandingPage)
- `/results` (ResultsPage)

### Public Routes
Accessible without authentication:
- `/login` (LoginPage)

### Authentication States

```javascript
// User is logged in
{
  user: {
    id: 1,
    email: "user@example.com",
    name: "John Doe",
    token: "jwt-token"
  },
  isAuthenticated: true
}

// Guest user
{
  user: {
    id: "guest",
    email: "guest@jurify.com",
    name: "Guest User",
    isGuest: true
  },
  isAuthenticated: true
}

// Not authenticated
{
  user: null,
  isAuthenticated: false
}
```

---

## 🗂️ Component Hierarchy

```
App.js
├── AuthProvider (Context wrapper)
│   ├── Routes
│   │   ├── /login → LoginPage
│   │   ├── / → ProtectedRoute → LandingPage
│   │   │   └── FileUpload
│   │   └── /results → ProtectedRoute → ResultsPage
│   │       ├── DocumentView
│   │       ├── ClauseHighlighter
│   │       └── Chatbot
```

---

## 📁 File Structure Reference

```
src/
├── pages/
│   ├── LoginPage.js      # Authentication page
│   ├── LandingPage.js    # Main upload page
│   └── ResultsPage.js    # Analysis results
│
├── components/
│   ├── FileUpload.js     # Used in LandingPage
│   ├── DocumentView.js   # Used in ResultsPage
│   ├── ClauseHighlighter.js # Used in ResultsPage
│   ├── Chatbot.js        # Used in ResultsPage
│   └── ProtectedRoute.js # Wraps protected pages
│
├── contexts/
│   └── AuthContext.js    # Used by all pages
│
├── utils/
│   └── downloadUtils.js  # Used in ResultsPage
│
└── App.js               # Main routing configuration
```

---

## 🔄 User Journey Examples

### First-Time User
1. Lands on `/login` (redirected from protected route)
2. Creates account or uses guest mode
3. Redirected to `/` (LandingPage)
4. Uploads document
5. Redirected to `/results` with analysis
6. Downloads simplified version
7. Can upload new document or logout

### Returning User
1. Lands on `/` (if still authenticated)
2. Sees welcome message with their name
3. Uploads document directly
4. Views results at `/results`
5. Uses chatbot for questions
6. Downloads document

### Guest User (Hackathon Judge)
1. Lands on `/login`
2. Clicks "Continue as Guest"
3. Immediately redirected to `/`
4. Full access to all features
5. No persistent data after logout

---

## 🎯 Navigation Summary

| From | To | Trigger |
|------|-----|---------|
| `/login` | `/` | Successful login/signup/guest |
| `/` | `/results` | File upload |
| `/results` | `/` | "Upload New Document" button |
| Any protected | `/login` | Logout button |
| Any protected | `/login` | Not authenticated |

---

## 📝 Notes

- **Mock Data**: ResultsPage currently uses mock data for demonstration
- **File State**: File data passed via React Router's location state
- **Persistence**: User authentication persisted in localStorage
- **Error Handling**: Each page has error states and user feedback
- **Responsive**: All pages adapt to mobile/tablet/desktop views

---

## 🚀 Quick Testing Guide

1. **Test Login Flow**:
   - Navigate to `http://localhost:3000`
   - Should redirect to `/login`
   - Use guest mode or create account
   - Should redirect to `/`

2. **Test File Upload**:
   - On LandingPage (`/`)
   - Click "Choose File" or drag a document
   - Should navigate to `/results`

3. **Test Results Page**:
   - View toggle buttons work
   - Download menu appears on click
   - Chatbot responds to input
   - "Upload New Document" returns to `/`

4. **Test Logout**:
   - Click logout button
   - Should clear session and redirect to `/login`

---

*Last Updated: January 2025*