# SolveX — Procurement & Standards Intelligence Platform

> **Understand requirements. Discover applicable standards. Build better specifications.**

SolveX is an institutional procurement intelligence system designed for public sector procurement officials, technical evaluation committees, and tender authorities. It streamlines the identification of mandated Bureau of Indian Standards (BIS) specifications, maps normative and allied reference standards, extracts technical parameters from procurement schedules, and generates standards-aligned tender specifications.

---

## 1. Product Purpose
In public and institutional procurement, identifying the exact mandatory Indian Standards (IS), related testing protocols, and statutory Quality Control Orders (QCO) is complex and error-prone. Citing obsolete or incorrect standards delays projects, risks contractual disputes, and causes procurement audits to flag irregularities. 

SolveX eliminates these risks through:
- **Requirement Entity Understanding**: Extracts products, materials, pressure classes, dimensions, and testing parameters from raw procurement text or tender schedules.
- **Hybrid Standards Retrieval**: Combines keyword search, TF-IDF lexical frequency, and semantic vector similarity across official standard scopes, titles, and technical domains.
- **Grounded Recommendation & RAG**: Synthesizes clause-level citations with verification notices and statutory Quality Control Order (QCO) references.
- **Specification Builder**: Assembles validated standards, auto-synced testing clauses, and safety parameters into exportable tender schedules (Markdown, HTML, JSON).
- **Document Analysis**: Parses PDF and TXT tender schedules, extracting requirements via PyMuPDF for automated standard mapping.

---

## 2. Key Features

- **Procurement Analysis Console**: Interactive 3-column analysis workspace displaying extracted parameters, candidate Indian Standards, and clause-level evidence.
- **Standards Repository**: Comprehensive searchable and filterable database of Indian Standards categorized by civil engineering, electrical, chemical, mechanical, and safety divisions.
- **Side-by-Side Comparison**: Multi-standard matrix comparing scopes, publication status, test clauses, safety requirements, and normative relationships (up to 3 standards).
- **Specification Builder**: Generates structured procurement documentation differentiating user requirements, standard-derived criteria, and synthesis notes.
- **Authentication & Role Management**: Secure password hashing with PBKDF2-HMAC-SHA256, JWT bearer token authorization, and role-based access for Technical Reviewers and Procurement Officials.
- **Document Ingestion**: Direct upload of tender documents and specifications (PDF/TXT) with text extraction and requirement matching.
- **Export Capabilities**: Clean download of specification schedules in Markdown (.md), printable HTML, and JSON formats.

---

## 3. System Architecture

```
[ User Browser ]
       │
       ▼
[ React + Vite Frontend (Port 5173) ]
       │
       ▼  (REST API / JSON / JWT)
[ src/services/api.js Client Layer ]
       │
       ▼
[ FastAPI Backend (Port 8000) ]
 ├── Authentication & Security (PBKDF2 + JWT)
 ├── Retrieval Engine (TF-IDF + Cosine Similarity + Token Alignment)
 ├── Grounded Recommendation Service (Evidence Grounding)
 ├── Document Processor (PyMuPDF Text Extraction)
 └── Standards Provider Abstraction
       │
       ▼
[ SQLite Database (solvex.db) / SQLAlchemy ORM ]
 ├── Standards Knowledge Base (22 Curated Indian Standards)
 ├── User Accounts & Roles
 ├── Procurement Recommendations History
 └── Saved Specification Drafts
```

---

## 4. Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **UI & Icons**: Lucide React, Vanilla CSS design system (Institutional Navy & Slate theme)
- **State Management**: Reactive state hooks with resilient local fallback
- **Linting & Code Quality**: Oxlint

### Backend
- **Framework**: Python 3.10+ / FastAPI
- **Web Server**: Uvicorn (ASGI)
- **Database & ORM**: SQLite (MVP) via SQLAlchemy (PostgreSQL-ready architecture)
- **Security**: PBKDF2-HMAC-SHA256 password hashing, python-jose for JWT authentication
- **Document Analysis**: PyMuPDF (`pymupdf`)
- **Retrieval & Scoring**: Scikit-Learn (TfidfVectorizer + Cosine Similarity) + NumPy

---

## 5. Standards Knowledge Model

Each Indian Standard record is structured with rich institutional metadata:
- `standard_id` / `standard_number` (e.g., `IS 4984 : 2016`)
- `title` and official `scope`
- `status` (Current / Superseded / Under Revision)
- `publication_date` and `current_version`
- `division` (CED, ETD, MED, TXD, CHD) and `committee`
- `amendments` with dates and technical summaries
- `product_categories`, `technical_domains`, and `keywords`
- `test_methods` (clause, title, description)
- `safety_information` and `installation_information`
- `normative_references` and `allied_standards`
- `certification_information` (statutory QCO mandate, BIS scheme)
- `source_document` and `source_location`

---

