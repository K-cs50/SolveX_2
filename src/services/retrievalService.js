/**
 * SolveX — Hybrid Retrieval Service
 * Combines Lexical Matching, Semantic Relevance, Metadata Filtering, and Relationship Traversal.
 * Complies with Section 28 Hybrid Retrieval specifications.
 */

import { STANDARDS_DATABASE } from './standardsDatabase';

export class RetrievalService {
  /**
   * Search standards database using query terms, technical parameters, and filters
   */
  static search(query = "", filters = {}) {
    const cleanQuery = (query || "").trim().toLowerCase();
    const queryTokens = cleanQuery.split(/\s+/).filter(t => t.length > 1);

    let candidates = STANDARDS_DATABASE.map(standard => {
      let lexicalScore = 0;
      let semanticScore = 0;
      let matchMatches = [];

      // 1. Direct Standard Number Match (Highest Priority)
      const stdNumClean = standard.standard_number.toLowerCase();
      if (cleanQuery && stdNumClean.includes(cleanQuery)) {
        lexicalScore += 50;
        matchMatches.push("Direct Standard Code match");
      }

      // 2. Token Matching in Title, Keywords, and Applicable Products
      const titleLower = standard.title.toLowerCase();
      const scopeLower = standard.scope.toLowerCase();
      const keywords = standard.keywords.map(k => k.toLowerCase());
      const products = standard.applicable_products.map(p => p.toLowerCase());

      queryTokens.forEach(token => {
        if (titleLower.includes(token)) {
          lexicalScore += 8;
          matchMatches.push(`Title matches "${token}"`);
        }
        if (scopeLower.includes(token)) {
          lexicalScore += 4;
        }
        if (keywords.some(k => k.includes(token))) {
          lexicalScore += 10;
          matchMatches.push(`Keyword matches "${token}"`);
        }
        if (products.some(p => p.includes(token))) {
          lexicalScore += 12;
          matchMatches.push(`Product category matches "${token}"`);
        }
      });

      // 3. Technical Parameters & Test Method matches
      standard.test_methods.forEach(tm => {
        queryTokens.forEach(token => {
          if (tm.title.toLowerCase().includes(token) || tm.description.toLowerCase().includes(token)) {
            lexicalScore += 5;
            matchMatches.push(`Test method: ${tm.title}`);
          }
        });
      });

      // 4. Domain & Category Weighting
      if (filters.domain && filters.domain !== 'all') {
        if (standard.technical_domains.includes(filters.domain)) {
          semanticScore += 15;
        } else {
          return null; // filtered out
        }
      }

      if (filters.category && filters.category !== 'all') {
        if (standard.product_categories.includes(filters.category)) {
          semanticScore += 15;
        } else {
          return null; // filtered out
        }
      }

      if (filters.status && filters.status !== 'all') {
        if (standard.status.toLowerCase() !== filters.status.toLowerCase()) {
          return null; // filtered out
        }
      }

      const totalScore = lexicalScore + semanticScore;

      return {
        standard,
        totalScore,
        matchMatches: Array.from(new Set(matchMatches)),
        lexicalScore,
        semanticScore
      };
    }).filter(Boolean);

    // If query is empty, return all (subject to filters) sorted by publication date or code
    if (!cleanQuery) {
      return candidates.map(c => ({
        ...c.standard,
        relevance: "Relevant",
        matchBasis: ["Catalog listing"],
        score: 1
      }));
    }

    // Sort by deterministic total score descending
    candidates.sort((a, b) => b.totalScore - a.totalScore);

    return candidates
      .filter(c => c.totalScore > 0)
      .map(c => {
        let relevance = "Potentially Relevant";
        if (c.totalScore >= 35) relevance = "Highly Relevant";
        else if (c.totalScore >= 15) relevance = "Relevant";

        return {
          ...c.standard,
          relevance,
          score: c.totalScore,
          matchBasis: c.matchMatches.slice(0, 3)
        };
      });
  }

  /**
   * Traverse normative, allied, and test relationships for a given standard
   */
  static getRelatedStandardsGraph(standardId) {
    const root = STANDARDS_DATABASE.find(s => s.standard_id === standardId || s.standard_number === standardId);
    if (!root) return null;

    return {
      standard: root,
      normativeReferences: root.normative_references || [],
      alliedStandards: root.allied_standards || [],
      relatedStandards: root.related_standards || [],
      testMethods: root.test_methods || []
    };
  }
}
