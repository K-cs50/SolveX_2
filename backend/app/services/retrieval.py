import re
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from app.models import Standard
from app.config import settings

class HybridRetrievalEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_features=5000
        )
        self.standards_corpus = []
        self.standard_ids = []
        self.is_fit = False

    def build_corpus(self, db: Session):
        standards = db.query(Standard).all()
        corpus = []
        ids = []
        for s in standards:
            # Combine all rich textual fields
            keywords_str = " ".join(s.keywords or [])
            domains_str = " ".join(s.technical_domains or [])
            products_str = " ".join([p if isinstance(p, str) else p.get("title", "") for p in (s.applicable_products or [])])
            scope_str = s.scope or ""
            title_str = s.title or ""
            std_num = s.standard_number or ""
            
            combined_text = f"{std_num} {title_str} {scope_str} {keywords_str} {domains_str} {products_str}"
            corpus.append(combined_text)
            ids.append(s.id)

        self.standards_corpus = corpus
        self.standard_ids = ids
        if len(corpus) > 0:
            self.vectorizer.fit(corpus)
            self.is_fit = True

    def search(self, query: str, db: Session, top_k: int = 6) -> List[Dict[str, Any]]:
        if not self.is_fit:
            self.build_corpus(db)
            if not self.is_fit:
                return []

        # 1. Semantic / TF-IDF Vector Similarity
        query_vec = self.vectorizer.transform([query])
        corpus_vec = self.vectorizer.transform(self.standards_corpus)
        similarities = cosine_similarity(query_vec, corpus_vec).flatten()

        # 2. Extract technical query tokens for exact keyword & metadata matching
        tokens = [t.lower() for t in re.findall(r'[A-Za-z0-9]+', query) if len(t) > 2]
        
        all_standards = {s.id: s for s in db.query(Standard).all()}
        scored_results = []

        for idx, sim in enumerate(similarities):
            std_id = self.standard_ids[idx]
            std = all_standards.get(std_id)
            if not std:
                continue

            base_score = float(sim)
            match_reasons = []

            # Check keyword match in standard_number or title
            title_lower = (std.title or "").lower()
            num_lower = (std.standard_number or "").lower()
            scope_lower = (std.scope or "").lower()
            kw_lower = [k.lower() for k in (std.keywords or [])]

            matched_keywords = []
            for token in tokens:
                if token in num_lower:
                    base_score += 0.35
                    match_reasons.append(f"Direct match on standard designation code '{token.upper()}'")
                elif token in title_lower:
                    base_score += 0.15
                    matched_keywords.append(token)
                elif any(token in kw for kw in kw_lower):
                    base_score += 0.10
                    matched_keywords.append(token)

            if matched_keywords:
                match_reasons.append(f"Domain & technical term alignment: {', '.join(set(matched_keywords))}")

            if sim > 0.12:
                match_reasons.append(f"Semantic scope alignment (cosine score: {sim:.3f})")

            # Final normalized score (0 to 100)
            final_score = min(100.0, max(0.0, base_score * 100.0))

            if final_score >= 12.0:
                scored_results.append({
                    "standard": std,
                    "score": round(final_score, 1),
                    "raw_cosine": round(float(sim), 4),
                    "reasons": match_reasons or ["General technical domain and category overlap"]
                })

        # Sort descending by score
        scored_results.sort(key=lambda x: x["score"], reverse=True)
        top_results = scored_results[:top_k]

        formatted = []
        for item in top_results:
            std = item["standard"]
            formatted.append({
                "standard": {
                    "id": std.id,
                    "standard_id": std.standard_id,
                    "standard_number": std.standard_number,
                    "title": std.title,
                    "scope": std.scope,
                    "status": std.status,
                    "publication_date": std.publication_date,
                    "current_version": std.current_version,
                    "division": std.division,
                    "committee": std.committee,
                    "amendments": std.amendments,
                    "supersedes": std.supersedes,
                    "superseded_by": std.superseded_by,
                    "product_categories": std.product_categories,
                    "technical_domains": std.technical_domains,
                    "keywords": std.keywords,
                    "applicable_products": std.applicable_products,
                    "test_methods": std.test_methods,
                    "safety_information": std.safety_information,
                    "installation_information": std.installation_information,
                    "terminology_information": std.terminology_information,
                    "normative_references": std.normative_references,
                    "allied_standards": std.allied_standards,
                    "related_standards": std.related_standards,
                    "certification_information": std.certification_information,
                    "source_document": std.source_document,
                    "source_location": std.source_location,
                    "is_demonstration": std.is_demonstration
                },
                "score": item["score"],
                "reason": " • ".join(item["reasons"]),
                "evidence": {
                    "scope_extract": std.scope,
                    "applicable_clause": (std.test_methods[0]["clause"] if std.test_methods else "General Specification"),
                    "certification_mandate": (std.certification_information.get("mandatory_status") if std.certification_information else "Voluntary / Conformity Verification")
                }
            })

        return formatted

retrieval_engine = HybridRetrievalEngine()

