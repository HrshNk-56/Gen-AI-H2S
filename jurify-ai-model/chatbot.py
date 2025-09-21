import os
import shutil
import uuid
import nltk
from nltk.tokenize import sent_tokenize
import spacy
import torch
from transformers import pipeline
from sentence_transformers import SentenceTransformer, util
from PyPDF2 import PdfReader
from docx.shared import RGBColor
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# =========================
# Setup NLP models and downloads
# =========================
nltk.download('punkt', quiet=True)
nltk.download('punkt')
nltk.download('punkt_tab')
spacy.cli.download("en_core_web_sm")
nlp = spacy.load("en_core_web_sm")

summarizer = pipeline("summarization", model="facebook/bart-large-cnn", device=0 if torch.cuda.is_available() else -1)
embedder = SentenceTransformer('all-MiniLM-L6-v2')

app = FastAPI()

# Use environment variable ALLOWED_ORIGINS for CORS or fallback to placeholder
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    origins = [origin.strip() for origin in allowed_origins_env.split(",")]
else:
    origins = ["https://your.production.frontend"]  # Change this to your frontend domain on production

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Expanded legal keywords list
# =========================
legal_keywords = [
    # Original legal terms
    "agreement", "contract", "memorandum of understanding", "mou", "parties", "title of the agreement", "scope of work",
    "payment terms", "deliverables", "recitals", "definitions", "representations and warranties", "confidentiality", "assignment",
    "indemnification", "arbitration", "dispute resolution", "governing law", "jurisdiction", "force majeure", "termination",
    "survival", "notices", "amendment", "severability", "waiver", "entire agreement", "remedies", "liability", "limitation of liability",
    "compliance", "binding effect", "assignment", "intellectual property", "licence", "licensing", "payment schedule", "independent contractor",
    "performance", "default", "material breach", "non-competition", "non-compete", "non-solicitation", "solicitation", "duty of care",
    "time is of the essence", "further assurances", "counterparts", "shall", "must", "is required to", "undertakes to", "agrees to",
    "is not permitted to", "is not allowed", "shall not", "must not", "may", "discretion", "at its option", "reasonable efforts",
    "best efforts", "commercially reasonable", "sole discretion", "breach", "liable", "damages", "claims", "indemnify", "injunction",
    "injunctive relief", "consequential damages", "fine", "remedy", "notice of default", "cure period", "covenant", "restitution",
    "revoke", "terminate", "with immediate effect", "ipso facto", "mutatis mutandis", "ex parte", "prima facie", "inter alia",
    "bona fide", "de facto", "de jure", "ultra vires", "sub judice", "ad hoc", "per se", "ab initio", "quasi", "in rem", "in personam",
    "pro rata", "res judicata", "mens rea", "plaintiff", "defendant", "respondent", "petitioner", "appellant", "appellee", "amicus curiae",
    "affidavit", "plea", "summons", "writ", "motion", "discovery", "interrogatory", "deposition", "cross-examination", "fir", "sc", "hc",
    "llb", "llm", "ipc", "crpc", "cpc", "adr", "pil", "wpa", "nclt", "nclat", "sebi", "it act", "cji", "rti", "nia", "nsa", "afspa",
    "dv act", "ncr", "bba", "ba", "coi", "ncrb", "rera", "eow", "itat", "gst", "sarfaesi", "ndps", "csr", "mou", "ibc", "cic", "dspe",
    "bod", "clat", "mm", "acb", "ni act", "jm", "ncdrc", "fema", "pmla", "public interest", "regulatory", "compliance", "subject to",
    "pursuant to", "statutory", "bylaws", "hereinafter", "heretofore", "notwithstanding", "provided that", "forthwith", "without prejudice",
    "consideration", "material", "good faith", "warrant", "authorised", "unlawful", "void", "voidable", "estoppel", "subrogation",
    "fiduciary", "proxy", "guarantor", "guarantee", "surety", "bailment", "lien", "mortgage", "deed", "trust", "estate", "probate",
    "executor", "testator", "beneficiary", "bequest", "bequeath", "grantor", "donee", "acceptor", "endorsee", "payee", "right of first refusal",
    "first right", "exclusive", "nonexclusive", "obligation", "duty", "instrument", "statute", "enforceable", "binding", "subject to", "pursuant to",
    # Added legal keywords + 50 terms
    "arbitration clause", "force majeure event", "confidential information", "non-disclosure", "independent contractor",
    "covenant not to compete", "intellectual property rights", "representations", "warranties", "licensee",
    "licensor", "governing jurisdiction", "severability clause", "notice period", "termination for convenience",
    "material adverse effect", "entire agreement clause", "dispute settlement", "liquidated damages", "remedies available",
    "penalty clause", "default interest", "binding contract", "good faith negotiations", "third party beneficiary",
    "assignment and delegation", "force majeure clause", "contract extension", "indemnity", "breach notice",
    "conflict resolution", "non-waiver", "time is of the essence", "counterparts clause", "no oral modification",
    "assignment provision", "limitation of damages", "collateral warranties", "succession rights", "third party rights",
    "licensing agreement", "delivery obligations", "contractual obligation", "performance standards", "termination notice",
    "payment obligations", "remuneration", "exclusive rights", "non-exclusive license", "contractual warranties", "liability cap"
]

def load_document(filepath):
    ext = filepath.lower().split(".")[-1]
    text = ""
    if ext == "pdf":
        reader = PdfReader(filepath)
        for page in reader.pages:
            if page.extract_text():
                text += page.extract_text() + "\n"
    elif ext == "docx":
        from docx import Document
        doc = Document(filepath)
        for para in doc.paragraphs:
            text += para.text + "\n"
    elif ext == "txt":
        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read()
    else:
        raise ValueError("Unsupported file type. Use pdf, docx, or txt.")
    return text.strip()

