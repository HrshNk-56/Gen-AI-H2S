import time
import torch
from app import simplify_document, extract_clauses, chatbot_query

def benchmark_optimizations():
    print("=== Jurify Final Optimization Benchmarks ===")
    sample_text = "This is a legal document. Confidentiality is key. Termination requires notice. Liability is limited." * 100
    
    # 1. Summarization Cache
    start = time.time()
    simplify_document(sample_text)
    cold_sim = time.time() - start
    
    start = time.time()
    simplify_document(sample_text)
    warm_sim = time.time() - start

    # 2. Clause Extraction Cache
    start = time.time()
    extract_clauses(sample_text)
    cold_clause = time.time() - start
    
    start = time.time()
    extract_clauses(sample_text)
    warm_clause = time.time() - start

    print(f"Summarization: Cold={cold_sim:.2f}s, Warm={warm_sim:.4f}s")
    print(f"Clause Extraction: Cold={cold_clause:.2f}s, Warm={warm_clause:.4f}s")

if __name__ == "__main__":
    benchmark_optimizations()
