import React, { useState, useRef } from 'react';
import {
  FileText, Upload, Plus, Trash2, Eye, Download, CheckCircle2,
  RefreshCw, File, FileTerminal, Search, Filter, X, Clock,
  Tag, AlertTriangle, ArrowRight
} from 'lucide-react';
import { MOCK_TENDERS } from '../../data/mockTenders';

const FILE_ICONS = {
  pdf: { color: 'var(--danger-600)', bg: 'var(--danger-50)', label: 'PDF' },
  docx: { color: 'var(--info-700)', bg: 'var(--info-100)', label: 'DOCX' },
  txt: { color: 'var(--slate-600)', bg: 'var(--slate-100)', label: 'TXT' },
  xlsx: { color: 'var(--success-600)', bg: 'var(--success-50)', label: 'XLSX' },
  default: { color: 'var(--gov-navy-700)', bg: 'var(--gov-navy-50)', label: 'DOC' }
};

const getFileExt = (filename) => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'default';
};

export default function DocumentsManager({ onAnalyzeDocument, onShowToast }) {
  const [documents, setDocuments] = useState([
    {
      id: 'doc-1', filename: 'JJM_Water_Pipeline_Pkg04_Technical_Schedule.pdf',
      type: 'Tender Technical Schedule', size: '2.4 MB',
      uploadDate: '2026-03-24', tenderRef: 'PHED/JJM/2026/PKG-04',
      status: 'Extracted', requirementsCount: 12, standardsCount: 5,
      tenderPreset: MOCK_TENDERS[0]
    },
    {
      id: 'doc-2', filename: '33kV_Substation_Transformer_Specs_v2.docx',
      type: 'Equipment Specification', size: '1.8 MB',
      uploadDate: '2026-03-22', tenderRef: 'DISCOM/TRANS/33KV/2026',
      status: 'Extracted', requirementsCount: 8, standardsCount: 4,
      tenderPreset: MOCK_TENDERS[1]
    },
    {
      id: 'doc-3', filename: 'SmartCity_CCTV_Surveillance_RFP_Section2.pdf',
      type: 'RFP Technical Volume', size: '4.1 MB',
      uploadDate: '2026-03-20', tenderRef: 'SCDCL/IT-SURV/2026',
      status: 'Extracted', requirementsCount: 10, standardsCount: 4,
      tenderPreset: MOCK_TENDERS[2]
    },
    {
      id: 'doc-4', filename: 'Elevated_Corridor_TMT_Steel_Girders_Schedule.pdf',
      type: 'Bill of Quantities & Specs', size: '3.2 MB',
      uploadDate: '2026-03-18', tenderRef: 'NHIDA/CIVIL/ROB-FL/2026',
      status: 'Extracted', requirementsCount: 15, standardsCount: 6,
      tenderPreset: MOCK_TENDERS[3]
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    setIsUploading(true);
    setTimeout(() => {
      const newDoc = {
        id: `doc-${Date.now()}`,
        filename: file.name,
        type: 'Procurement Document',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        tenderRef: `CUSTOM/TNDR/${Date.now().toString().slice(-4)}`,
        status: 'Extracted',
        requirementsCount: Math.floor(Math.random() * 12) + 4,
        standardsCount: Math.floor(Math.random() * 5) + 2,
        tenderPreset: MOCK_TENDERS[0]
      };
      setDocuments(prev => [newDoc, ...prev]);
      setIsUploading(false);
      if (onShowToast) onShowToast(`"${file.name}" uploaded and requirements extracted successfully.`, 'success');
    }, 1600);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);

  const handleDelete = (id) => {
    setDocuments(documents.filter(d => d.id !== id));
    if (onShowToast) onShowToast('Document removed from workspace vault.', 'info');
  };

  const filteredDocuments = documents.filter(doc => {
    const matchSearch = !searchQuery ||
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tenderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || doc.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const totalRequirements = documents.reduce((sum, d) => sum + (d.requirementsCount || 0), 0);
  const totalStandards = documents.reduce((sum, d) => sum + (d.standardsCount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{
        background: '#fff', border: '1px solid var(--slate-200)',
        borderRadius: '10px', padding: '20px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: '14px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <FileText size={20} color="var(--gov-navy-800)" />
            <h1 style={{ fontSize: '1.35rem', color: 'var(--gov-navy-950)', fontWeight: '700' }}>
              Procurement Document Vault
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
            Upload and manage tender specifications, RFPs, and technical schedules. Requirements are automatically extracted and mapped to applicable Indian Standards.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept=".pdf,.docx,.txt" />
          <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <Upload size={16} />
            {isUploading ? 'Parsing Document...' : 'Upload Document'}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Documents', value: documents.length, color: 'var(--gov-navy-700)' },
          { label: 'Extracted', value: documents.filter(d => d.status === 'Extracted').length, color: 'var(--success-600)' },
          { label: 'Requirements', value: totalRequirements, color: 'var(--saffron-600)' },
          { label: 'Standards Mapped', value: totalStandards, color: 'var(--info-700)' }
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: stat.color, fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: '600' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragOver ? 'var(--gov-navy-500)' : 'var(--slate-300)'}`,
          borderRadius: '10px',
          padding: '28px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragOver ? 'var(--gov-navy-50)' : 'var(--slate-50)',
          transition: 'all var(--transition-fast)'
        }}
      >
        <Upload size={28} color={isDragOver ? 'var(--gov-navy-600)' : 'var(--slate-400)'} style={{ marginBottom: '10px' }} />
        <div style={{ fontWeight: '600', color: isDragOver ? 'var(--gov-navy-800)' : 'var(--gov-navy-950)', marginBottom: '4px' }}>
          {isUploading ? 'Parsing and extracting requirements...' : 'Drop procurement document here or click to upload'}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
          Supports PDF, DOCX, TXT tender schedules and technical specifications
        </div>
        {isUploading && (
          <div style={{ marginTop: '12px' }}>
            <div className="progress-bar-track" style={{ maxWidth: '300px', margin: '0 auto' }}>
              <div className="progress-bar-indeterminate" />
            </div>
          </div>
        )}
      </div>

      {/* Search & Filter */}
      <div className="card" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input type="text" className="input" style={{ paddingLeft: '32px' }}
              placeholder="Search by filename, document type, or tender reference..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <select className="select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="extracted">Extracted</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="card-header" style={{ padding: '14px 18px', marginBottom: 0, borderRadius: '8px 8px 0 0', background: 'var(--slate-50)' }}>
          <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={15} color="var(--gov-navy-800)" />
            Uploaded Documents ({filteredDocuments.length})
          </span>
        </div>

        {filteredDocuments.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Upload Date</th>
                  <th>Tender Ref</th>
                  <th>Extracted</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map(doc => {
                  const ext = getFileExt(doc.filename);
                  const fileIcon = FILE_ICONS[ext] || FILE_ICONS.default;
                  return (
                    <tr key={doc.id}>
                      <td style={{ fontWeight: '500', color: 'var(--gov-navy-950)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            padding: '2px 6px', borderRadius: '4px', fontSize: '0.62rem',
                            fontWeight: '700', fontFamily: 'var(--font-mono)',
                            background: fileIcon.bg, color: fileIcon.color,
                            flexShrink: 0
                          }}>
                            {fileIcon.label}
                          </span>
                          <span style={{ fontSize: '0.82rem' }}>{doc.filename}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--slate-600)', fontSize: '0.8rem' }}>{doc.type}</td>
                      <td style={{ color: 'var(--slate-500)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{doc.size}</td>
                      <td style={{ color: 'var(--slate-600)', fontSize: '0.78rem' }}>{doc.uploadDate}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--gov-navy-800)', fontWeight: '600' }}>{doc.tenderRef}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {doc.requirementsCount && (
                            <span className="chip chip-slate" style={{ fontSize: '0.68rem' }}>{doc.requirementsCount} req.</span>
                          )}
                          {doc.standardsCount && (
                            <span className="chip chip-navy" style={{ fontSize: '0.68rem' }}>{doc.standardsCount} IS</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-current" style={{ fontSize: '0.7rem' }}>
                          <CheckCircle2 size={10} /> {doc.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => onAnalyzeDocument(doc.tenderPreset)}
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.75rem' }}
                          >
                            Analyze <ArrowRight size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '6px', color: 'var(--slate-400)' }}
                            title="Delete document"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--slate-500)' }}>
            <FileText size={28} color="var(--slate-300)" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '0.875rem' }}>No documents found. Upload a tender schedule or specification document.</p>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div style={{ background: 'var(--gov-navy-50)', border: '1px solid var(--gov-navy-100)', borderRadius: '8px', padding: '14px 18px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <AlertTriangle size={16} color="var(--gov-navy-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.78rem', color: 'var(--gov-navy-800)', lineHeight: '1.5' }}>
          <strong>Document Processing Notice:</strong> In this demonstration portal, document text is simulated using curated sample tender data. In production deployment, SolveX integrates with government cloud storage (NIC/MeitY) and applies AI-powered optical character recognition (OCR) and table extraction for scanned PDF tender schedules.
        </div>
      </div>
    </div>
  );
}