def simplify_text(text, max_chunk=600):
    sentences = sent_tokenize(text)
    chunks, chunk, count = [], [], 0
    for sent in sentences:
        count += len(sent.split())
        if count > max_chunk:
            chunks.append(" ".join(chunk))
            chunk, count = [sent], len(sent.split())
        else:
            chunk.append(sent)
    if chunk:
        chunks.append(" ".join(chunk))
    summaries = summarizer(chunks, max_length=150, min_length=40, do_sample=False)
    simplified_text = " ".join([s["summary_text"].strip() for s in summaries])
    simplified_text = " ".join(sent_tokenize(simplified_text))
    return simplified_text

def highlight_text(text):
    doc = nlp(text)
    sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]

    highlighted = []
    for sent in sentences:
        s_lower = sent.lower()
        color = None
        for keyword in legal_keywords:
            if keyword in s_lower:
                if any(k in s_lower for k in ["shall", "must", "required", "liability", "indemnification", "material breach", "termination"]):
                    color = RGBColor(255, 0, 0)       # Red
                elif any(k in s_lower for k in ["should", "may", "discretion", "remedy"]):
                    color = RGBColor(255, 165, 0)     # Orange
                else:
                    color = RGBColor(255, 255, 0)     # Yellow
                break
        highlighted.append((sent, color))
    return highlighted

def save_pdf(highlighted, filename):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    y = height - 40
    for sent, color in highlighted:
        highlight_height = 15
        text_x = 40
        rect_width = min(520, width - 2 * text_x)

        if color == RGBColor(255, 0, 0):
            c.setFillColorRGB(1, 0.7, 0.7)
        elif color == RGBColor(255, 165, 0):
            c.setFillColorRGB(1, 0.9, 0.7)
        elif color == RGBColor(255, 255, 0):
            c.setFillColorRGB(1, 1, 0.6)
        else:
            c.setFillColorRGB(1, 1, 1)

        c.rect(text_x - 3, y - 2, rect_width, highlight_height, fill=1, stroke=0)
        c.setFillColorRGB(0, 0, 0)
        c.drawString(text_x, y, sent[:110])
        y -= highlight_height
        if y < 40:
            c.showPage()
            y = height - 40
    c.save()

def save_txt(highlighted, filename):
    with open(filename, "w", encoding="utf-8") as f:
        for sent, color in highlighted:
            tag = ""
            if color == RGBColor(255, 0, 0):
                tag = "[RED] "
            elif color == RGBColor(255, 165, 0):
                tag = "[ORANGE] "
            elif color == RGBColor(255, 255, 0):
                tag = "[YELLOW] "
            f.write(f"{tag}{sent}\n")

class SimpleChatbot:
    def _init_(self, highlighted):
        self.sentences = [sent for sent, color in highlighted]
        self.embeddings = embedder.encode(self.sentences, convert_to_tensor=True)

    def ask(self, query, top_k=2):
        q_emb = embedder.encode(query, convert_to_tensor=True)
        scores = util.cos_sim(q_emb, self.embeddings)[0]
        top_idx = scores.argsort(descending=True)[:top_k]
        return [self.sentences[i] for i in top_idx]

TEMP_DIR = "temp_files"
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_path = os.path.join(TEMP_DIR, f"{file_id}_{file.filename}")
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"file_id": file_id, "filename": file.filename, "filepath": file_path}

@app.post("/process/")
async def process_file(file_id: str = Form(...), user_choice: str = Form("pdf")):
    matching_files = [f for f in os.listdir(TEMP_DIR) if f.startswith(file_id)]
    if not matching_files:
        return JSONResponse({"error": "File not found"}, status_code=404)
    file_path = os.path.join(TEMP_DIR, matching_files[0])

    raw_text = load_document(file_path)
    simplified = simplify_text(raw_text)
    highlighted = highlight_text(simplified)

    out_filename = os.path.join(TEMP_DIR, f"{file_id}_simplified_highlighted")
    if user_choice.lower() == "pdf":
        out_filename += ".pdf"
        save_pdf(highlighted, out_filename)
    elif user_choice.lower() == "txt":
        out_filename += ".txt"
        save_txt(highlighted, out_filename)
    else:
        return JSONResponse({"error": "Unsupported output format"}, status_code=400)

    # Always create new chatbot instance fresh per call
    # This code is stateless per REST best practice
    return {"output_file": os.path.basename(out_filename)}

@app.get("/download/")
async def download_file(filename: str):
    file_path = os.path.join(TEMP_DIR, filename)
    if not os.path.exists(file_path):
        return JSONResponse({"error": "File not found"}, status_code=404)
    return FileResponse(path=file_path, filename=filename, media_type='application/octet-stream')

@app.post("/chat/")
async def chat(query: str = Form(...), file_id: str = Form(...)):
    matching_files = [f for f in os.listdir(TEMP_DIR) if f.startswith(file_id)]
    if not matching_files:
        return JSONResponse({"error": "No simplified text available for given file_id"}, status_code=404)
    file_path = os.path.join(TEMP_DIR, matching_files[0])

    raw_text = load_document(file_path)
    simplified = simplify_text(raw_text)
    highlighted = highlight_text(simplified)
    bot = SimpleChatbot(highlighted)

    answers = bot.ask(query, top_k=3)
    return {"answers": answers}