def extract_requirements(query: str) -> Dict[str, Any]:
    """Deterministic entity extraction from procurement requirement text."""
    query_lower = query.lower()
    
    products = []
    materials = []
    applications = []
    performance = []
    testing = []
    standards_cited = []

    # Material patterns
    material_map = {
        "hdpe": "High Density Polyethylene (HDPE)",
        "pvc": "Polyvinyl Chloride (PVC)",
        "upvc": "Unplasticized PVC (uPVC)",
        "cpvc": "Chlorinated Polyvinyl Chloride (CPVC)",
        "steel": "Structural / Carbon Steel",
        "tmt": "Thermo-Mechanically Treated (TMT) Steel",
        "concrete": "Portland Cement Concrete",
        "opc": "Ordinary Portland Cement (OPC)",
        "ppc": "Portland Pozzolana Cement (PPC)",
        "copper": "Electrolytic Copper",
        "aluminium": "Aluminium Alloy",
        "frls": "Fire Retardant Low Smoke (FRLS)"
    }
    for k, v in material_map.items():
        if k in query_lower:
            materials.append(v)

    # Product patterns
    product_map = {
        "pipe": "Piping Systems",
        "conduit": "Electrical Conduits",
        "cable": "Power & Control Cables",
        "wire": "Building Wires",
        "valve": "Control / Sluice Valves",
        "pump": "Centrifugal Pumps",
        "transformer": "Distribution Transformers",
        "cement": "Hydraulic Cement",
        "bar": "Reinforcement Steel Bars",
        "rebar": "Reinforcement Bars",
        "fitting": "Pipe Fittings",
        "switchgear": "Switchgear & Controlgear"
    }
    for k, v in product_map.items():
        if k in query_lower:
            products.append(v)

    # Applications
    if any(w in query_lower for w in ["water", "drinking", "potable", "jal jeevan"]):
        applications.append("Potable Water Supply")
    if any(w in query_lower for w in ["irrigation", "agriculture", "canal"]):
        applications.append("Agricultural Irrigation")
    if any(w in query_lower for w in ["fire", "safety", "hazard"]):
        applications.append("Fire Safety & Protection")
    if any(w in query_lower for w in ["building", "residential", "housing", "structure"]):
        applications.append("Civil Construction & Building Works")
    if any(w in query_lower for w in ["power", "substation", "grid", "electrical"]):
        applications.append("Power Transmission & Distribution")

    # Performance & Pressure parameters
    pressure_match = re.findall(r'(pn\s*\d+|p\s*=\s*\d+|[\d\.]+\s*(?:mpa|bar|kg/cm2))', query_lower)
    if pressure_match:
        performance.extend([f"Design Pressure: {p.upper()}" for p in pressure_match])
    
    dia_match = re.findall(r'(\d+\s*(?:mm|cm|inch|dia|nominal diameter))', query_lower)
    if dia_match:
        performance.extend([f"Dimensions: {d}" for d in dia_match])

    # Standard citations in query
    is_matches = re.findall(r'\bis\s*[:\-]?\s*(\d+(?:\s*(?:part\s*\d+|\(\s*part\s*\d+\s*\)))?)', query_lower)
    if is_matches:
        standards_cited.extend([f"IS {m.strip().upper()}" for m in is_matches])

    if any(w in query_lower for w in ["hydrostatic", "pressure test"]):
        testing.append("Hydrostatic Pressure Testing")
    if any(w in query_lower for w in ["tensile", "elongation"]):
        testing.append("Tensile Strength & Elongation")
    if any(w in query_lower for w in ["fire", "flammability", "smoke"]):
        testing.append("Flame Retardance & Smoke Density")

    return {
        "identified_products": list(set(products)) or ["General Technical Product / Equipment"],
        "materials": list(set(materials)) or ["Specified per Technical Schedule"],
        "applications": list(set(applications)) or ["General Institutional Procurement"],
        "performance_parameters": performance or ["Standard service limits per manufacturer schedule"],
        "testing_requirements": testing or ["Mandatory Routine & Type Tests per Indian Standard"],
        "standards_cited": standards_cited,
        "is_deterministic_extraction": True
    }


def generate_grounded_recommendation(
    query: str,
    extracted: Dict[str, Any],
    retrieved_standards: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    RAG Generation pipeline:
    Uses retrieved evidence to produce a grounded recommendation.
    If external LLM keys are absent, runs deterministic standards synthesizer with full evidence citation.
    """
    applicable = []
    related = []
    normatives = []

    for item in retrieved_standards:
        std = item["standard"]
        applicable.append({
            "standard_number": std["standard_number"],
            "title": std["title"],
            "relevance_score": item["score"],
            "why_matched": item["reason"],
            "scope": std["scope"],
            "status": std["status"],
            "evidence": item["evidence"],
            "test_methods": std["test_methods"][:2] if std.get("test_methods") else [],
            "certification": std.get("certification_information")
        })

        for rel in (std.get("related_standards") or []):
            if rel not in related:
                related.append(rel)

        for norm in (std.get("normative_references") or []):
            if norm not in normatives:
                normatives.append(norm)

    # Executive guidance note grounded in retrieved data
    top_std = applicable[0]["standard_number"] if applicable else "the relevant Indian Standard"
    summary = (
        f"Based on the procurement requirement for '{query}', primary conformity is governed by {top_std}. "
        f"Procurement specifications must mandate compliance with relevant Quality Control Orders (QCO) "
        f"and stipulate testing per prescribed statutory clauses."
    )

    return {
        "executive_summary": summary,
        "mode": "Grounding Pipeline: Curated Retrieval + Deterministic Synthesis (LLM Fallback Active)",
        "applicable_standards": applicable,
        "related_standards": related[:4],
        "normative_references": normatives[:4],
        "disclaimer": "Demonstration Data. Verify latest gazette notifications on the official BIS portal prior to tender publication."
    }
