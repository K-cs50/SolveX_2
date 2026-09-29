from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.database.core import get_db
from app.models import Recommendation, User
from app.services.retrieval import retrieval_engine, extract_requirements, generate_grounded_recommendation
from app.services.auth import get_current_user

router = APIRouter()

class AnalyzeRequest(BaseModel):
    query: str

@router.post("/analyze")
def analyze_procurement_query(body: AnalyzeRequest, db: Session = Depends(get_db)):
    query = body.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Procurement requirement text cannot be empty.")

    # 1. Deterministic technical entity extraction
    extracted = extract_requirements(query)

    # 2. Hybrid search & scoring
    retrieved = retrieval_engine.search(query, db, top_k=6)

    # 3. Grounded recommendation synthesis
    recommendation_payload = generate_grounded_recommendation(query, extracted, retrieved)

    # 4. Save analysis record in database
    rec_record = Recommendation(
        query_text=query,
        extracted_requirements=extracted,
        results={
            "retrieved_standards": retrieved,
            "grounded_recommendation": recommendation_payload
        }
    )
    db.add(rec_record)
    db.commit()
    db.refresh(rec_record)

    return {
        "id": rec_record.id,
        "query_text": query,
        "extracted_requirements": extracted,
        "retrieved_standards": retrieved,
        "grounded_recommendation": recommendation_payload,
        "created_at": rec_record.created_at
    }

@router.get("/{rec_id}")
def get_recommendation(rec_id: int, db: Session = Depends(get_db)):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation record not found.")
    return {
        "id": rec.id,
        "query_text": rec.query_text,
        "extracted_requirements": rec.extracted_requirements,
        "results": rec.results,
        "created_at": rec.created_at
    }
