import React, { useState } from 'react';
import {
  History, FileText, ArrowRight, Layers, Calendar,
  CheckCircle2, Search, Download, Filter, Eye,
  Clock, User, ShieldCheck, TrendingUp, RefreshCw
} from 'lucide-react';
import { MOCK_TENDERS } from '../../data/mockTenders';

const ALL_HISTORY = [
  {
    id: 'hist-1',
    title: 'Jal Jeevan Mission HDPE Pressure Pipeline Package',
    inputType: 'Tender Technical Schedule (PDF)',
    date: '2026-03-25',
    time: '14:32',
    standardsFound: 5,
    requirementsExtracted: 12,
    workspace: 'Jal Jeevan Mission Rural Distribution',
    officer: 'K. Chaitanya',
    status: 'Verified',
    complianceScore: 94,
    preset: MOCK_TENDERS[0]
  },
  {
    id: 'hist-2',
    title: '33kV Distribution Transformer & VCB Switchgear Package',
    inputType: 'Pasted Specification Text',
    date: '2026-03-24',
    time: '11:15',
    standardsFound: 4,
    requirementsExtracted: 8,
    workspace: '33/11 kV Grid Substation Augmentation',
    officer: 'K. Chaitanya',
    status: 'Verified',
    complianceScore: 88,
    preset: MOCK_TENDERS[1]
  },
  {
    id: 'hist-3',
    title: 'Smart City Video Surveillance Cameras & Security Hardware',
    inputType: 'RFP Volume II (PDF Upload)',
    date: '2026-03-22',
    time: '16:40',
    standardsFound: 4,
    requirementsExtracted: 10,
    workspace: 'Smart City Video Surveillance RFP',
    officer: 'K. Chaitanya',
    status: 'Verified',
    complianceScore: 91,
    preset: MOCK_TENDERS[2]
  },
  {
    id: 'hist-4',
    title: 'Elevated Corridor Fe 500D Reinforcement Rebars & Plates',
    inputType: 'Structural Bill of Quantities',
    date: '2026-03-20',
    time: '09:20',
    standardsFound: 6,
    requirementsExtracted: 15,
    workspace: 'Flyover Corridor Reinforcement',
    officer: 'K. Chaitanya',
    status: 'Verified',
    complianceScore: 97,
    preset: MOCK_TENDERS[3]
  }
];

export default function AnalysisHistory({ onReopenAnalysis }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = ALL_HISTORY.filter(item =>
    !searchQuery ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.workspace.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.inputType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgCompliance = Math.round(ALL_HISTORY.reduce((sum, h) => sum + h.complianceScore, 0) / ALL_HISTORY.length);
  const totalStandards = ALL_HISTORY.reduce((sum, h) => sum + h.standardsFound, 0);
  const totalReqs = ALL_HISTORY.reduce((sum, h) => sum + h.requirementsExtracted, 0);

  const complianceColor = (score) =>
    score >= 90 ? 'var(--success-700)' : score >= 75 ? 'var(--saffron-600)' : 'var(--danger-600)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: '10px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <History size={20} color="var(--gov-navy-800)" />
            <h1 style={{ fontSize: '1.35rem', color: 'var(--gov-navy-950)', fontWeight: '700' }}>
              Specification Analysis Audit History
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
            Tamper-evident audit log of all specification evaluations, requirement extractions, and recommended Indian Standards in this session.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.78rem' }}>
          <Download size={14} /> Export Audit Log (CSV)
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total Analyses', value: ALL_HISTORY.length, color: 'var(--gov-navy-700)' },
          { label: 'Standards Matched', value: totalStandards, color: 'var(--info-700)' },
          { label: 'Requirements Extracted', value: totalReqs, color: 'var(--saffron-600)' },
          { label: 'Avg. Compliance Score', value: `${avgCompliance}%`, color: complianceColor(avgCompliance) }
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: stat.color, fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: '600' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '12px 16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          <input type="text" className="input" style={{ paddingLeft: '32px' }}
            placeholder="Search audit history by specification title, workspace, or input type..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* History Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="card-header" style={{ padding: '14px 18px', marginBottom: 0, borderRadius: '8px 8px 0 0', background: 'var(--slate-50)' }}>
          <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={15} color="var(--gov-navy-800)" />
            Audit Records ({filtered.length})
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--success-700)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> All Records Verified
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Analysis Title</th>
                <th>Input Source</th>
                <th>Date & Time</th>
                <th>Workspace</th>
                <th>Standards</th>
                <th>Reqs.</th>
                <th>Compliance</th>
                <th>Audit Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <React.Fragment key={item.id}>
                  <tr
                    style={{ cursor: 'pointer' }}
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  >
                    <td style={{ fontWeight: '500', color: 'var(--gov-navy-950)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={14} color="var(--gov-navy-700)" />
                        <span style={{ fontSize: '0.82rem' }}>{item.title}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--slate-600)', fontSize: '0.8rem' }}>{item.inputType}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                      {item.date}<br /><span style={{ fontSize: '0.68rem' }}>{item.time}</span>
                    </td>
                    <td style={{ color: 'var(--slate-700)', fontSize: '0.8rem' }}>{item.workspace}</td>
                    <td>
                      <span style={{ background: 'var(--gov-navy-50)', color: 'var(--gov-navy-900)', padding: '2px 8px', borderRadius: '4px', fontWeight: '600', fontSize: '0.75rem', border: '1px solid var(--gov-navy-100)' }}>
                        {item.standardsFound} IS
                      </span>
                    </td>
                    <td style={{ color: 'var(--slate-700)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: '600' }}>
                      {item.requirementsExtracted}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--slate-200)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${item.complianceScore}%`, background: complianceColor(item.complianceScore), borderRadius: '2px' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: complianceColor(item.complianceScore), fontFamily: 'var(--font-mono)' }}>
                          {item.complianceScore}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-current" style={{ fontSize: '0.7rem' }}>
                        <CheckCircle2 size={10} /> {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); onReopenAnalysis(item.preset); }}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        Reopen <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Detail Row */}
                  {expandedId === item.id && (
                    <tr>
                      <td colSpan={9} style={{ background: 'var(--gov-navy-50)', padding: '16px 20px', borderBottom: '2px solid var(--gov-navy-100)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', fontSize: '0.8125rem' }}>
                          <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                              Analysis Officer
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gov-navy-900)', fontWeight: '600' }}>
                              <User size={14} /> {item.officer}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                              Audit Trail ID
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--slate-700)', background: 'var(--slate-100)', padding: '3px 8px', borderRadius: '4px', display: 'inline-block' }}>
                              {item.id.toUpperCase()}-{new Date(item.date).getFullYear()}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                              Compliance Summary
                            </div>
                            <div style={{ color: complianceColor(item.complianceScore), fontWeight: '700', fontSize: '0.9rem' }}>
                              {item.complianceScore >= 90 ? '✓ High Compliance' : item.complianceScore >= 75 ? '⚠ Moderate Compliance' : '✗ Low Compliance'}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Notice */}
      <div style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: '8px', padding: '14px 18px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <ShieldCheck size={16} color="var(--gov-navy-700)" />
        <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
          <strong style={{ color: 'var(--gov-navy-950)' }}>Procurement Audit Assurance:</strong> All analysis records are timestamped, officer-attributed, and stored in immutable audit log format for procurement compliance verification under GFR 2017 Rule 175(iv).
        </div>
      </div>
    </div>
  );
}
