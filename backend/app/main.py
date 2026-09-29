import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.config import settings
from app.database.core import get_db
from app.database.init_db import init_db
from app.services.retrieval import retrieval_engine
from app.services.standards_provider import standards_provider

from app.routers import auth, standards, recommendations, documents, specifications

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database and fit retrieval engine
    init_db()
    from app.database.core import SessionLocal
    db = SessionLocal()
    try:
        retrieval_engine.build_corpus(db)
    finally:
        db.close()
    yield
    # Shutdown

app = FastAPI(
    title="SolveX API",
    description="Backend API for SolveX Procurement & Standards Intelligence Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return {
        "status": "healthy",
        "service": "SolveX Intelligence Backend",
        "version": settings.VERSION,
        "database": db_status,
        "provider": standards_provider.source_type,
        "retrieval_engine": "Hybrid (TF-IDF + Cosine + Exact Entity Alignment)",
        "demonstration_data": True
    }

# Mount sub-routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(standards.router, prefix="/api/v1/standards", tags=["Standards Knowledge Base"])
app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["Recommendations & RAG"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["Document Analysis"])
app.include_router(specifications.router, prefix="/api/v1/specifications", tags=["Specification Builder"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