## 6. Backend REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | System health, database connectivity, and provider status |
| `GET` | `/api/v1/standards` | List standards with optional domain, status, and search filters |
| `GET` | `/api/v1/standards/{id}` | Detailed standard record by ID or standard number |
| `POST` | `/api/v1/standards/search` | Semantic and keyword hybrid search across standards |
| `GET` | `/api/v1/standards/{id}/normative` | Normative references list for a specific standard |
| `GET` | `/api/v1/standards/{id}/related` | Allied and related standards list |
| `POST` | `/api/v1/recommendations/analyze` | Full requirement extraction and grounded recommendation |
| `GET` | `/api/v1/recommendations/{id}` | Retrieve historical recommendation record |
| `POST` | `/api/v1/documents/analyze` | Multipart PDF/TXT upload and requirement extraction |
| `POST` | `/api/v1/specifications` | Save structured specification draft |
| `GET` | `/api/v1/specifications` | List saved specification projects |
| `GET` | `/api/v1/specifications/{id}` | Retrieve saved specification draft |
| `POST` | `/api/v1/auth/register` | Register officer user account |
| `POST` | `/api/v1/auth/login` | Officer login returning JWT bearer token |
| `POST` | `/api/v1/auth/logout` | Protected session termination |

---

## 7. Folder Structure

```
solvex/
├── backend/
│   ├── app/
│   │   ├── config.py             # Pydantic environment configuration
│   │   ├── main.py               # FastAPI entrypoint, lifespan, CORS
│   │   ├── database/
│   │   │   ├── core.py           # SQLAlchemy database engine & session
│   │   │   ├── init_db.py        # Database creation and standards seeder
│   │   │   └── standards.json    # Curated Indian Standards seed data
│   │   ├── models/               # SQLAlchemy ORM models (User, Standard, etc.)
│   │   ├── schemas/              # Pydantic v2 validation models
│   │   ├── services/
│   │   │   ├── auth.py           # PBKDF2 password hashing & JWT tokens
│   │   │   ├── retrieval.py      # Hybrid TF-IDF vector retrieval & RAG
│   │   │   ├── document_analysis.py # PyMuPDF document text extraction
│   │   │   └── standards_provider.py # Local & external provider abstraction
│   │   └── routers/              # API endpoints (standards, auth, etc.)
│   ├── tests/                    # Pytest backend test suite
│   ├── requirements.txt          # Python dependencies
│   └── .env.example              # Backend environment template
├── src/
│   ├── components/
│   │   ├── app/                  # Application screens (Analyze, Builder, etc.)
│   │   ├── auth/                 # Login & Registration components
│   │   ├── common/               # Header, Footer, Modals, Badges
│   │   └── public/               # Public Landing & About pages
│   ├── services/
│   │   ├── api.js                # Central API client layer (Fetch wrapper)
│   │   ├── aiService.js          # AI / RAG coordination with local fallback
│   │   ├── recommendationService.js # Grounded recommendation logic
│   │   ├── retrievalService.js   # Client-side fallback search
│   │   └── standardsDatabase.js  # Curated standards baseline
│   ├── App.jsx                   # Master application router & state
│   ├── index.css                 # Government design tokens & utilities
│   └── main.jsx                  # React DOM mount point
├── package.json
├── vite.config.js
├── .env.example                  # Root environment template
└── README.md
```

---

## 8. Local Setup & Execution

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.10 or higher)

### Step 1: Clone & Configure Environment
```bash
cp .env.example .env
```

### Step 2: Set Up Backend
```bash
# In project root:
python -m venv venv

# Activate virtual environment:
# Windows (PowerShell):
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install backend dependencies:
pip install -r backend/requirements.txt
```

### Step 3: Run Backend Server
```bash
# Start FastAPI backend (runs on port 8000):
$env:PYTHONPATH='backend'; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
On initial boot, the backend automatically creates `solvex.db`, seeds the 22 curated Indian Standards, and generates the demo procurement officer account.

Verify backend health at: [http://localhost:8000/health](http://localhost:8000/health)  
Interactive Swagger API docs at: [http://localhost:8000/docs](http://localhost:8000/docs)

### Step 4: Set Up Frontend
In a separate terminal:
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

Default Demo Credentials:
- **Email**: `officer@solvex.gov.in`
- **Password**: `Procurement@2026`

---

## 9. Production Build & Verification

### Frontend Production Build
```bash
npm run build
```
Generates the optimized static distribution bundle in `dist/`.

### Run Production Build Preview
```bash
npm run preview
```

### Run Backend Test Suite
```bash
pytest backend/tests/test_api.py
```

---

## 10. Deployment Instructions

### Frontend (Vercel / Netlify / Cloudflare Pages)
1. Set the Build Command: `npm run build`
2. Set the Publish Directory: `dist`
3. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-domain.com/api/v1`

### Backend (Render / Railway / AWS EC2 / Container)
1. Run command:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
2. Set Environment Variables:
   - `SECRET_KEY`: A cryptographically secure random string
   - `DATABASE_URL`: `sqlite:///./solvex.db` (or PostgreSQL connection URI)

---

## 11. Demonstration Data Disclaimer
All Indian Standards and mock tender records bundled within this distribution represent curated reference demonstrations. In production public procurement operations, specifications and active Quality Control Orders (QCO) must be verified against official notifications on the Bureau of Indian Standards (BIS) Gazette Portal before tender publication.
