import React, { useState } from 'react';
import {
  Plus,
  FileText,
  Bookmark,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  TrendingUp,
  ShieldCheck,
  Activity,
  Target,
  FileCheck,
  Folder,
  AlertTriangle,
  BarChart2,
  Download
} from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { STANDARDS_DATABASE } from '../../services/standardsDatabase';

export default function DashboardOverview({
  onStartNewAnalysis,
  recentAnalyses = [],
  savedStandards = [],
  recentDocuments = [],
  onSelectStandard,
  onRemoveSavedStandard,
  onReopenAnalysis,
  onViewDocument
}) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredAnalyses = recentAnalyses.filter(a => {
    if (activeFilter === 'all') return true;
    return true; // Placeholder for future filtering
  });

  const totalStandardsCovered = STANDARDS_DATABASE.length;
  const verifiedCount = STANDARDS_DATABASE.filter(s => s.status === 'current').length;
  const complianceRate = Math.round((verifiedCount / totalStandardsCovered) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

      {/* Welcome Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--gov-navy-950) 0%, var(--gov-navy-800) 100%)',
        borderRadius: '10px',
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>
              Procurement Session Active
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: '700', marginBottom: '6px' }}>
            Procurement Standards Workspace
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', maxWidth: '540px' }}>
            Analyze specifications, discover applicable Indian Standards, and build evidence-backed procurement documents.
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={onStartNewAnalysis}
            className="btn btn-accent btn-lg"
          >
            <Plus size={18} />
            New Specification Analysis
          </button>
          <button
            onClick={() => {}}
            className="btn btn-secondary btn-lg"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div className="kpi-card kpi-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="kpi-value">{totalStandardsCovered}</div>
              <div className="kpi-label">Standards Indexed</div>
              <div className="kpi-sub">BIS Knowledge Base</div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--gov-navy-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gov-navy-700)' }}>
              <Layers size={18} />
            </div>
          </div>
        </div>

        <div className="kpi-card kpi-success">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="kpi-value">{verifiedCount}</div>
              <div className="kpi-label">Active Standards</div>
              <div className="kpi-sub">Currently verified</div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--success-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success-700)' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
        </div>

        <div className="kpi-card kpi-warning">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="kpi-value">{recentAnalyses.length}</div>
              <div className="kpi-label">Analyses Run</div>
              <div className="kpi-sub">This session</div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--saffron-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--saffron-600)' }}>
              <Activity size={18} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="kpi-value">{savedStandards.length}</div>
              <div className="kpi-label">Saved Standards</div>
              <div className="kpi-sub">In quick reference</div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-600)' }}>
              <Bookmark size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Work Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>

        {/* Recent Analyses Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="card-header" style={{ padding: '16px 20px', marginBottom: 0, borderRadius: '8px 8px 0 0', background: 'var(--slate-50)' }}>
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="var(--gov-navy-800)" />
              Recent Specification Analyses
            </span>
            <button
              onClick={onStartNewAnalysis}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              <Plus size={13} />
              New Analysis
            </button>
          </div>

          {filteredAnalyses.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Specification</th>
                    <th>Standards Found</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnalyses.map(analysis => (
                    <tr key={analysis.id}>
                      <td style={{ fontWeight: '500', color: 'var(--gov-navy-950)' }}>
                        {analysis.title}
                        <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontFamily: 'var(--font-mono)' }}>
                          {analysis.tenderNumber || 'Ad-hoc Analysis'}
                        </div>
                      </td>
                      <td>
                        <span style={{
                          background: 'var(--gov-navy-50)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: '600',
                          fontSize: '0.75rem',
                          color: 'var(--gov-navy-900)',
                          border: '1px solid var(--gov-navy-100)'
                        }}>
                          {analysis.standardsCount} IS
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-current" style={{ fontSize: '0.7rem' }}>
                          <CheckCircle2 size={10} /> Verified
                        </span>
                      </td>
                      <td style={{ color: 'var(--slate-500)', fontSize: '0.75rem' }}>
                        {analysis.date}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => onReopenAnalysis(analysis.preset)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem' }}
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
              <FileCheck size={28} color="var(--slate-300)" style={{ marginBottom: '12px' }} />
              <p>No analyses yet. Start by analyzing a procurement specification.</p>
              <button onClick={onStartNewAnalysis} className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                Start First Analysis
              </button>
            </div>
          )}
        </div>

        {/* Saved Standards List */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="card-header" style={{ padding: '16px 20px', marginBottom: 0, borderRadius: '8px 8px 0 0', background: 'var(--slate-50)' }}>
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bookmark size={16} color="var(--gov-navy-800)" />
              Saved Standards ({savedStandards.length})
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Quick Reference</span>
          </div>

          {savedStandards.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', maxHeight: '320px', overflowY: 'auto' }}>
              {savedStandards.map((std, i) => (
                <div
                  key={std.standard_id}
                  style={{
                    padding: '10px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: i < savedStandards.length - 1 ? '1px solid var(--slate-100)' : 'none',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="standard-code" style={{ fontSize: '0.78rem' }}>{std.standard_number}</span>
                      <StatusBadge status={std.status} size="sm" />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-700)', marginTop: '3px', fontWeight: '500', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {std.title}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => onSelectStandard(std)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px' }}
                      title="View standard details"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => onRemoveSavedStandard(std)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px', color: 'var(--slate-400)' }}
                      title="Remove from saved"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
              <Bookmark size={24} color="var(--slate-300)" style={{ marginBottom: '10px' }} />
              <p>No saved standards. Bookmark any standard to access it quickly here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Documents Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="card-header" style={{ padding: '16px 20px', marginBottom: 0, borderRadius: '8px 8px 0 0', background: 'var(--slate-50)' }}>
          <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="var(--gov-navy-800)" />
            Recent Procurement Documents & Tender Schedules
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Document Vault</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Type</th>
                <th>Tender Package</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentDocuments.map(doc => (
                <tr key={doc.id}>
                  <td style={{ fontWeight: '500', color: 'var(--gov-navy-950)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={14} color="var(--gov-navy-700)" />
                      {doc.filename}
                    </div>
                  </td>
                  <td style={{ color: 'var(--slate-600)' }}>{doc.type}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--slate-700)' }}>
                    {doc.tenderRef}
                  </td>
                  <td>
                    <span className="badge badge-current" style={{ fontSize: '0.7rem' }}>
                      <CheckCircle2 size={10} /> {doc.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => onViewDocument(doc)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      Analyze
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <button
          onClick={onStartNewAnalysis}
          className="card card-interactive"
          style={{ textAlign: 'left', cursor: 'pointer', border: 'none', font: 'inherit' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--gov-navy-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gov-navy-700)', flexShrink: 0 }}>
              <FileCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gov-navy-950)', marginBottom: '4px' }}>
                Analyze New Specification
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', margin: 0, lineHeight: '1.4' }}>
                Paste or upload a procurement tender to extract applicable IS requirements.
              </p>
            </div>
          </div>
        </button>

        <button
          className="card card-interactive"
          style={{ textAlign: 'left', cursor: 'pointer', border: 'none', font: 'inherit' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--success-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success-700)', flexShrink: 0 }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gov-navy-950)', marginBottom: '4px' }}>
                Verify Compliance Status
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', margin: 0, lineHeight: '1.4' }}>
                Check if cited standards are current or superseded under BIS.
              </p>
            </div>
          </div>
        </button>

        <button
          className="card card-interactive"
          style={{ textAlign: 'left', cursor: 'pointer', border: 'none', font: 'inherit' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--saffron-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--saffron-600)', flexShrink: 0 }}>
              <Target size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gov-navy-950)', marginBottom: '4px' }}>
                Build Specification Schedule
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', margin: 0, lineHeight: '1.4' }}>
                Generate a structured IS specification schedule for your tender document.
              </p>
            </div>
          </div>
        </button>
      </div>

    </div>
  );
}
