import React, { useState } from 'react';
import {
  Folder, FolderOpen, Plus, FileText, Layers, Calendar,
  ExternalLink, Trash2, Edit2, CheckCircle2, Clock,
  BarChart2, Search, ArrowRight, ShieldCheck
} from 'lucide-react';
import { MOCK_TENDERS } from '../../data/mockTenders';

const WORKSPACE_COLORS = [
  { bg: 'var(--gov-navy-50)', border: 'var(--gov-navy-100)', icon: 'var(--gov-navy-700)' },
  { bg: 'var(--success-50)', border: 'var(--success-100)', icon: 'var(--success-700)' },
  { bg: 'var(--saffron-50)', border: 'var(--saffron-100)', icon: 'var(--saffron-600)' },
  { bg: 'var(--info-100)', border: 'rgba(29,78,216,0.2)', icon: 'var(--info-700)' },
];

export default function WorkspacesManager({ onOpenWorkspaceTender, onShowToast }) {
  const [workspaces, setWorkspaces] = useState([
    {
      id: 'ws-1', colorIdx: 0,
      name: 'Jal Jeevan Mission Rural Distribution',
      description: 'Drinking water distribution network covering 42 gram panchayats. HDPE pipes (DN 90–200mm), sluice valves and service connections.',
      documentsCount: 4, standardsCount: 5, analysesCount: 3,
      updatedDate: '2026-03-25', status: 'active',
      preset: MOCK_TENDERS[0],
      tags: ['Jal Jeevan Mission', 'HDPE Pipes', 'Water Supply']
    },
    {
      id: 'ws-2', colorIdx: 1,
      name: '33/11 kV Grid Substation Augmentation',
      description: 'Substation upgrade with 1000 kVA step-down transformers, vacuum circuit breakers, and earthing systems.',
      documentsCount: 2, standardsCount: 4, analysesCount: 2,
      updatedDate: '2026-03-21', status: 'active',
      preset: MOCK_TENDERS[1],
      tags: ['Power Transmission', 'Transformers', 'DISCOM']
    },
    {
      id: 'ws-3', colorIdx: 2,
      name: 'Smart City Video Surveillance RFP',
      description: 'AI-enabled CCTV cameras at 120 junctions, video management system, CRS compliance, and vandal-proof enclosures.',
      documentsCount: 3, standardsCount: 4, analysesCount: 4,
      updatedDate: '2026-03-19', status: 'review',
      preset: MOCK_TENDERS[2],
      tags: ['Smart City', 'Surveillance', 'CRS Certification']
    },
    {
      id: 'ws-4', colorIdx: 3,
      name: 'Flyover Corridor Structural Steel',
      description: 'High-ductility seismic grade Fe 500D TMT rebars and Grade E250 hot-rolled structural steel girder plates for road over bridge.',
      documentsCount: 2, standardsCount: 6, analysesCount: 2,
      updatedDate: '2026-03-15', status: 'completed',
      preset: MOCK_TENDERS[3],
      tags: ['Structural Steel', 'TMT Rebars', 'Civil Works']
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const handleCreateWorkspace = () => {
    if (!newName.trim()) return;
    const newWs = {
      id: `ws-${Date.now()}`,
      colorIdx: Math.floor(Math.random() * WORKSPACE_COLORS.length),
      name: newName.trim(),
      description: newDesc.trim() || 'Procurement technical evaluation workspace',
      documentsCount: 0, standardsCount: 0, analysesCount: 0,
      updatedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      preset: MOCK_TENDERS[0],
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    };
    setWorkspaces([newWs, ...workspaces]);
    setNewName(''); setNewDesc(''); setNewTags('');
    setShowCreateModal(false);
    if (onShowToast) onShowToast(`Workspace "${newWs.name}" created successfully.`, 'success');
  };

  const handleDelete = (id) => {
    setWorkspaces(workspaces.filter(w => w.id !== id));
    if (onShowToast) onShowToast('Workspace archived.', 'info');
  };

  const statusColors = {
    active: { label: 'Active', className: 'badge-current' },
    review: { label: 'Under Review', className: 'badge-warning' },
    completed: { label: 'Completed', className: 'badge-info' }
  };

  const filteredWorkspaces = workspaces.filter(ws => {
    const matchesSearch = !searchQuery ||
      ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || ws.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{
        background: '#ffffff', border: '1px solid var(--slate-200)',
        borderRadius: '10px', padding: '20px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <FolderOpen size={20} color="var(--gov-navy-800)" />
            <h1 style={{ fontSize: '1.35rem', color: 'var(--gov-navy-950)', fontWeight: '700' }}>
              Procurement Project Workspaces
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
            Organize tenders, technical schedules, and selected Indian Standards by project. Each workspace maintains its own specification library.
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
          <Plus size={16} />
          Create Workspace
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total Workspaces', value: workspaces.length, icon: <Folder size={16} />, color: 'var(--gov-navy-700)' },
          { label: 'Active Projects', value: workspaces.filter(w => w.status === 'active').length, icon: <CheckCircle2 size={16} />, color: 'var(--success-600)' },
          { label: 'Total Documents', value: workspaces.reduce((sum, w) => sum + w.documentsCount, 0), icon: <FileText size={16} />, color: 'var(--saffron-600)' },
          { label: 'Standards Mapped', value: workspaces.reduce((sum, w) => sum + w.standardsCount, 0), icon: <Layers size={16} />, color: 'var(--info-700)' }
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gov-navy-950)', lineHeight: '1', fontFamily: 'var(--font-mono)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: '500', marginTop: '2px' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input type="text" className="input" style={{ paddingLeft: '32px' }} placeholder="Search workspaces by name or tag..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <select className="select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="review">Under Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="card" style={{ borderLeft: '4px solid var(--gov-navy-700)', background: 'var(--gov-navy-50)', borderColor: 'var(--gov-navy-100)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '14px', color: 'var(--gov-navy-950)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> Create New Procurement Workspace
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label className="label">Workspace / Project Title *</label>
              <input type="text" className="input" placeholder="e.g. State Highway Bridges Structural Steel Tender 2026" value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div>
              <label className="label">Project Scope / Description</label>
              <textarea className="textarea" style={{ minHeight: '70px' }} placeholder="Brief description of the procurement requirement..." value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            </div>
            <div>
              <label className="label">Tags (comma-separated)</label>
              <input type="text" className="input" placeholder="e.g. Civil Works, TMT Steel, Bridge Construction" value={newTags} onChange={e => setNewTags(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
              <button onClick={handleCreateWorkspace} className="btn btn-primary btn-sm" disabled={!newName.trim()}>
                <Folder size={14} /> Initialize Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workspace Grid */}
      {filteredWorkspaces.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
          {filteredWorkspaces.map(ws => {
            const color = WORKSPACE_COLORS[ws.colorIdx % WORKSPACE_COLORS.length];
            const statusInfo = statusColors[ws.status] || statusColors.active;
            return (
              <div key={ws.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px', transition: 'box-shadow var(--transition-fast), border-color var(--transition-fast)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--slate-300)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = ''; }}
              >
                <div>
                  {/* Workspace Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: color.bg, border: `1px solid ${color.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color.icon, flexShrink: 0 }}>
                        <Folder size={18} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--gov-navy-950)', lineHeight: '1.3', marginBottom: '4px' }}>
                          {ws.name}
                        </h3>
                        <span className={`badge ${statusInfo.className}`} style={{ fontSize: '0.68rem' }}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(ws.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)', padding: '4px' }} title="Archive workspace">
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', lineHeight: '1.5', marginBottom: '12px' }}>
                    {ws.description}
                  </p>

                  {/* Tags */}
                  {ws.tags?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                      {ws.tags.map(tag => (
                        <span key={tag} className="chip chip-slate" style={{ fontSize: '0.68rem' }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  {/* Metrics */}
                  <div style={{
                    background: 'var(--slate-50)', border: '1px solid var(--slate-200)',
                    borderRadius: '6px', padding: '10px 14px',
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '0.78rem', color: 'var(--slate-600)', marginBottom: '12px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '700', color: 'var(--gov-navy-950)', fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>{ws.documentsCount}</div>
                      <div>Documents</div>
                    </div>
                    <div style={{ width: '1px', background: 'var(--slate-200)' }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '700', color: 'var(--gov-navy-950)', fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>{ws.standardsCount}</div>
                      <div>Standards</div>
                    </div>
                    <div style={{ width: '1px', background: 'var(--slate-200)' }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '700', color: 'var(--gov-navy-950)', fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>{ws.analysesCount}</div>
                      <div>Analyses</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={11} /> Updated: {ws.updatedDate}
                    </span>
                    <button onClick={() => onOpenWorkspaceTender(ws.preset)} className="btn btn-primary btn-sm" style={{ gap: '6px', fontSize: '0.78rem' }}>
                      Open Workspace <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '56px 24px', textAlign: 'center', background: '#fff', border: '1px dashed var(--slate-300)', borderRadius: '10px' }}>
          <Folder size={32} color="var(--slate-300)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1rem', color: 'var(--gov-navy-950)', marginBottom: '8px' }}>No workspaces found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '16px' }}>Create a workspace to organize your procurement project documents and standards.</p>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary btn-sm">
            <Plus size={14} /> Create First Workspace
          </button>
        </div>
      )}
    </div>
  );
}
