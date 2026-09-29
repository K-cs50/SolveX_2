from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.database.core import get_db
from app.models import Specification, User
from app.schemas import SpecificationCreate

router = APIRouter()

class SpecDraft(BaseModel):
    title: str
    project_name: Optional[str] = "Procurement Project"
    procuring_entity: Optional[str] = "Department of Public Works"
    content: Dict[str, Any]

@router.post("")
def create_specification(body: SpecDraft, db: Session = Depends(get_db)):
    spec = Specification(
        title=body.title,
        content={
            "project_name": body.project_name,
            "procuring_entity": body.procuring_entity,
            "specification_data": body.content
        }
    )
    db.add(spec)
    db.commit()
    db.refresh(spec)
    return {
        "id": spec.id,
        "title": spec.title,
        "content": spec.content,
        "created_at": spec.created_at
    }

@router.get("/{spec_id}")
def get_specification(spec_id: int, db: Session = Depends(get_db)):
    spec = db.query(Specification).filter(Specification.id == spec_id).first()
    if not spec:
        raise HTTPException(status_code=404, detail="Specification draft not found.")
    return {
        "id": spec.id,
        "title": spec.title,
        "content": spec.content,
        "created_at": spec.created_at
    }

@router.get("")
def list_specifications(db: Session = Depends(get_db)):
    specs = db.query(Specification).order_by(Specification.created_at.desc()).limit(20).all()
    return [
        {
            "id": s.id,
            "title": s.title,
            "content": s.content,
            "created_at": s.created_at
        }
        for s in specs
    ]
