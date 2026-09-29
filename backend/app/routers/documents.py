from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.core import get_db
from app.services.document_analysis import analyze_document
from app.services.retrieval import retrieval_engine, generate_grounded_recommendation

router = APIRouter()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB limit

@router.post("/analyze")
async def upload_and_analyze_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Invalid file upload.")

    filename_lower = file.filename.lower()
    if not (filename_lower.endswith(".pdf") or filename_lower.endswith(".txt")):
        raise HTTPException(status_code=400, detail="Unsupported format. Only PDF and TXT documents are supported.")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Document exceeds maximum permitted size of 10 MB.")

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        doc_analysis = analyze_document(content, file.filename)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to process document: {str(e)}")

    # Synthesize requirement query from extracted text preview & parameters
    query_text = (
        " ".join(doc_analysis.get("product", [])) + " " +
        " ".join(doc_analysis.get("material", [])) + " " +
        " ".join(doc_analysis.get("requirements", []))
    ).strip()

    if not query_text:
        query_text = doc_analysis.get("text_preview", "")[:250]

    # Retrieve matching standards
    retrieved = retrieval_engine.search(query_text, db, top_k=5)
    rec = generate_grounded_recommendation(query_text, doc_analysis, retrieved)

    return {
        "filename": file.filename,
        "file_size_bytes": len(content),
        "document_analysis": doc_analysis,
        "derived_query": query_text,
        "retrieved_standards": retrieved,
        "grounded_recommendation": rec
    }
