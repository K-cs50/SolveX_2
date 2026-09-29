import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
  Plus,
  Check,
  Bookmark,
  BookmarkCheck,
  Scale,
  ExternalLink,
  AlertTriangle,
  GitBranch,
  Layers,
  ArrowRight,
  FileCheck,
  Copy,
  Tag
} from 'lucide-react';
import { StatusBadge, RelevanceBadge } from '../common/Badge';

export default function StandardCard({
  standard,
  onViewDetails,
  onToggleSpecification,
  isInSpecification,
  onToggleSave,
  isSaved,
  onCompare,
  isCompared
}) {
  const [isWhyExpanded, setIsWhyExpanded] = useState(false);
  const [isNormativeTreeOpen, setIsNormativeTreeOpen] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  const {
    standard_number,
    title,
    scope,
    status,
    division,
    committee,
    relevance,
    matchBasis = [],
    versionCheck = {},
    evidence = {},
    whyThisStandard = {},
    normative_references = [],
    allied_standards = [],
    test_methods = [],
    certification_information = {}
  } = standard;

  const handleCopyCitation = (e) => {
    e.stopPropagation();
    const citation = `${standard_number} — "${title}" (${versionCheck.verifiedVersion || standard.current_version}). Verified under ${evidence.sourceDocument || 'Bureau of Indian Standards'}.`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  return (
    <article
      className="card"
      style={{
        marginBottom: '16px',
        borderLeft: relevance?.includes('High') ? '4px solid var(--saffron-500)' : '1px solid var(--slate-200)',
        transition: 'all var(--transition-fast)'
      }}
      aria-labelledby={`std-${standard.standard_id}`}
    >
      {/* Header Row: Standard Code, Division, Status Badge, Relevance Badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <span id={`std-${standard.standard_id}`} className="standard-code">
              {standard_number}
            </span>
            {division && (
              <span style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--gov-navy-800)',
                background: 'var(--slate-100)',
                padding: '2px 6px',
                borderRadius: '3px',
                border: '1px solid var(--slate-300)'
              }}>
                {committee || division}
              </span>
            )}
            <StatusBadge status={status} />
            <RelevanceBadge relevance={relevance} />
          </div>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--gov-navy-950)', fontWeight: '600', lineHeight: '1.3' }}>
            {title}
          </h3>
        </div>

        {/* Quick Actions (Save + Copy Citation) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={handleCopyCitation}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px', color: copiedCitation ? 'var(--success-700)' : 'var(--slate-400)' }}
            title="Copy standard citation"
            aria-label="Copy citation"
          >
            {copiedCitation ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <button
            onClick={() => onToggleSave(standard)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px', color: isSaved ? 'var(--gov-navy-700)' : 'var(--slate-400)' }}
            title={isSaved ? "Saved in workspace" : "Save standard for later"}
            aria-label={isSaved ? "Remove from saved" : "Save standard"}
          >
            {isSaved ? <BookmarkCheck size={18} color="var(--gov-navy-800)" /> : <Bookmark size={18} />}
          </button>
        </div>
      </div>

      {/* Scope Preview */}
      <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '12px', lineHeight: '1.5' }}>
        {scope}
      </p>

      {/* Match Basis Tags - Section 31 */}
      {matchBasis && matchBasis.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--slate-500)', textTransform: 'uppercase', marginRight: '6px' }}>
            Match Basis:
          </span>
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px' }}>
            {matchBasis.map((mb, idx) => (
              <span
                key={idx}
                style={{
                  background: 'var(--slate-100)',
                  border: '1px solid var(--slate-300)',
                  borderRadius: '4px',
                  padding: '1px 7px',
                  fontSize: '0.72rem',
                  color: 'var(--slate-700)'
                }}
              >
                {typeof mb === 'string' ? mb : `${mb.type}: ${mb.label}`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Version & Amendment Status - Section 33 */}
      <div style={{
        background: 'var(--slate-50)',
        border: '1px solid var(--slate-200)',
        borderRadius: '6px',
        padding: '8px 12px',
        fontSize: '0.75rem',
        color: 'var(--slate-700)',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div>
          <strong style={{ color: 'var(--gov-navy-950)' }}>Version: </strong>
          <span className="mono">{versionCheck.verifiedVersion || standard.current_version || "Not specified"}</span>
          {standard.amendments?.length > 0 && (
            <span style={{ marginLeft: '8px', color: 'var(--gov-navy-700)' }}>
              ({standard.amendments.length} Amendment{standard.amendments.length > 1 ? 's' : ''} incorporated)
            </span>
          )}
        </div>
        <span style={{ color: status === 'Current' ? 'var(--success-700)' : 'var(--warning-700)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <FileCheck size={13} />
          {versionCheck.verificationNotice || "Status verified"}
        </span>
      </div>

      {/* Expandable "Why this standard?" Section 32 */}
      <div style={{ border: '1px solid var(--slate-200)', borderRadius: '6px', marginBottom: '10px', overflow: 'hidden' }}>
        <button
          onClick={() => setIsWhyExpanded(!isWhyExpanded)}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: isWhyExpanded ? 'var(--gov-navy-50)' : '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8125rem',
            fontWeight: '600',
            color: 'var(--gov-navy-900)'
          }}
          aria-expanded={isWhyExpanded}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={14} color="var(--gov-navy-700)" />
            Why this standard applies (Traceability & Evidence)
          </span>
          {isWhyExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isWhyExpanded && (
          <div style={{ padding: '12px 14px', background: '#ffffff', borderTop: '1px solid var(--slate-200)', fontSize: '0.78rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '8px', marginBottom: '8px' }}>
              <strong style={{ color: 'var(--slate-600)' }}>Procurement Need:</strong>
              <span style={{ color: 'var(--slate-900)' }}>{whyThisStandard.requirement || "Extracted from specification clause"}</span>

              <strong style={{ color: 'var(--slate-600)' }}>Standard Scope:</strong>
              <span style={{ color: 'var(--slate-700)' }}>{whyThisStandard.matchingScope || scope}</span>

              <strong style={{ color: 'var(--slate-600)' }}>Technical Rationale:</strong>
              <span style={{ color: 'var(--slate-700)' }}>{whyThisStandard.technicalRelevance}</span>

              <strong style={{ color: 'var(--slate-600)' }}>Supporting Citation:</strong>
              <span style={{ color: 'var(--gov-navy-900)', fontWeight: '500' }}>
                {evidence.sourceDocument ? `${evidence.sourceDocument} — ${evidence.location} (${evidence.title}): "${evidence.relevantContent}"` : "Evidence citation available in full record."}
              </span>
            </div>

            {certification_information.mandatory_status && (
              <div style={{
                marginTop: '10px',
                padding: '8px 10px',
                background: 'var(--saffron-50)',
                border: '1px solid var(--saffron-100)',
                borderRadius: '4px',
                color: 'var(--saffron-700)',
                fontSize: '0.72rem'
              }}>
                <strong>Certification Notice: </strong>
                {certification_information.scheme} — {certification_information.mandatory_status}.
                <div style={{ color: 'var(--slate-600)', marginTop: '2px' }}>
                  {certification_information.verification_note}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Normative & Allied Standards Tree Toggle */}
      {(normative_references.length > 0 || test_methods.length > 0) && (
        <div style={{ border: '1px solid var(--slate-200)', borderRadius: '6px', marginBottom: '14px', overflow: 'hidden' }}>
          <button
            onClick={() => setIsNormativeTreeOpen(!isNormativeTreeOpen)}
            style={{
              width: '100%',
              padding: '6px 12px',
              background: isNormativeTreeOpen ? 'var(--slate-100)' : 'var(--slate-50)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              color: 'var(--slate-700)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
              <GitBranch size={13} color="var(--gov-navy-700)" />
              Normative References & Testing Hierarchy ({normative_references.length} references, {test_methods.length} test codes)
            </span>
            {isNormativeTreeOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {isNormativeTreeOpen && (
            <div style={{ padding: '10px 14px', background: '#ffffff', borderTop: '1px solid var(--slate-200)', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {normative_references.map((nr, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ color: 'var(--slate-400)' }}>↳</span>
                    <span className="mono" style={{ fontWeight: '600', color: 'var(--gov-navy-800)', minWidth: '120px' }}>
                      {nr.standard_number}
                    </span>
                    <span style={{ color: 'var(--slate-600)', flex: 1 }}>{nr.title}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--saffron-700)', background: 'var(--saffron-50)', padding: '1px 5px', borderRadius: '3px' }}>
                      {nr.relationship_type}
                    </span>
                  </div>
                ))}
                {test_methods.map((tm, i) => (
                  <div key={`tm-${i}`} style={{ display: 'flex', alignItems: 'baseline', gap: '8px', borderTop: '1px dashed var(--slate-200)', paddingTop: '4px' }}>
                    <span style={{ color: 'var(--slate-400)' }}>⚡</span>
                    <span className="mono" style={{ fontWeight: '600', color: 'var(--slate-700)', minWidth: '120px' }}>
                      {tm.clause}
                    </span>
                    <span style={{ color: 'var(--slate-600)', flex: 1 }}>{tm.title}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--success-700)', background: 'var(--success-50)', padding: '1px 5px', borderRadius: '3px' }}>
                      Test Procedure
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Card Actions Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--slate-100)' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => onViewDetails(standard)}
            className="btn btn-secondary btn-sm"
          >
            <FileText size={13} />
            Full Record
          </button>
          <button
            onClick={() => onCompare(standard)}
            className={`btn btn-sm ${isCompared ? 'btn-primary' : 'btn-outline'}`}
            title="Add to side-by-side comparison"
          >
            <Scale size={13} />
            {isCompared ? "In Comparison" : "Compare"}
          </button>
        </div>

        <button
          onClick={() => onToggleSpecification(standard)}
          className={`btn btn-sm ${isInSpecification ? 'btn-accent' : 'btn-primary'}`}
        >
          {isInSpecification ? (
            <>
              <Check size={14} />
              In Specification
            </>
          ) : (
            <>
              <Plus size={14} />
              Add to Specification
            </>
          )}
        </button>
      </div>
    </article>
  );
}
