from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models import Standard

class StandardsProviderBase:
    """Abstract base provider for Indian Standards data."""
    def get_all(self, db: Session, domain: Optional[str] = None, status: Optional[str] = None) -> List[Standard]:
        raise NotImplementedError

    def get_by_id(self, db: Session, standard_id: str) -> Optional[Standard]:
        raise NotImplementedError

    def get_by_number(self, db: Session, standard_number: str) -> Optional[Standard]:
        raise NotImplementedError


class LocalKnowledgeBaseProvider(StandardsProviderBase):
    """
    Curated Local Knowledge Base Provider.
    Clearly marks records as Curated Demonstration Standards Intelligence.
    """
    def __init__(self):
        self.source_type = "Curated Local Repository (Demonstration Data)"

    def get_all(self, db: Session, domain: Optional[str] = None, status: Optional[str] = None) -> List[Standard]:
        query = db.query(Standard)
        if status and status != "All":
            query = query.filter(Standard.status.ilike(f"%{status}%"))
        results = query.all()
        if domain and domain != "All":
            domain_lower = domain.lower()
            filtered = []
            for s in results:
                domains = [d.lower() for d in (s.technical_domains or [])]
                division = (s.division or "").lower()
                if domain_lower in domains or domain_lower in division:
                    filtered.append(s)
            return filtered
        return results

    def get_by_id(self, db: Session, standard_id: str) -> Optional[Standard]:
        # match standard_id or id
        if standard_id.isdigit():
            std = db.query(Standard).filter(Standard.id == int(standard_id)).first()
            if std:
                return std
        return db.query(Standard).filter(Standard.standard_id == standard_id).first()

    def get_by_number(self, db: Session, standard_number: str) -> Optional[Standard]:
        cleaned = standard_number.strip().replace(" ", "")
        all_stds = db.query(Standard).all()
        for s in all_stds:
            if s.standard_number.replace(" ", "").lower() == cleaned.lower():
                return s
        return None


class ExternalBISProvider(StandardsProviderBase):
    """
    External BIS Data Provider stub.
    When official live BIS API credentials or access endpoints become available,
    this provider will handle upstream authentication and synchronization.
    """
    def __init__(self):
        self.is_connected = False
        self.source_type = "External BIS Portal (Not Connected / Requires Official Credentials)"

    def get_all(self, db: Session, domain: Optional[str] = None, status: Optional[str] = None) -> List[Standard]:
        return []

    def get_by_id(self, db: Session, standard_id: str) -> Optional[Standard]:
        return None

    def get_by_number(self, db: Session, standard_number: str) -> Optional[Standard]:
        return None


# Global active provider defaulting to local curated data
standards_provider = LocalKnowledgeBaseProvider()
