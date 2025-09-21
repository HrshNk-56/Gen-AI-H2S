# Jurify Backend - AI Document Processing API

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip package manager
- At least 4GB RAM (for ML models)

### Installation

1. **Create virtual environment**
```bash
cd jurify-backend
python -m venv venv
```

2. **Activate virtual environment**

Windows (PowerShell):
```powershell
.\venv\Scripts\Activate.ps1
```

Windows (Command Prompt):
```cmd
.\venv\Scripts\activate
```

Mac/Linux:
```bash
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Download spaCy language model**
```bash
python -m spacy download en_core_web_sm
```

5. **Run the server**
```bash
python app.py
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status

### Upload Document
- **POST** `/api/upload`
- Body: multipart/form-data with `file` field
- Accepts: PDF, DOC, DOCX, TXT
- Returns: Processed document with original, simplified text and extracted clauses

### Chat with Document
- **POST** `/api/chat`
- Body: JSON with `documentId` and `question`
- Returns: AI-generated answer based on document content

### Get Document
- **GET** `/api/document/<doc_id>`
- Returns: Stored document data

## 🔧 Troubleshooting

### Memory Issues
If you encounter memory errors, try:
1. Reduce `max_chunk_words` in `simplify_document()` function
2. Limit the number of chunks processed
3. Use CPU instead of GPU

### Model Loading Issues
First run may take time to download models (~1-2GB). Ensure stable internet connection.

### Port Already in Use
If port 5000 is taken, change it in the last line of `app.py`:
```python
app.run(debug=True, port=5001)  # Change to any available port
```

## 📝 Notes
- This is a development server. For production, use a WSGI server like Gunicorn
- Document processing may take 30-60 seconds depending on document size
- Models are loaded once at startup for better performance

## 🛠️ Development
To add new features:
1. Add new routes in `app.py`
2. Update CORS settings if needed
3. Restart the server to apply changes

---
Built for Jurify - Demystifying Legal Documents with AI