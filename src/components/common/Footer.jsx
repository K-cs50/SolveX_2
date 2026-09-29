import React from 'react';
import { Shield, BookOpen, ExternalLink, Award, FileCheck } from 'lucide-react';

export default function Footer({ onNavChange }) {
  return (
    <footer className="gov-footer">
      <div className="gov-footer-container">
        <div className="gov-footer-grid">
          {/* Col 1: Brand & Purpose */}
          <div className="footer-col" style={{ paddingRight: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div className="brand-emblem" style={{ width: '32px', height: '32px', fontSize: '0.95rem' }}>
                SX
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', letterSpacing: '-0.02em' }}>
                Solve<span style={{ color: 'var(--saffron-500)' }}>X</span>
              </span>
            </div>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '16px' }}>
              Indian Standards Intelligence for Procurement. An evidence-driven platform assisting technical evaluators, public sector bodies, and specification drafters in identifying, verifying, and citing applicable Indian Standards.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'var(--slate-300)',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                BIS CED, ETD, MTD, LITD
              </span>
              <span style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'var(--slate-300)',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                Clause-Level Traceability
              </span>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavChange('standards')}>Standards Repository</button></li>
              <li><button onClick={() => onNavChange('procurement')}>Procurement Workflow</button></li>
              <li><button onClick={() => onNavChange('recommendations')}>Recommendation Engine</button></li>
              <li><button onClick={() => onNavChange('documents')}>Document Analysis</button></li>
              <li><button onClick={() => onNavChange('app')}>Specification Builder</button></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div className="footer-col">
            <h4>Resources & Guidance</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavChange('about')}>About SolveX Methodology</button></li>
              <li><button onClick={() => onNavChange('about')}>Evidence & Transparency Protocol</button></li>
              <li><button onClick={() => onNavChange('about')}>Quality Control Orders (QCO) Index</button></li>
              <li><button onClick={() => onNavChange('about')}>Normative Reference Guide</button></li>
              <li><button onClick={() => onNavChange('about')}>Technical Documentation</button></li>
            </ul>
          </div>

          {/* Col 4: Legal & Standards Notice */}
          <div className="footer-col">
            <h4>Compliance & Legal</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavChange('about')}>Accessibility Statement</button></li>
              <li><button onClick={() => onNavChange('about')}>Terms of Use</button></li>
              <li><button onClick={() => onNavChange('about')}>Privacy Policy</button></li>
              <li><button onClick={() => onNavChange('about')}>Disclaimer of Official Status</button></li>
            </ul>
            <div style={{
              marginTop: '16px',
              padding: '10px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '6px',
              fontSize: '0.7rem',
              color: 'var(--slate-400)',
              lineHeight: '1.4'
            }}>
              <strong>Demonstration Disclaimer:</strong> SolveX operates as an intelligent standards discovery system. Final procurement specifications must be validated against official gazetted publications of the Bureau of Indian Standards (BIS).
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="gov-footer-bottom">
          <div>
            © 2026 SolveX — Standards & Procurement Intelligence Platform. Built for Indian Public Procurement Integrity.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>WCAG 2.1 AA Compliant</span>
            <span>Security Audited</span>
            <span>ISO/IEC 27001 Data Governance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
