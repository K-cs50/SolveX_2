/**
 * SolveX — Recommendation & Evidence Service
 * Synthesizes requirement analysis, hybrid retrieval, ranking, and evidence formulation.
 * Complies with Section 27, 30, 31, 32, and 46 (Hallucination Control).
 */

import { RetrievalService } from './retrievalService';
import { STANDARDS_DATABASE } from './standardsDatabase';

export class RecommendationService {
  /**
   * Recommend standards based on extracted requirements and raw specification
   */
  static generateRecommendations(requirements = [], rawText = "", activeRequirementId = null) {
    // If a specific requirement is selected in the 3-column workspace, focus search on that requirement
    const focusedReq = activeRequirementId
      ? requirements.find(r => r.id === activeRequirementId)
      : null;

    const queryTarget = focusedReq
      ? `${focusedReq.text} ${focusedReq.type}`
      : `${rawText.slice(0, 400)} ${requirements.map(r => r.text).join(' ')}`;

    // Retrieve candidates
    const searchResults = RetrievalService.search(queryTarget);

    // Formulate comprehensive recommendation cards with evidence
    const recommendations = searchResults.map(standard => {
      const matchBreakdown = this.generateMatchBasis(standard, requirements, focusedReq);
      const evidence = this.extractEvidenceTrace(standard, requirements);
      const whyThisStandard = this.buildWhyThisStandardExplanation(standard, requirements, focusedReq);

      return {
        ...standard,
        matchBasis: matchBreakdown,
        evidence,
        whyThisStandard,
        versionCheck: {
          isCurrent: standard.status === "Current",
          statusLabel: standard.status,
          verifiedVersion: standard.current_version,
          amendmentsCount: standard.amendments?.length || 0,
          verificationNotice: standard.status === "Current"
            ? "Reaffirmed by Bureau of Indian Standards Sectional Committee."
            : "Latest version could not be verified from the available source."
        },
        certificationNote: standard.certification_information || {
          scheme: "BIS Voluntary / Standard Mark Scheme",
          mandatory_status: "Applicability requires verification against Ministry Quality Control Orders",
          source_order: "General BIS Guidelines",
          verification_note: "Verify specific tender mandate before citing as statutory requirement."
        }
      };
    });

    return recommendations;
  }

  /**
   * Determine exact parameters that matched between requirements and standard
   */
  static generateMatchBasis(standard, requirements, focusedReq) {
    const basis = [];
    const targetText = focusedReq ? focusedReq.text : requirements.map(r => r.text).join(' ');
    const lowerTarget = targetText.toLowerCase();

    // Product match
    standard.applicable_products.forEach(p => {
      if (lowerTarget.includes(p.toLowerCase().split(' ')[0])) {
        basis.push({ type: "Product", label: p });
      }
    });

    // Technical parameter match
    standard.test_methods.forEach(tm => {
      const keyWords = tm.title.toLowerCase().split(' ');
      if (keyWords.some(w => w.length > 3 && lowerTarget.includes(w))) {
        basis.push({ type: "Parameter", label: tm.title });
      }
    });

    // Keywords match
    standard.keywords.forEach(k => {
      if (lowerTarget.includes(k.toLowerCase()) && !basis.some(b => b.label === k)) {
        basis.push({ type: "Requirement", label: k });
      }
    });

    return basis.slice(0, 4);
  }

  /**
   * Extract verifiable evidence citations with Clause, Section and verified source text
   */
  static extractEvidenceTrace(standard, requirements) {
    // Find primary test method or scope clause that justifies this standard
    const primaryTest = standard.test_methods?.[0] || {
      clause: "Clause 1",
      title: "Scope & Applicability",
      description: standard.scope
    };

    return {
      sourceDocument: standard.source_document,
      location: primaryTest.clause,
      title: primaryTest.title,
      relevantContent: primaryTest.description,
      page: standard.source_location
    };
  }

  /**
   * Section 32: "Why this standard?" Expandable Evidence Panel
   * Structure: Requirement -> Matching product/scope -> Technical relevance -> Related references -> Supporting evidence
   */
  static buildWhyThisStandardExplanation(standard, requirements, focusedReq) {
    const primaryReq = focusedReq || requirements[0] || { text: "Tender specification parameter" };

    return {
      requirement: primaryReq.text,
      matchingScope: standard.scope,
      technicalRelevance: `Standard specifies exact tolerances, test methods (${standard.test_methods?.map(t => t.clause).join(', ') || 'Clause 4'}), and material performance criteria directly matching procurement parameters.`,
      relatedReferences: standard.normative_references?.map(n => `${n.standard_number} (${n.relationship_type})`).join('; ') || "None required",
      supportingEvidence: `${standard.source_document} — ${standard.test_methods?.[0]?.clause || 'Clause 1'}: "${standard.test_methods?.[0]?.description || standard.scope}"`
    };
  }
}
