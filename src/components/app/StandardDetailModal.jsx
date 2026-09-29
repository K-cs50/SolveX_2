import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge, RelevanceBadge } from '../common/Badge';
import {
  FileText,
  ShieldCheck,
  Check,
  Plus,
  Bookmark,
  BookmarkCheck,
  Scale,
  Calendar,
  Layers,
  Wrench,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function StandardDetailModal({
  standard,
  isOpen,
  onClose,
  onToggleSpecification,
  isInSpecification,
  onToggleSave,
  isSaved,
  onCompare,
  isCompared
}) {
  if (!standard) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={standard.standard_number}
      subtitle={standard.title}
      maxWidth="860px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top Identity Block */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--slate-200)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <StatusBadge status={standard.status} />
            <RelevanceBadge relevance={standard.relevance} />
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Publication Date: {standard.publication_date}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onToggleSave(standard)}
              className="btn btn-secondary btn-sm"
            >
              {isSaved ? <BookmarkCheck size={14} color="var(--gov-navy-800)" /> : <Bookmark size={14} />}
              {isSaved ? "Saved" : "Save Standard"}
            </button>
            <button
              onClick={() => onCompare(standard)}
              className={`btn btn-sm ${isCompared ? 'btn-primary' : 'btn-outline'}`}
            >
              <Scale size={14} />
              {isCompared ? "In Comparison" : "Compare"}
            </button>
            <button
              onClick={() => onToggleSpecification(standard)}
              className={`btn btn-sm ${isInSpecification ? 'btn-accent' : 'btn-primary'}`}
            >
              {isInSpecification ? <Check size={14} /> : <Plus size={14} />}
              {isInSpecification ? "In Specification" : "Add to Specification"}
            </button>
          </div>
        </div>

        {/* Scope Section */}
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--gov-navy-950)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            1. Scope & Jurisdiction
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: '1.6', background: 'var(--slate-50)', padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--slate-200)' }}>
            {standard.scope}
          </p>
        </div>

        {/* Version & Amendments Breakdown */}
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--gov-navy-950)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            2. Current Version & Amendments History
          </h4>
          <div style={{ background: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', background: 'var(--slate-100)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ fontWeight: '600', color: 'var(--gov-navy-950)' }}>Active Formulation: {standard.current_version}</span>
              <span style={{ color: 'var(--slate-500)' }}>Supersedes: {standard.supersedes || "None"}</span>
            </div>
            {standard.amendments && standard.amendments.length > 0 ? (
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {standard.amendments.map((am, i) => (
                  <div key={i} style={{ fontSize: '0.8rem', display: 'flex', gap: '10px', alignItems: 'baseline' }}>
                    <span className="mono" style={{ fontWeight: '600', color: 'var(--gov-navy-800)', minWidth: '130px' }}>
                      {am.number} ({am.date}):
                    </span>
                    <span style={{ color: 'var(--slate-600)' }}>{am.summary}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '10px 14px', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                No active amendments gazetted for this edition.
              </div>
            )}
          </div>
        </div>

        {/* Normative & Allied Standards Relationships - Section 18 */}
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--gov-navy-950)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            3. Related & Normative Standards Hierarchy
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Normative References */}
            <div style={{ border: '1px solid var(--slate-200)', borderRadius: '6px', padding: '12px' }}>
              <div style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--gov-navy-900)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} />
                Normative References (Required by this standard)
              </div>
              {standard.normative_references?.length > 0 ? (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                  {standard.normative_references.map((nr, idx) => (
                    <li key={idx} style={{ paddingBottom: '6px', borderBottom: idx < standard.normative_references.length - 1 ? '1px dashed var(--slate-200)' : 'none' }}>
                      <span className="mono" style={{ fontWeight: '600', color: 'var(--gov-navy-800)' }}>{nr.standard_number}</span>
                      <div style={{ color: 'var(--slate-600)', marginTop: '2px' }}>{nr.title}</div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--saffron-700)', background: 'var(--saffron-50)', padding: '1px 5px', borderRadius: '3px' }}>
                        {nr.relationship_type}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>None listed</span>
              )}
            </div>

            {/* Allied & Installation Standards */}
            <div style={{ border: '1px solid var(--slate-200)', borderRadius: '6px', padding: '12px' }}>
              <div style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--gov-navy-900)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wrench size={14} />
                Allied & Installation Standards
              </div>
              {standard.allied_standards?.length > 0 ? (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                  {standard.allied_standards.map((as, idx) => (
                    <li key={idx} style={{ paddingBottom: '6px', borderBottom: idx < standard.allied_standards.length - 1 ? '1px dashed var(--slate-200)' : 'none' }}>
                      <span className="mono" style={{ fontWeight: '600', color: 'var(--gov-navy-800)' }}>{as.standard_number}</span>
                      <div style={{ color: 'var(--slate-600)', marginTop: '2px' }}>{as.title}</div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--slate-600)', background: 'var(--slate-100)', padding: '1px 5px', borderRadius: '3px' }}>
                        {as.relationship_type}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>None listed</span>
              )}
            </div>
          </div>
        </div>

        {/* Test Methods & Clause Traceability */}
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--gov-navy-950)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            4. Testing Requirements & Verification Clauses
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {standard.test_methods?.map((tm, idx) => (
              <div key={idx} style={{
                background: 'var(--slate-50)',
                border: '1px solid var(--slate-200)',
                borderRadius: '6px',
                padding: '10px 14px',
                fontSize: '0.8rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--gov-navy-950)' }}>{tm.title}</span>
                  <span className="mono" style={{ fontSize: '0.72rem', background: 'var(--slate-200)', padding: '2px 6px', borderRadius: '3px' }}>
                    {tm.clause}
                  </span>
                </div>
                <div style={{ color: 'var(--slate-600)' }}>{tm.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Statutory Certification & Compliance Guidance - Section 34 */}
        <div style={{
          background: 'var(--slate-100)',
          border: '1px solid var(--slate-300)',
          borderRadius: '6px',
          padding: '14px',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <ShieldCheck size={16} color="var(--gov-navy-800)" />
            <span style={{ fontWeight: '600', color: 'var(--gov-navy-950)' }}>
              Certification & Statutory Marking Guidance
            </span>
          </div>
          <div style={{ color: 'var(--slate-700)', lineHeight: '1.5', marginBottom: '6px' }}>
            <strong>Applicable Scheme: </strong>
            {standard.certification_information?.scheme || "BIS Certification Scheme"}
          </div>
          <div style={{ color: 'var(--slate-700)', lineHeight: '1.5', marginBottom: '6px' }}>
            <strong>Mandatory Status: </strong>
            {standard.certification_information?.mandatory_status || "Applicability requires verification"}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontStyle: 'italic' }}>
            {standard.certification_information?.verification_note || "Verify current QCO notifications prior to tender release."}
          </div>
        </div>
      </div>
    </Modal>
  );
}
