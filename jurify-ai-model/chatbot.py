# ===============================
# 1. Install necessary packages
# ===============================
!pip install torch transformers sentence-transformers spacy PyPDF2 python-docx reportlab nltk --quiet
!python -m spacy download en_core_web_sm

# ===============================
# 2. Imports
# ===============================
import os, re, io
import torch
from transformers import BartForConditionalGeneration, BartTokenizer
from sentence_transformers import SentenceTransformer
import spacy
from PyPDF2 import PdfReader
from docx import Document
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import red, orange, yellow, toColor
import nltk
nltk.download('punkt', quiet=True)  # fixed tokenizer issue
from nltk.tokenize import sent_tokenize

# ===============================
# 3. Load models
# ===============================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Summarization
summarizer_model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn").to(device)
summarizer_tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")

# NER
nlp = spacy.load("en_core_web_sm")

# Chatbot embeddings
embed_model = SentenceTransformer('all-MiniLM-L6-v2')

# ===============================
# 4. Helper functions
# ===============================

# 4.1 Load document
def load_document(file_path):
    ext = file_path.split('.')[-1].lower()
    text = ""
    if ext == "pdf":
        reader = PdfReader(file_path)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    elif ext in ["docx", "doc"]:
        doc = Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    elif ext == "txt":
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
    else:
        raise ValueError("Unsupported file format")
    return text

# 4.2 Chunked summarization
def simplify_document(text, max_chunk_words=2000):
    words = text.split()
    chunks = [" ".join(words[i:i+max_chunk_words]) for i in range(0, len(words), max_chunk_words)]
    simplified = []
    for chunk in chunks:
        inputs = summarizer_tokenizer(chunk, return_tensors="pt", truncation=True, max_length=1024).to(device)
        summary_ids = summarizer_model.generate(**inputs, max_length=512, min_length=50, length_penalty=2.0)
        summary = summarizer_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        simplified.append(summary)
    return "\n\n".join(simplified)

# 4.3 Highlight Important words (NER)
def highlight_important(text):
    doc = nlp(text)
    highlights = {}
    color_cycle = ["red", "orange", "yellow"]
    idx = 0
    for ent in doc.ents:
        highlights[ent.text] = color_cycle[idx % len(color_cycle)]
        idx +=1
    return highlights

# 4.4 Save PDF with readable highlights
def save_pdf_with_highlights(pdf_path, text, highlights_dict):
    styles = getSampleStyleSheet()
    normal_style = styles["Normal"]
    color_map = {"red": red, "orange": orange, "yellow": yellow}

    doc = SimpleDocTemplate(pdf_path, pagesize=letter)
    story = []

    paragraphs = text.split("\n\n")
    for para in paragraphs:
        words = para.split()
        line_fragments = ""
        for word in words:
            highlight_color = highlights_dict.get(word, None)
            if highlight_color:
                try:
                    hex_color = toColor(color_map[highlight_color]).hexval()
                    line_fragments += f'<font backColor="{hex_color}">{word}</font> '
                except:
                    line_fragments += word + " "
            else:
                line_fragments += word + " "
        story.append(Paragraph(line_fragments, normal_style))
        story.append(Spacer(1,4))
    doc.build(story)
    print(f"PDF saved at: {pdf_path}")

# 4.5 Save DOCX with highlights
def save_docx_with_highlights(docx_path, text, highlights_dict):
    doc = Document()
    paragraphs = text.split("\n\n")
    for para in paragraphs:
        p = doc.add_paragraph()
        words = para.split()
        for word in words:
            run = p.add_run(word + " ")
            if word in highlights_dict:
                color_name = highlights_dict[word]
                run.font.highlight_color = {
                    "red": 7,
                    "yellow": 5,
                    "orange": 3
                }.get(color_name, None)
    doc.save(docx_path)
    print(f"DOCX saved at: {docx_path}")

# 4.6 Safe sentence tokenizer (fixed)
def safe_sent_tokenize(text):
    try:
        return sent_tokenize(text)
    except:
        # fallback: split by punctuation
        return re.split(r'(?<=[.!?]) +', text)

# 4.7 Chatbot Query
def chatbot_query(text, user_question, top_k=5):
    try:
        sentences = safe_sent_tokenize(text)
        sentence_embeddings = embed_model.encode(sentences)
        question_embedding = embed_model.encode([user_question])
        similarities = torch.nn.functional.cosine_similarity(
            torch.tensor(question_embedding), torch.tensor(sentence_embeddings)
        )
        top_idx = torch.topk(similarities, k=min(top_k, len(sentences))).indices
        answer = " ".join([sentences[i] for i in top_idx])
        return answer
    except Exception as e:
        return f"No relevant information found. ({str(e)})"

# ===============================
# 5. Main execution example
# ===============================
from google.colab import files
uploaded = files.upload()
file_path = list(uploaded.keys())[0]

# Load and simplify
doc_text = load_document(file_path)
simplified_text = simplify_document(doc_text)

# Highlight
highlights = highlight_important(simplified_text)

# Save outputs
save_docx_with_highlights("simplified_highlighted.docx", simplified_text, highlights)
save_pdf_with_highlights("simplified_highlighted.pdf", simplified_text, highlights)

# Chatbot interactive
print("\n--- Chatbot Example ---")
while True:
    user_q = input("Enter your question (type 'exit' to quit): ")
    if user_q.lower() == "exit":
        break
    answer = chatbot_query(simplified_text, user_q)
    print("Chatbot Answer:", answer)