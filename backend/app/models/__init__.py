from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.core import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Standard(Base):
    __tablename__ = "standards"
    id = Column(Integer, primary_key=True, index=True)
    standard_id = Column(String, unique=True, index=True, nullable=True)
    standard_number = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    scope = Column(Text)
    status = Column(String)
    publication_date = Column(String)
    current_version = Column(String)
    division = Column(String)
    committee = Column(String)
    amendments = Column(JSON) # list of objects
    supersedes = Column(String)
    superseded_by = Column(String)
    product_categories = Column(JSON) # list of strings
    technical_domains = Column(JSON) # list of strings
    keywords = Column(JSON) # list of strings
    applicable_products = Column(JSON) # list of strings/objects
    test_methods = Column(JSON) # list of objects
    safety_information = Column(JSON) # object
    installation_information = Column(JSON) # object
    terminology_information = Column(JSON) # string or object
    normative_references = Column(JSON) # list of objects
    allied_standards = Column(JSON) # list of objects
    related_standards = Column(JSON) # list of objects
    certification_information = Column(JSON) # object
    source_document = Column(String)
    source_location = Column(String)
    is_demonstration = Column(Boolean, default=True)

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    query_text = Column(Text)
    extracted_requirements = Column(JSON)
    results = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
class Specification(Base):
    __tablename__ = "specifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String)
    content = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
