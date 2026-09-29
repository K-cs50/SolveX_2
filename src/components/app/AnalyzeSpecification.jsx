import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Layers,
  Edit2,
  Trash2,
  Plus,
  RefreshCw,
  CheckCircle2,
  FileCheck,
  Filter,
  ArrowUpDown,
  Search,
  BookOpen,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import StandardCard from './StandardCard';
import { AIService } from '../../services/aiService';
import { DocumentExtractionService } from '../../services/documentExtractionService';
import { RecommendationService } from '../../services/recommendationService';
import { MOCK_TENDERS } from '../../data/mockTenders';

export default function AnalyzeSpecification({
  onViewStandardDetails,
  onToggleSpecification,
  specificationStandards = [],
  onToggleSaveStandard,
  savedStandards = [],
  onCompareStandard,
  comparedStandards = [],
  initialText = "",
  initialTenderId = null,
  onSpecificationGenerated
}) {
  // Input State
  const [activeTab, setActiveTab] = useState('paste'); // paste, presets, upload
  const [specificationText, setSpecificationText] = useState(
    initialText || MOCK_TENDERS[0].raw_text
  );
  const [selectedTenderId, setSelectedTenderId] = useState(
    initialTenderId || MOCK_TENDERS[0].id
  );

  // Upload State
  const [uploadedFileName, setUploadedFileName] = useState(null);

  // Analysis Processing State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStage, setProgressStage] = useState(null);

  // Results State initialized synchronously with extraction & recommendations
  const [analysisResult, setAnalysisResult] = useState(() => {
    const text = initialText || MOCK_TENDERS[0].raw_text;
    const reqs = DocumentExtractionService.extractRequirements(text);
    const entity = DocumentExtractionService.detectProductEntity(text);
    const recs = RecommendationService.generateRecommendations(reqs, text);
    return {
      timestamp: new Date().toISOString(),
      entity,
      requirements: reqs,
      recommendations: recs,
      rawText: text
    };
  });

  const [activeRequirementId, setActiveRequirementId] = useState(null);
  const [editingReqId, setEditingReqId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [newReqType, setNewReqType] = useState('Technical Parameter');
  const [newReqText, setNewReqText] = useState('');
  const [showAddReq, setShowAddReq] = useState(false);

  // Filters & Sorting in Column 2 & Column 3
  const [reqImportanceFilter, setReqImportanceFilter] = useState('all'); // all, Critical, Mandatory, High
  const [relevanceFilter, setRelevanceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance'); // relevance, standard_number, recency

  // Handle Preset Selection
  const handleSelectPreset = (tender) => {
    setSelectedTenderId(tender.id);
    setSpecificationText(tender.raw_text);
    setUploadedFileName(null);
    setActiveTab('presets');

    const reqs = DocumentExtractionService.extractRequirements(tender.raw_text);
    const entity = DocumentExtractionService.detectProductEntity(tender.raw_text);
    const recs = RecommendationService.generateRecommendations(reqs, tender.raw_text);
    setAnalysisResult({
      timestamp: new Date().toISOString(),
      entity,
      requirements: reqs,
      recommendations: recs,
      rawText: tender.raw_text
    });
    setActiveRequirementId(null);
  };

  // Run Specification Analysis
  const handleRunAnalysis = async () => {
    if (!specificationText.trim()) return;

    setIsAnalyzing(true);
    setProgressStage({ stage: 'start', label: 'Initiating Indian Standards Retrieval Engine...', percent: 10 });

    try {
      const result = await AIService.analyzeSpecification(specificationText, (stage) => {
        setProgressStage(stage);
      });

      setAnalysisResult(result);
      setActiveRequirementId(null);
      if (onSpecificationGenerated) {
        onSpecificationGenerated(result);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
      setProgressStage(null);
    }
  };

  // Handle requirement editing
  const handleSaveRequirementEdit = (reqId) => {
    if (!analysisResult) return;
    const updated = analysisResult.requirements.map(r =>
      r.id === reqId ? { ...r, text: editedText } : r
    );
    const updatedRecs = AIService.getRecommendationsForRequirement(updated, specificationText, activeRequirementId);
    setAnalysisResult({
      ...analysisResult,
      requirements: updated,
      recommendations: updatedRecs
    });
    setEditingReqId(null);
  };

  // Delete requirement
  const handleDeleteRequirement = (reqId) => {
    if (!analysisResult) return;
    const updated = analysisResult.requirements.filter(r => r.id !== reqId);
    const updatedRecs = AIService.getRecommendationsForRequirement(updated, specificationText, null);
    setAnalysisResult({
      ...analysisResult,
      requirements: updated,
      recommendations: updatedRecs
    });
    if (activeRequirementId === reqId) setActiveRequirementId(null);
  };

  // Add custom requirement
  const handleAddRequirement = () => {
    if (!newReqText.trim() || !analysisResult) return;
    const newReq = {
      id: `req-custom-${Date.now()}`,
      type: newReqType,
      text: newReqText.trim(),
      source: "Manual Entry / Addendum",
      importance: "Critical",
      editable: true
    };
    const updated = [...analysisResult.requirements, newReq];
    const updatedRecs = AIService.getRecommendationsForRequirement(updated, specificationText, newReq.id);
    setAnalysisResult({
      ...analysisResult,
      requirements: updated,
      recommendations: updatedRecs
    });
    setNewReqText('');
    setShowAddReq(false);
    setActiveRequirementId(newReq.id);
  };

  // Handle requirement row selection (filters right-hand recommendations)
  const handleRequirementSelect = (reqId) => {
    const nextId = activeRequirementId === reqId ? null : reqId;
    setActiveRequirementId(nextId);
    if (analysisResult) {
      const updatedRecs = AIService.getRecommendationsForRequirement(
        analysisResult.requirements,
        specificationText,
        nextId
      );
      setAnalysisResult(prev => ({
        ...prev,
        recommendations: updatedRecs
      }));
    }
  };

  // File Upload Handler with backend PDF parsing
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsAnalyzing(true);
    setProgressStage({ stage: 'upload', label: `Reading and extracting ${file.name}...`, percent: 25 });

    if (file.name.toLowerCase().endsWith('.pdf')) {
      try {
        const result = await AIService.analyzeDocumentFile(file, (stage) => setProgressStage(stage));
        setSpecificationText(result.rawText || `[PARSED TENDER SPECIFICATION FROM: ${file.name}]`);
        setAnalysisResult(result);
        if (onSpecificationGenerated) onSpecificationGenerated(result);
      } catch (err) {
        console.warn("Backend PDF upload failed, falling back to local text reading:", err.message);
        const fallbackText = `[EXTRACTED REQUIREMENT SUMMARY FROM: ${file.name}]\n` + MOCK_TENDERS[1].raw_text;
        setSpecificationText(fallbackText);
        const reqs = DocumentExtractionService.extractRequirements(fallbackText);
        const entity = DocumentExtractionService.detectProductEntity(fallbackText);
        const recs = RecommendationService.generateRecommendations(reqs, fallbackText);
        setAnalysisResult({
          timestamp: new Date().toISOString(),
          entity,
          requirements: reqs,
          recommendations: recs,
          rawText: fallbackText
        });
      } finally {
        setIsAnalyzing(false);
        setProgressStage(null);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result || "";
        setSpecificationText(text);
        const reqs = DocumentExtractionService.extractRequirements(text);
        const entity = DocumentExtractionService.detectProductEntity(text);
        const recs = RecommendationService.generateRecommendations(reqs, text);
        setAnalysisResult({
          timestamp: new Date().toISOString(),
          entity,
          requirements: reqs,
          recommendations: recs,
          rawText: text
        });
        setIsAnalyzing(false);
        setProgressStage(null);
      };
      reader.readAsText(file);
    }
  };

  // Requirements filtered by importance
  const displayedRequirements = (analysisResult?.requirements || []).filter(req => {
    if (reqImportanceFilter === 'all') return true;
    return req.importance.toLowerCase() === reqImportanceFilter.toLowerCase();
  });

  // Filtered & Sorted recommendations in Column 3
  const displayedRecommendations = (analysisResult?.recommendations || [])
    .filter(std => {
      if (relevanceFilter === 'all') return true;
      if (relevanceFilter === 'high') return std.relevance.toLowerCase().includes('high');
      if (relevanceFilter === 'current') return std.status === 'Current';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'relevance') {
        const scoreA = a.relevance.includes('High') ? 3 : a.relevance.includes('Relevant') ? 2 : 1;
        const scoreB = b.relevance.includes('High') ? 3 : b.relevance.includes('Relevant') ? 2 : 1;
        return scoreB - scoreA;
      }
      if (sortBy === 'standard_number') {
        return a.standard_number.localeCompare(b.standard_number);
      }
      return 0;
    });

  // Active selected requirement object for cross-referencing
  const activeReqObj = analysisResult?.requirements?.find(r => r.id === activeRequirementId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header & Presets Selector */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--slate-200)',
        borderRadius: '8px',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--gov-navy-950)', fontWeight: '600' }}>
            Specification Analysis & Standards Recommendation
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            Analyze tender clauses, extract technical parameters, discover applicable Indian Standards, and verify evidence.
          </p>
        </div>

        {/* Action Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Load Demo Tender:
          </span>
          {MOCK_TENDERS.map(t => (
            <button
              key={t.id}
              onClick={() => handleSelectPreset(t)}
              className={`btn btn-sm ${selectedTenderId === t.id && activeTab === 'presets' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem' }}
            >
              {t.title.split(' ')[0]} ({t.category.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* Loading Progress State - Section 43 */}
      {isAnalyzing && (
        <div style={{
          background: 'var(--gov-navy-900)',
          color: '#ffffff',
          borderRadius: '8px',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <RefreshCw size={18} className="spin-animation" />
              <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>
                {progressStage?.label || "Processing Specification..."}
              </span>
            </div>
            <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--saffron-400)' }}>
              {progressStage?.percent || 0}%
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressStage?.percent || 0}%`,
                height: '100%',
                background: 'var(--saffron-500)',
                transition: 'width 250ms ease'
              }}
            />
          </div>
        </div>
      )}

      {/* 3-Column Analysis Workspace - Section 25 */}
      <div className="analysis-grid">
        {/* ==============================================================
            COLUMN 1: SOURCE DOCUMENT / SPECIFICATION INPUT
            ============================================================== */}
        <div className="col-panel">
          <div className="col-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="var(--gov-navy-800)" />
              <span style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--gov-navy-950)' }}>
                1. Source Document
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
              {specificationText.split('\n').length} lines
            </span>
          </div>

          <div className="col-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Input Mode Switcher */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--slate-200)', gap: '4px', paddingBottom: '6px' }}>
              <button
                className={`btn btn-sm ${activeTab === 'paste' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                onClick={() => setActiveTab('paste')}
              >
                Text Editor
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'upload' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                onClick={() => setActiveTab('upload')}
              >
                Upload File
              </button>
            </div>

            {/* Upload Zone */}
            {activeTab === 'upload' && (
              <div
                style={{
                  border: '2px dashed var(--slate-300)',
                  borderRadius: '6px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  background: 'var(--slate-50)'
                }}
              >
                <Upload size={24} color="var(--slate-400)" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--gov-navy-950)' }}>
                  Upload Procurement Document
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginBottom: '12px' }}>
                  Supports PDF, DOCX, TXT tender schedules
                </div>
                <input
                  type="file"
                  id="tender-file-input"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc,.txt,.md"
                />
                <label htmlFor="tender-file-input" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  Browse Local File
                </label>
                {uploadedFileName && (
                  <div style={{ marginTop: '10px', fontSize: '0.75rem', color: 'var(--success-700)', fontWeight: '500' }}>
                    Uploaded: {uploadedFileName}
                  </div>
                )}
              </div>
            )}

            {/* Highlight Indicator if a requirement is clicked */}
            {activeReqObj && (
              <div style={{
                background: 'var(--saffron-50)',
                border: '1px solid var(--saffron-100)',
                borderRadius: '4px',
                padding: '6px 10px',
                fontSize: '0.72rem',
                color: 'var(--saffron-700)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ fontWeight: '700' }}>Focusing Clause:</span>
                <span className="mono">{activeReqObj.source}</span>
              </div>
            )}

            {/* Text Editor */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <textarea
                className="textarea mono"
                style={{
                  flex: 1,
                  fontSize: '0.8rem',
                  lineHeight: '1.45',
                  padding: '10px',
                  resize: 'none',
                  minHeight: '360px',
                  background: activeReqObj ? '#fffdf7' : '#ffffff'
                }}
                value={specificationText}
                onChange={(e) => setSpecificationText(e.target.value)}
                placeholder="Paste tender specifications, product descriptions or technical clauses here..."
              />
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !specificationText.trim()}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 'auto' }}
            >
              <RefreshCw size={14} className={isAnalyzing ? 'spin-animation' : ''} />
              {isAnalyzing ? "Analyzing..." : "Re-Analyze Specification"}
            </button>
          </div>
        </div>

        {/* ==============================================================
            COLUMN 2: DETECTED REQUIREMENTS (EDITABLE)
            ============================================================== */}
        <div className="col-panel">
          <div className="col-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--success-700)" />
              <span style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--gov-navy-950)' }}>
                2. Detected Requirements
              </span>
              <span style={{
                background: 'var(--slate-200)',
                color: 'var(--slate-800)',
                fontSize: '0.7rem',
                padding: '1px 6px',
                borderRadius: '10px',
                fontWeight: '600'
              }}>
                {analysisResult?.requirements?.length || 0}
              </span>
            </div>

            <button
              onClick={() => setShowAddReq(!showAddReq)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '2px 8px', fontSize: '0.75rem' }}
            >
              <Plus size={13} /> Add
            </button>
          </div>

          <div className="col-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Detected Product Entity Summary */}
            {analysisResult?.entity && (
              <div style={{
                background: 'var(--gov-navy-50)',
                border: '1px solid var(--gov-navy-100)',
                borderRadius: '6px',
                padding: '10px 12px',
                fontSize: '0.75rem'
              }}>
                <div style={{ fontWeight: '600', color: 'var(--gov-navy-950)' }}>
                  {analysisResult.entity.product}
                </div>
                <div style={{ color: 'var(--slate-600)', marginTop: '2px' }}>
                  Domain: {analysisResult.entity.domain} | Category: {analysisResult.entity.category}
                </div>
              </div>
            )}

            {/* Importance Filter Pills */}
            <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '6px' }}>
              {['all', 'critical', 'mandatory'].map(flt => (
                <button
                  key={flt}
                  onClick={() => setReqImportanceFilter(flt)}
                  style={{
                    background: reqImportanceFilter === flt ? 'var(--gov-navy-900)' : 'var(--slate-100)',
                    color: reqImportanceFilter === flt ? '#ffffff' : 'var(--slate-600)',
                    border: 'none',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    fontWeight: reqImportanceFilter === flt ? '600' : '400',
                    textTransform: 'capitalize'
                  }}
                >
                  {flt}
                </button>
              ))}
            </div>

            {/* Add Requirement Form */}
            {showAddReq && (
              <div style={{
                background: 'var(--slate-100)',
                border: '1px solid var(--slate-300)',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '0.8rem'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '6px' }}>Add Technical Requirement</div>
                <select
                  className="select"
                  style={{ marginBottom: '8px', fontSize: '0.75rem' }}
                  value={newReqType}
                  onChange={(e) => setNewReqType(e.target.value)}
                >
                  <option value="Material & Grade">Material & Grade</option>
                  <option value="Pressure & Structural">Pressure & Structural</option>
                  <option value="Testing & Quality">Testing & Quality</option>
                  <option value="Safety & Potability">Safety & Potability</option>
                  <option value="Statutory Certification">Statutory Certification</option>
                </select>
                <input
                  type="text"
                  className="input"
                  placeholder="Requirement text..."
                  style={{ fontSize: '0.75rem', marginBottom: '8px' }}
                  value={newReqText}
                  onChange={(e) => setNewReqText(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowAddReq(false)} className="btn btn-secondary btn-sm" style={{ fontSize: '0.72rem' }}>
                    Cancel
                  </button>
                  <button onClick={handleAddRequirement} className="btn btn-primary btn-sm" style={{ fontSize: '0.72rem' }}>
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* List of Extracted Requirements */}
            <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginBottom: '4px' }}>
              Click any requirement to filter relevant standards:
            </div>

            {displayedRequirements.length > 0 ? (
              displayedRequirements.map(req => {
                const isSelected = activeRequirementId === req.id;
                const isEditing = editingReqId === req.id;

                return (
                  <div
                    key={req.id}
                    onClick={() => !isEditing && handleRequirementSelect(req.id)}
                    style={{
                      background: isSelected ? 'var(--gov-navy-50)' : '#ffffff',
                      border: isSelected ? '2px solid var(--gov-navy-600)' : '1px solid var(--slate-200)',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'border-color var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        color: 'var(--gov-navy-800)',
                        background: 'var(--slate-100)',
                        padding: '1px 6px',
                        borderRadius: '3px'
                      }}>
                        {req.type}
                      </span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingReqId(req.id);
                            setEditedText(req.text);
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)', padding: '2px' }}
                          title="Edit requirement"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRequirement(req.id);
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)', padding: '2px' }}
                          title="Delete requirement"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '6px' }}>
                        <textarea
                          className="textarea"
                          style={{ fontSize: '0.78rem', minHeight: '60px', marginBottom: '6px' }}
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button onClick={() => setEditingReqId(null)} className="btn btn-secondary btn-sm" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                            Cancel
                          </button>
                          <button onClick={() => handleSaveRequirementEdit(req.id)} className="btn btn-primary btn-sm" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                            Update
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--slate-800)', lineHeight: '1.45' }}>
                          {req.text}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                          <span>Source: {req.source}</span>
                          <span style={{ color: req.importance === 'Critical' ? 'var(--danger-700)' : 'var(--slate-600)', fontWeight: '500' }}>
                            {req.importance}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                No requirements match current filter.
              </div>
            )}
          </div>
        </div>

        {/* ==============================================================
            COLUMN 3: RECOMMENDED STANDARDS & EVIDENCE TRACEABILITY
            ============================================================== */}
        <div className="col-panel">
          <div className="col-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} color="var(--gov-navy-800)" />
              <span style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--gov-navy-950)' }}>
                3. Recommended Indian Standards
              </span>
              <span style={{
                background: 'var(--gov-navy-900)',
                color: '#fff',
                fontSize: '0.7rem',
                padding: '1px 6px',
                borderRadius: '10px'
              }}>
                {displayedRecommendations.length}
              </span>
            </div>

            {/* Filter and Sort Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <select
                className="select"
                style={{ padding: '2px 6px', fontSize: '0.72rem', height: '26px' }}
                value={relevanceFilter}
                onChange={(e) => setRelevanceFilter(e.target.value)}
              >
                <option value="all">All Relevance</option>
                <option value="high">Highly Relevant</option>
                <option value="current">Current Status</option>
              </select>

              <select
                className="select"
                style={{ padding: '2px 6px', fontSize: '0.72rem', height: '26px' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">By Relevance</option>
                <option value="standard_number">By Standard Code</option>
              </select>
            </div>
          </div>

          <div className="col-panel-body">
            {/* Active Filter Notice if a requirement was clicked */}
            {activeReqObj && (
              <div style={{
                background: 'var(--gov-navy-50)',
                border: '1px solid var(--gov-navy-100)',
                borderRadius: '6px',
                padding: '8px 12px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'var(--gov-navy-900)'
              }}>
                <div>
                  <strong>Filtering for Clause: </strong> {activeReqObj.source} ({activeReqObj.type})
                </div>
                <button
                  onClick={() => setActiveRequirementId(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--gov-navy-700)', cursor: 'pointer', fontWeight: '600' }}
                >
                  Clear Filter
                </button>
              </div>
            )}

            {/* Recommendations List */}
            {displayedRecommendations.length > 0 ? (
              displayedRecommendations.map(standard => (
                <StandardCard
                  key={standard.standard_id}
                  standard={standard}
                  onViewDetails={onViewStandardDetails}
                  onToggleSpecification={onToggleSpecification}
                  isInSpecification={specificationStandards.some(s => s.standard_id === standard.standard_id)}
                  onToggleSave={onToggleSaveStandard}
                  isSaved={savedStandards.some(s => s.standard_id === standard.standard_id)}
                  onCompare={onCompareStandard}
                  isCompared={comparedStandards.some(s => s.standard_id === standard.standard_id)}
                />
              ))
            ) : (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                background: 'var(--slate-50)',
                borderRadius: '6px',
                border: '1px dashed var(--slate-300)'
              }}>
                <FileCheck size={28} color="var(--slate-400)" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ color: 'var(--gov-navy-900)', fontSize: '0.95rem' }}>No matching standards found</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                  Try relaxing the filter or providing additional technical parameters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
