# SolveX — Procurement & Standards Intelligence Platform

> **Understand requirements. Discover applicable standards. Build better specifications.**

SolveX is an institutional procurement intelligence system designed for public sector procurement officials, technical evaluation committees, and tender authorities. It streamlines the identification of mandated Bureau of Indian Standards (BIS) specifications, maps normative and allied reference standards, extracts technical parameters from procurement schedules, and generates standards-aligned tender specifications.

---

## Key Features

- **Procurement Analysis Console** — Interactive 3-column workspace: source document → extracted parameters → recommended Indian Standards with clause-level evidence.
- **Standards Repository** — Searchable database of Indian Standards across civil, electrical, chemical, mechanical, and safety divisions.
- **Side-by-Side Comparison** — Compare up to 3 standards on scope, clauses, test methods, safety, and certification.
- **Specification Builder** — Generate procurement documentation with auto-synced testing clauses and safety parameters (Markdown, HTML, JSON export).
- **Document Ingestion** — Upload PDF/TXT tender schedules for automated requirement extraction and standard mapping.
- **Authentication** — Secure officer login with JWT and password hashing.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Lucide React, Vanilla CSS |
| Backend | Python 3.10+, FastAPI, Uvicorn |
| Database | SQLite via SQLAlchemy ORM |
| Retrieval | Scikit-Learn TF-IDF + Cosine Similarity |
| Document Parsing | PyMuPDF |
| Security | PBKDF2-HMAC-SHA256, python-jose JWT |

---

## Local Setup

### Prerequisites
- Node.js v18+
- Python 3.10+

### Backend
```bash
python -m venv venv
# Windows: .\venv\Scripts\activate
# Linux/macOS: source venv/bin/activate
pip install -r backend/requirements.txt
cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deployment

### Frontend (Vercel)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite

### Backend (Render / Railway)
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## License

MIT
