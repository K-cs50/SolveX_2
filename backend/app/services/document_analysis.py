import pymupdf as fitz
from io import BytesIO
from typing import Dict, Any

def analyze_document(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    text = ""
    if filename.lower().endswith('.pdf'):
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                text += page.get_text()
        except Exception as e:
            raise ValueError(f"Failed to parse PDF: {str(e)}")
    elif filename.lower().endswith('.txt'):
        text = file_bytes.decode('utf-8', errors='ignore')
    else:
        raise ValueError("Unsupported file type. Please upload a PDF or TXT file.")
        
    # Extract requirements from text (deterministic fallback)
    text_lower = text.lower()
    
    extracted = {
        "text_preview": text[:500] + "..." if len(text) > 500 else text,
        "product": [],
        "material": [],
        "requirements": []
    }
    
    if "hdpe" in text_lower or "high density polyethylene" in text_lower:
        extracted["material"].append("HDPE")
    if "pvc" in text_lower:
        extracted["material"].append("PVC")
        
    if "pipe" in text_lower:
        extracted["product"].append("Pipe")
    if "cable" in text_lower:
        extracted["product"].append("Cable")
        
    if "pressure" in text_lower:
        extracted["requirements"].append("Pressure rating required")
    if "fire retardant" in text_lower or "frls" in text_lower:
        extracted["requirements"].append("Fire Retardant Low Smoke")
        
    return extracted
