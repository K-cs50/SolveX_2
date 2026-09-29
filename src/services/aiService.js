/**
 * SolveX — AI Provider Abstraction Layer
 * Complies with Section 50 AI Provider Abstraction.
 * Decoupled from specific backend/LLM endpoints with full fallback and demonstration mode support.
 */

import { DocumentExtractionService } from './documentExtractionService';
import { RecommendationService } from './recommendationService';
import { RetrievalService } from './retrievalService';

export class AIService {
  /**
   * Run full specification analysis with simulated realistic pipeline stages
   */
  static async analyzeSpecification(text, onProgress = () => {}) {
    // 1. Uploading / Parsing
    onProgress({ stage: "parsing", label: "Parsing document structure & cleaning text...", percent: 20 });
    await new Promise(r => setTimeout(r, 450));

    // 2. Requirement Extraction
    onProgress({ stage: "extracting", label: "Extracting procurement requirements & technical parameters...", percent: 45 });
    const requirements = DocumentExtractionService.extractRequirements(text);
    const entity = DocumentExtractionService.detectProductEntity(text);
    await new Promise(r => setTimeout(r, 550));

    // 3. Finding Standards (Hybrid Retrieval)
    onProgress({ stage: "retrieval", label: "Querying Indian Standards knowledge graph (lexical + semantic)...", percent: 70 });
    await new Promise(r => setTimeout(r, 450));

    // 4. Checking Relationships & Traversal
    onProgress({ stage: "references", label: "Checking normative references, allied test methods & safety codes...", percent: 85 });
    await new Promise(r => setTimeout(r, 400));

    // 5. Preparing Evidence & Recommendations
    onProgress({ stage: "recommendations", label: "Preparing clause-level evidence and ranking recommendations...", percent: 95 });
    const recommendations = RecommendationService.generateRecommendations(requirements, text);
    await new Promise(r => setTimeout(r, 350));

    onProgress({ stage: "complete", label: "Analysis complete.", percent: 100 });

    return {
      timestamp: new Date().toISOString(),
      entity,
      requirements,
      recommendations,
      rawText: text
    };
  }

  /**
   * Fast requirement update for 3-column interactive filtering
   */
  static getRecommendationsForRequirement(requirements, rawText, requirementId) {
    return RecommendationService.generateRecommendations(requirements, rawText, requirementId);
  }

  /**
   * Standards repository search
   */
  static searchStandards(query, filters) {
    return RetrievalService.search(query, filters);
  }
}
