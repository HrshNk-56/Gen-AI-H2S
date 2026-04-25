import time
import torch
import os
import io
from app import load_document, simplify_document, extract_clauses, chatbot_query
from transformers import BartForConditionalGeneration, BartTokenizer
from sentence_transformers import SentenceTransformer

def benchmark_models():
    print("=== Model Loading Benchmarks ===")
    start = time.time()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")
    
    m1_start = time.time()
    BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn").to(device)
    BartTokenizer.from_pretrained("facebook/bart-large-cnn")
    print(f"BART Load Time: {time.time() - m1_start:.2f}s")
    
    m2_start = time.time()
    SentenceTransformer('all-MiniLM-L6-v2')
    print(f"SentenceTransformer Load Time: {time.time() - m2_start:.2f}s")
    print(f"Total Model Load Time: {time.time() - start:.2f}s\n")

def benchmark_processing():
    print("=== Processing Pipeline Benchmarks ===")
    
    # Sample legal-ish text (approx 1000 words)
    sample_text = """
    This Agreement is made as of the Effective Date between the Parties. 
    1. Confidentiality. The Recipient shall maintain the Confidential Information in strict confidence.
    2. Termination. Either party may terminate this agreement with 30 days written notice.
    3. Liability. In no event shall either party be liable for indirect, incidental, or consequential damages.
    """ * 50 # Blow it up to ~1500 words
    
    print(f"Sample Text Length: {len(sample_text)} characters (~{len(sample_text.split())} words)")

    # 1. Summarization (BART)
    start = time.time()
    simplified = simplify_document(sample_text)
    duration = time.time() - start
    print(f"Summarization Time (5 chunks): {duration:.2f}s ({duration/5:.2f}s per chunk)")

    # 2. Clause Extraction
    start = time.time()
    clauses = extract_clauses(sample_text)
    print(f"Clause Extraction Time: {time.time() - start:.2f}s")

    # 3. Chatbot Query
    start = time.time()
    answer = chatbot_query(simplified, "What is the notice period for termination?")
    print(f"Chatbot Response Time: {time.time() - start:.2f}s")

def benchmark_parsing():
    pdf_path = "/home/nebby/Downloads/book.pdf"
    if os.path.exists(pdf_path):
        print("\n=== Document Parsing Benchmarks ===")
        start = time.time()
        # Mocking a file object for load_document
        class MockFile:
            def __init__(self, path):
                self.filename = path
            def save(self, dest):
                import shutil
                shutil.copy(self.filename, dest)
        
        text = load_document(MockFile(pdf_path))
        print(f"PDF Parsing Time (book.pdf): {time.time() - start:.2f}s")
        print(f"Extracted Characters: {len(text)}")

if __name__ == "__main__":
    benchmark_models()
    benchmark_processing()
    benchmark_parsing()
