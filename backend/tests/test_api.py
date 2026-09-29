import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.init_db import init_db

# Initialize database before running tests
init_db()

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "SolveX" in data["service"]
    assert data["demonstration_data"] is True

def test_list_standards():
    response = client.get("/api/v1/standards")
    assert response.status_code == 200
    standards = response.json()
    assert isinstance(standards, list)
    assert len(standards) > 0

def test_standards_lookup():
    # Lookup IS 4984 : 2016
    response = client.get("/api/v1/standards/IS-4984-2016")
    assert response.status_code == 200
    std = response.json()
    assert "IS 4984" in std["standard_number"]
    assert "HDPE" in std["title"] or "Polyethylene" in std["title"]

def test_standards_search():
    payload = {"query": "HDPE pressure pipes for drinking water", "limit": 3}
    response = client.post("/api/v1/standards/search", json=payload)
    assert response.status_code == 200
    results = response.json()
    assert len(results) > 0
    top = results[0]
    assert "standard" in top
    assert "score" in top
    assert top["score"] > 0

def test_recommendation_analyze():
    payload = {"query": "Supply of HDPE pipes PN 10 for drinking water distribution"}
    response = client.post("/api/v1/recommendations/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "extracted_requirements" in data
    assert "retrieved_standards" in data
    assert "grounded_recommendation" in data
    assert len(data["retrieved_standards"]) > 0

def test_empty_query_validation():
    payload = {"query": "   "}
    response = client.post("/api/v1/recommendations/analyze", json=payload)
    assert response.status_code == 400

def test_auth_and_protected_flow():
    # 1. Register a test officer
    email = f"test_officer_{client.__hash__() or '01'}@solvex.gov.in"
    reg_res = client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "SecurePassword123!",
        "full_name": "Test Officer"
    })
    assert reg_res.status_code in [200, 400] # 400 if already exists

    # 2. Login
    login_res = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "SecurePassword123!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert token

    # 3. Access protected logout
    logout_res = client.post("/api/v1/auth/logout", headers={
        "Authorization": f"Bearer {token}"
    })
    assert logout_res.status_code == 200
