from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.database.core import get_db
from app.services.standards_provider import standards_provider
from app.services.retrieval import retrieval_engine

router = APIRouter()

class SearchQuery(BaseModel):
    query: str
    domain: Optional[str] = None
    status: Optional[str] = None
    limit: Optional[int] = 10

@router.get("")
def list_standards(
    domain: Optional[str] = None,
    status: Optional[str] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db)
):
    standards = standards_provider.get_all(db, domain=domain, status=status)
    if q and q.strip():
        q_lower = q.lower()
        standards = [
            s for s in standards
            if q_lower in s.standard_number.lower()
            or q_lower in s.title.lower()
            or (s.scope and q_lower in s.scope.lower())
            or any(q_lower in k.lower() for k in (s.keywords or []))
        ]
    return standards

@router.post("/search")
def search_standards(body: SearchQuery, db: Session = Depends(get_db)):
    results = retrieval_engine.search(body.query, db, top_k=body.limit or 6)
    return results

@router.get("/{identifier}")
def get_standard(identifier: str, db: Session = Depends(get_db)):
    std = standards_provider.get_by_id(db, identifier)
    if not std:
        std = standards_provider.get_by_number(db, identifier)
    if not std:
        raise HTTPException(status_code=404, detail="Standard not found")
    return std

@router.get("/{identifier}/normative")
def get_normative_references(identifier: str, db: Session = Depends(get_db)):
    std = standards_provider.get_by_id(db, identifier)
    if not std:
        raise HTTPException(status_code=404, detail="Standard not found")
    return std.normative_references or []

@router.get("/{identifier}/related")
def get_related_standards(identifier: str, db: Session = Depends(get_db)):
    std = standards_provider.get_by_id(db, identifier)
    if not std:
        raise HTTPException(status_code=404, detail="Standard not found")
    return {
        "allied_standards": std.allied_standards or [],
        "related_standards": std.related_standards or []
    }
