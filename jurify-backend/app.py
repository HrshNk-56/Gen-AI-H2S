print("Starting Jurify backend...")
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import torch
from transformers import BartForConditionalGeneration, BartTokenizer
from sentence_transformers import SentenceTransformer
import spacy
from PyPDF2 import PdfReader
from docx import Document
import nltk
from nltk.tokenize import sent_tokenize
import re
import base64
import tempfile

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://localhost:3000"])

# Download required NLTK data
try:
    nltk.download('punkt', quiet=True)
    nltk.download('punkt_tab', quiet=True)
except:
    pass

# Load models (do this once when server starts)
print("Loading models...")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Summarization
summarizer_model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn").to(device)
summarizer_tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")

# NER
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Chatbot embeddings
embed_model = SentenceTransformer('all-MiniLM-L6-v2')

print("Models loaded successfully!")

# Store document data in memory (in production, use a database)
document_store = {}

# Helper functions
def load_document(file):
    """Load document from file upload"""
    text = ""
    file_extension = file.filename.split('.')[-1].lower()
    
    # Save temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_extension}") as tmp_file:
        file.save(tmp_file.name)
        temp_path = tmp_file.name
    
    try:
        if file_extension == "pdf":
            reader = PdfReader(temp_path)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        elif file_extension in ["docx", "doc"]:
            doc = Document(temp_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        elif file_extension == "txt":
            with open(temp_path, "r", encoding="utf-8") as f:
                text = f.read()
        else:
            raise ValueError("Unsupported file format")
    finally:
        # Clean up temp file
        os.unlink(temp_path)
    
    return text

def simplify_document(text, max_chunk_words=500):
    """Simplify document text using BART"""
    words = text.split()
    chunks = [" ".join(words[i:i+max_chunk_words]) for i in range(0, len(words), max_chunk_words)]
    simplified = []
    
    for chunk in chunks[:5]:  # Limit to first 5 chunks for demo
        if not chunk.strip():
            continue
        inputs = summarizer_tokenizer(chunk, return_tensors="pt", truncation=True, max_length=1024).to(device)
        summary_ids = summarizer_model.generate(**inputs, max_length=200, min_length=50, length_penalty=2.0)
        summary = summarizer_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        simplified.append(summary)
    
    return "\n\n".join(simplified)

def extract_clauses(text):
    """Extract important clauses from document"""
    doc = nlp(text[:10000])  # Limit for performance
    clauses = []

    # Common legal terms to look for
    legal_terms = ["confidential", "termination", "payment", "liability", "warranty",
                   "indemnification", "jurisdiction", "force majeure", "dispute"]

    sentences = sent_tokenize(text)[:20]  # First 20 sentences

    for i, sent in enumerate(sentences):
        sent_lower = sent.lower()
        for term in legal_terms:
            if term in sent_lower:
                clause_type = term.capitalize()
                clauses.append({
                    "id": i + 1,
                    "type": clause_type,
                    "content": sent[:200],
                    "simplified": simplify_sentence(sent),
                    "importance": "high" if term in ["liability", "termination", "payment"] else "medium"
                })
                break

    return clauses[:5]  # Return max 5 clauses

def simplify_sentence(sentence):
    """Simplify a single sentence"""
    try:
        inputs = summarizer_tokenizer(sentence, return_tensors="pt", truncation=True, max_length=512).to(device)
        summary_ids = summarizer_model.generate(**inputs, max_length=100, min_length=20)
        return summarizer_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    except:
        return sentence[:100] + "..."

def safe_sent_tokenize(text):
    """Safe sentence tokenization"""
    try:
        return sent_tokenize(text)
    except:
        return re.split(r'(?<=[.!?]) +', text)

def chatbot_query(text, user_question, top_k=3):
    """Answer questions about the document"""
    try:
        sentences = safe_sent_tokenize(text)[:50]  # Limit sentences
        sentence_embeddings = embed_model.encode(sentences)
        question_embedding = embed_model.encode([user_question])

        similarities = torch.nn.functional.cosine_similarity(
            torch.tensor(question_embedding), torch.tensor(sentence_embeddings)
        )

        top_idx = torch.topk(similarities, k=min(top_k, len(sentences))).indices
        answer = " ".join([sentences[i] for i in top_idx])
        return answer
    except Exception as e:
        return f"I couldn't find specific information about that in the document."

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Jurify backend is running"})

@app.route('/api/upload', methods=['POST'])
def upload_document():
    """Handle document upload and processing"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        # Generate document ID
        import uuid
        doc_id = str(uuid.uuid4())

        # Load and process document
        print(f"Processing document: {file.filename}")
        original_text = load_document(file)
        print(f"Original text length: {len(original_text)}")
        print(f"Original text: {original_text[:500]}...")

        if not original_text or len(original_text.strip()) < 100:
            return jsonify({"error": "Document is empty or too short"}), 400

        print("Simplifying document...")
        simplified_text = simplify_document(original_text)

        print("Extracting clauses...")
        clauses = extract_clauses(original_text)

        # Store in memory
        document_store[doc_id] = {
            "original": original_text[:5000],  # Store first 5000 chars
            "simplified": simplified_text,
            "clauses": clauses,
            "filename": file.filename
        }

        return jsonify({
            "success": True,
            "documentId": doc_id,
            "data": {
                "original": original_text[:2000] + ("..." if len(original_text) > 2000 else ""),
                "simplified": simplified_text,
                "clauses": clauses
            }
        })

    except Exception as e:
        print(f"Error processing document: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chatbot queries"""
    try:
        data = request.json
        document_id = data.get('documentId')
        question = data.get('question')

        if not document_id or not question:
            return jsonify({"error": "Missing documentId or question"}), 400

        if document_id not in document_store:
            return jsonify({"error": "Document not found"}), 404

        doc_data = document_store[document_id]

        # Use simplified text for chatbot
        answer = chatbot_query(doc_data['simplified'], question)

        return jsonify({
            "success": True,
            "answer": answer
        })

    except Exception as e:
        print(f"Chat error: {str(e)}")
        return jsonify({"error": "Failed to process question"}), 500

@app.route('/api/document/<doc_id>', methods=['GET'])
def get_document(doc_id):
    """Get processed document by ID"""
    if doc_id not in document_store:
        return jsonify({"error": "Document not found"}), 404

    return jsonify({
        "success": True,
        "data": document_store[doc_id]
    })

if __name__ == '__main__':
    app.run(debug=True, port=8000, use_reloader=False)