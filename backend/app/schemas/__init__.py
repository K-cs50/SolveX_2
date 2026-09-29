from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class StandardBase(BaseModel):
    standard_number: str
    title: str
    scope: Optional[str] = None
    status: Optional[str] = None
    publication_date: Optional[str] = None
    current_version: Optional[str] = None
    division: Optional[str] = None
    committee: Optional[str] = None
    amendments: Optional[List[Dict[str, Any]]] = None
    supersedes: Optional[str] = None
    superseded_by: Optional[str] = None
    product_categories: Optional[List[str]] = None
    technical_domains: Optional[List[str]] = None
    keywords: Optional[List[str]] = None
    applicable_products: Optional[List[Dict[str, Any]]] = None
    test_methods: Optional[List[Dict[str, Any]]] = None
    safety_information: Optional[List[Dict[str, Any]]] = None
    installation_information: Optional[List[Dict[str, Any]]] = None
    terminology: Optional[List[Dict[str, Any]]] = None
    normative_references: Optional[List[Dict[str, Any]]] = None
    allied_standards: Optional[List[Dict[str, Any]]] = None
    related_standards: Optional[List[Dict[str, Any]]] = None
    certification_information: Optional[Dict[str, Any]] = None
    source_document: Optional[str] = None
    source_location: Optional[str] = None

class StandardCreate(StandardBase):
    pass

class Standard(StandardBase):
    id: int
    class Config:
        from_attributes = True

class RecommendationRequest(BaseModel):
    query: str

class RecommendationResponse(BaseModel):
    id: int
    query_text: str
    extracted_requirements: Dict[str, Any]
    results: List[Dict[str, Any]]
    
class SpecificationBase(BaseModel):
    title: str
    content: Dict[str, Any]

class SpecificationCreate(SpecificationBase):
    pass

class Specification(SpecificationBase):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        orm_mode = True
        from_attributes = True
