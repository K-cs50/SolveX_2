import json
import os
from pathlib import Path
from sqlalchemy.orm import Session
from app.database.core import engine, Base, SessionLocal
from app.models import Standard, User
from app.services.auth import get_password_hash

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if standards exist
        count = db.query(Standard).count()
        if count == 0:
            json_path = Path(__file__).parent / "standards.json"
            if json_path.exists():
                with open(json_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for item in data:
                        std = Standard(
                            standard_id=item.get("standard_id"),
                            standard_number=item.get("standard_number"),
                            title=item.get("title", ""),
                            scope=item.get("scope"),
                            status=item.get("status", "Current"),
                            publication_date=item.get("publication_date"),
                            current_version=item.get("current_version"),
                            division=item.get("division"),
                            committee=item.get("committee"),
                            amendments=item.get("amendments", []),
                            supersedes=item.get("supersedes"),
                            superseded_by=item.get("superseded_by"),
                            product_categories=item.get("product_categories", []),
                            technical_domains=item.get("technical_domains", []),
                            keywords=item.get("keywords", []),
                            applicable_products=item.get("applicable_products", []),
                            test_methods=item.get("test_methods", []),
                            safety_information=item.get("safety_information", {}),
                            installation_information=item.get("installation_information", {}),
                            terminology_information=item.get("terminology_information"),
                            normative_references=item.get("normative_references", []),
                            allied_standards=item.get("allied_standards", []),
                            related_standards=item.get("related_standards", []),
                            certification_information=item.get("certification_information", {}),
                            source_document=item.get("source_document"),
                            source_location=item.get("source_location"),
                            is_demonstration=True
                        )
                        db.add(std)
                    db.commit()
                    print(f"Successfully seeded {len(data)} standards into database.")

        # Create demo admin user if not exists
        admin = db.query(User).filter(User.email == "officer@solvex.gov.in").first()
        if not admin:
            demo_user = User(
                email="officer@solvex.gov.in",
                hashed_password=get_password_hash("Procurement@2026"),
                full_name="Chief Procurement Officer",
                is_active=True
            )
            db.add(demo_user)
            db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
