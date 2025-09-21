# ⚖️ Jurify - AI Legal Document Simplifier

Jurify is a modern, full-stack web application designed to demystify complex legal documents. Using a powerful AI backend and a responsive React frontend, users can upload documents in various formats (PDF, DOCX, TXT) and receive a simplified, easy-to-understand version in seconds. The application also features an interactive AI chatbot that can answer specific questions about the uploaded document, providing context-aware responses.

## ✨ Core Features

-   **AI-Powered Simplification**: Leverages the `facebook/bart-large-cnn` model to summarize and translate dense legal text into plain English.
-   **Interactive Q&A Chatbot**: An integrated chatbot, powered by the `all-MiniLM-L6-v2` sentence transformer, allows users to ask specific questions about their document.
-   **Side-by-Side Document Viewer**: A clean, user-friendly interface that displays the original document and its simplified version next to each other for easy comparison.
-   **Multi-Format File Upload**: Users can upload `.pdf`, `.docx`, and `.txt` files. The original document is rendered directly in the browser for reference.
-   **Downloadable Summaries**: Users can download the simplified document as a `.pdf` or `.docx` file.
-   **Responsive Design & Dark Mode**: The UI is fully responsive and includes a theme-aware dark mode for user comfort.

## 🚀 Getting Started

To run this project, you need to start both the backend server and the frontend development server in separate terminals.

### Prerequisites

-   Node.js (v14 or higher)
-   Python (v3.8 or higher) & `pip`
-   A virtual environment tool for Python (e.g., `venv`)

### Backend Setup (`jurify-backend`)

1.  **Navigate to the backend directory:**
    ```bash
    cd jurify-backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # Create the environment
    python -m venv venv

    # Activate on Windows (PowerShell)
    .\venv\Scripts\Activate.ps1

    # Activate on macOS/Linux
    source venv/bin/activate
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Flask server:**
    ```bash
    python app.py
    ```
    The backend will now be running at `http://localhost:5000`.

### Frontend Setup (`jurify-frontend`)

1.  **Navigate to the frontend directory:**
    ```bash
    cd jurify-frontend
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Start the React development server:**
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`. For HTTPS, see the `package.json` file.

## 🛠️ Technology Stack

### Frontend (`jurify-frontend`)

-   **Framework**: React 18
-   **Routing**: React Router
-   **Styling**: Inline CSS & global `App.css` with responsive design
-   **Document Rendering**:
    -   `react-pdf`: For rendering `.pdf` files.
    -   `mammoth`: For converting `.docx` files to HTML.
-   **File Downloads**: `jspdf`, `docx`, `file-saver`

### Backend (`jurify-backend`)

-   **Framework**: Flask
-   **CORS**: `flask-cors` to handle requests from the frontend.
-   **AI & Machine Learning**:
    -   `transformers`: For accessing the BART summarization model.
    -   `sentence-transformers`: For creating embeddings for the chatbot Q&A.
    -   `spacy`: For Named Entity Recognition (NER) to highlight key terms.
    -   `torch`: The underlying deep learning framework.
-   **Document Parsing**: `PyPDF2`, `python-docx`

---
