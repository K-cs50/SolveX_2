import React from 'react';
import { ShieldCheck, BookOpen, Layers, CheckCircle2, AlertTriangle, FileText, ArrowRight } from 'lucide-react';

export default function AboutPage({ onAnalyzeClick, onExploreStandardsClick }) {
  return (
    <div style={{ maxWidth: '1020px', margin: '0 auto', padding: '48px 24px 80px' }}>
      {/* Title */}
      <div style={{ marginBottom: '36px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--gov-navy-50)',
          color: 'var(--gov-navy-900)',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: '600',
          marginBottom: '12px'
        }}>
          <ShieldCheck size={14} />
          Institutional Transparency & Governance
        </div>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--gov-navy-950)', fontWeight: '700', letterSpacing: '-0.02em' }}>
          About SolveX
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--slate-600)', marginTop: '8px', lineHeight: '1.6' }}>
          An evidence-driven recommendation and procurement intelligence platform engineered for public-sector specification drafters and technical evaluators.
        </p>
      </div>

      {/* Core Question & Workflow */}
      <div className="card" style={{ marginBottom: '32px', background: 'var(--slate-50)', borderLeft: '4px solid var(--gov-navy-800)' }}>
        <h2 style={{ fontSize: '1.15rem', color: 'var(--gov-navy-950)', marginBottom: '10px' }}>
          The Fundamental Question SolveX Answers
        </h2>
        <blockquote style={{ fontSize: '1rem', color: 'var(--gov-navy-900)', fontWeight: '500', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '14px' }}>
          "Which Indian Standards are applicable to this procurement requirement, why are they applicable, what related standards should also be considered, which version is relevant, and what evidence supports the recommendation?"
        </blockquote>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
          SolveX eliminates ambiguity by grounding all algorithmic discovery in clause-level citations, verified publication dates, gazetted amendments, and statutory Quality Control Orders (QCOs).
        </p>
      </div>

      {/* Product Principles - Section 2 */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.35rem', color: 'var(--gov-navy-950)', marginBottom: '16px', fontWeight: '700' }}>
          Product Governance Principles
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            {
              title: "Evidence-Driven",
              desc: "Recommendations are never made on abstract generative confidence. Every suggested standard links directly to verified test methods, scope definitions, or material clauses."
            },
            {
              title: "Transparent & Deterministic",
              desc: "The interface explains the matching basis (product type, technical parameter, pressure rating) without hiding internal logic behind opaque AI percentages."
            },
            {
              title: "Anti-Hallucination Protocol",
              desc: "The system never fabricates standard numbers, amendments, or compliance obligations. If evidence is unavailable, it explicitly states 'Evidence not available'."
            },
            {
              title: "Institutional Restraint",
              desc: "Designed specifically for information-dense, audit-traceable public procurement workflows, avoiding consumer tech gimmicks or chatbots as the primary UI."
            }
          ].map((item, idx) => (
            <div key={idx} className="card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle2 size={16} color="var(--success-700)" />
                <h3 style={{ fontSize: '0.95rem', color: 'var(--gov-navy-950)', fontWeight: '600' }}>
                  {item.title}
                </h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimers & Operational Boundaries - Section 46, 58 */}
      <div className="card" style={{ border: '1px solid var(--slate-300)', padding: '24px', marginBottom: '36px' }}>
        <h3 style={{ fontSize: '1.05rem', color: 'var(--gov-navy-950)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="var(--warning-700)" />
          Operational Status & Demonstration Notice
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', lineHeight: '1.6', marginBottom: '12px' }}>
          SolveX operates as an intelligent standards discovery system and specification drafting aid. It does NOT claim official governmental identity or ownership.
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', lineHeight: '1.6' }}>
          Procurement officials are advised that final tender specifications and legal conditions of contract must be cross-verified against the official publications, gazette orders, and online portals of the <strong>Bureau of Indian Standards (BIS)</strong> and relevant Central/State Ministries.
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button onClick={onAnalyzeClick} className="btn btn-primary btn-lg">
          Launch Analysis Console
        </button>
        <button onClick={onExploreStandardsClick} className="btn btn-secondary btn-lg">
          Browse Standards Catalog
        </button>
      </div>
    </div>
  );
}
