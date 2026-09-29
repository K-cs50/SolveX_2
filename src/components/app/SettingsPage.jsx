import React, { useState } from 'react';
import {
  User, Building, ShieldCheck, Globe, Sliders, Check,
  Bell, Eye, Download, Database, Lock, Key, Trash2,
  AlertTriangle, Info, ChevronRight, Save
} from 'lucide-react';

const SECTIONS = [
  { id: 'profile', label: 'Officer Profile', icon: <User size={16} /> },
  { id: 'compliance', label: 'Compliance Rules', icon: <ShieldCheck size={16} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  { id: 'export', label: 'Export & Reports', icon: <Download size={16} /> },
  { id: 'security', label: 'Security & Access', icon: <Lock size={16} /> }
];

export default function SettingsPage({ onShowToast }) {
  const [activeSection, setActiveSection] = useState('profile');

  // Profile state
  const [officerName, setOfficerName] = useState('K. Chaitanya');
  const [designation, setDesignation] = useState('Senior Procurement Evaluator');
  const [organization, setOrganization] = useState('Public Health & Infrastructure Department');
  const [department, setDepartment] = useState('Technical Specifications Division');
  const [email, setEmail] = useState('k.chaitanya@phid.gov.in');
  const [role, setRole] = useState('Technical Reviewer');

  // Compliance state
  const [strictQCO, setStrictQCO] = useState(true);
  const [autoNormative, setAutoNormative] = useState(true);
  const [flagSuperseded, setFlagSuperseded] = useState(true);
  const [requireISImark, setRequireISImark] = useState(true);
  const [includeTestMethods, setIncludeTestMethods] = useState(true);
  const [defaultConfidenceThreshold, setDefaultConfidenceThreshold] = useState(65);

  // Notification state
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifStatusChange, setNotifStatusChange] = useState(true);
  const [notifNewVersion, setNotifNewVersion] = useState(false);

  // Export state
  const [exportFormat, setExportFormat] = useState('pdf');
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [includeClauseRef, setIncludeClauseRef] = useState(true);
  const [watermark, setWatermark] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    if (onShowToast) onShowToast('Settings saved successfully.', 'success');
  };

  const ToggleSwitch = ({ checked, onChange, id }) => (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      id={id}
      style={{
        width: '40px', height: '22px', borderRadius: '11px',
        background: checked ? 'var(--gov-navy-700)' : 'var(--slate-300)',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background var(--transition-fast)',
        flexShrink: 0
      }}
    >
      <span style={{
        position: 'absolute', top: '3px',
        left: checked ? '21px' : '3px',
        width: '16px', height: '16px', borderRadius: '50%',
        background: '#fff',
        transition: 'left var(--transition-fast)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
      }} />
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Page Header */}
      <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: '10px', padding: '20px 24px' }}>
        <h1 style={{ fontSize: '1.35rem', color: 'var(--gov-navy-950)', fontWeight: '700', marginBottom: '4px' }}>
          Portal Settings & Configuration
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          Configure officer credentials, compliance thresholds, export formats, and security preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '18px' }}>

        {/* Settings Nav */}
        <div className="card" style={{ padding: '10px', height: 'fit-content' }}>
          {SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '10px 12px',
                borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: activeSection === section.id ? 'var(--gov-navy-50)' : 'transparent',
                color: activeSection === section.id ? 'var(--gov-navy-900)' : 'var(--slate-700)',
                fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                fontWeight: activeSection === section.id ? '600' : '500',
                transition: 'all var(--transition-fast)',
                marginBottom: '2px'
              }}
            >
              {section.icon}
              {section.label}
              {activeSection === section.id && (
                <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
              )}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <>
              <div className="card">
                <div className="card-header">
                  <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} color="var(--gov-navy-800)" />
                    Officer Profile & Department Details
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="label" htmlFor="officer-name">Officer Name</label>
                    <input id="officer-name" type="text" className="input" value={officerName} onChange={e => setOfficerName(e.target.value)} />
                  </div>
                  <div>
                    <label className="label" htmlFor="designation">Designation / Title</label>
                    <input id="designation" type="text" className="input" value={designation} onChange={e => setDesignation(e.target.value)} />
                  </div>
                  <div>
                    <label className="label" htmlFor="organization">Department / Agency</label>
                    <input id="organization" type="text" className="input" value={organization} onChange={e => setOrganization(e.target.value)} />
                  </div>
                  <div>
                    <label className="label" htmlFor="department">Division / Sub-unit</label>
                    <input id="department" type="text" className="input" value={department} onChange={e => setDepartment(e.target.value)} />
                  </div>
                  <div>
                    <label className="label" htmlFor="email">Official Email</label>
                    <input id="email" type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="label" htmlFor="role">Procurement Role</label>
                    <select id="role" className="select" value={role} onChange={e => setRole(e.target.value)}>
                      <option value="Procurement Official">Procurement Official</option>
                      <option value="Technical Reviewer">Technical Reviewer</option>
                      <option value="Organization Administrator">Organization Administrator</option>
                      <option value="Auditor">Compliance Auditor</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="card" style={{ background: 'var(--gov-navy-50)', borderColor: 'var(--gov-navy-100)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Info size={18} color="var(--gov-navy-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gov-navy-950)', marginBottom: '4px' }}>
                      Procurement Portal Access Mode
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gov-navy-800)', margin: 0 }}>
                      This is a demonstration portal. In production deployment, officer credentials are authenticated via state government identity provider (NIC/Saksham) and linked to official procurement roles.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Compliance Section */}
          {activeSection === 'compliance' && (
            <div className="card">
              <div className="card-header">
                <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="var(--gov-navy-800)" />
                  Standards Compliance & Quality Control Rules
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {[
                  {
                    id: 'qco', label: 'Enforce Strict Quality Control Order (QCO) Verification',
                    desc: 'Flag standards where BIS certification is mandatory under Central Ministry Quality Control Orders.',
                    checked: strictQCO, onChange: setStrictQCO
                  },
                  {
                    id: 'normative', label: 'Automatic Normative Hierarchy Expansion',
                    desc: 'Automatically include testing codes and material references cited inside the primary standard.',
                    checked: autoNormative, onChange: setAutoNormative
                  },
                  {
                    id: 'superseded', label: 'Flag Superseded Standards as Warnings',
                    desc: 'Display a warning when a procurement specification cites a standard that has been withdrawn or superseded.',
                    checked: flagSuperseded, onChange: setFlagSuperseded
                  },
                  {
                    id: 'isi', label: 'Require ISI / BIS Standard Mark Evidence',
                    desc: 'Specification Builder will automatically include ISI/CRS licence verification clause for applicable standards.',
                    checked: requireISImark, onChange: setRequireISImark
                  },
                  {
                    id: 'test', label: 'Include Test Method References in Specifications',
                    desc: 'Automatically append relevant IS test method codes when building procurement specifications.',
                    checked: includeTestMethods, onChange: setIncludeTestMethods
                  }
                ].map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', padding: '14px', background: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
                    <div style={{ flex: 1 }}>
                      <label htmlFor={item.id} style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gov-navy-950)', cursor: 'pointer', display: 'block', marginBottom: '4px' }}>
                        {item.label}
                      </label>
                      <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', margin: 0 }}>{item.desc}</p>
                    </div>
                    <ToggleSwitch checked={item.checked} onChange={item.onChange} id={item.id} />
                  </div>
                ))}

                <div style={{ padding: '14px', background: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
                  <label className="label" style={{ marginBottom: '8px' }}>
                    Minimum Confidence Threshold for Recommendations: <strong>{defaultConfidenceThreshold}%</strong>
                  </label>
                  <input
                    type="range"
                    min="40" max="95" step="5"
                    value={defaultConfidenceThreshold}
                    onChange={e => setDefaultConfidenceThreshold(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--gov-navy-700)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                    <span>40% (Broad)</span>
                    <span>95% (Strict)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="card">
              <div className="card-header">
                <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={16} color="var(--gov-navy-800)" />
                  Notification Preferences
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { id: 'email-notif', label: 'Email Notifications for Analysis Completions', checked: notifEmail, onChange: setNotifEmail },
                  { id: 'status-change', label: 'Alert when IS Standard Status Changes (Superseded/Amended)', checked: notifStatusChange, onChange: setNotifStatusChange },
                  { id: 'new-version', label: 'Alert on New Standard Version Published by BIS', checked: notifNewVersion, onChange: setNotifNewVersion }
                ].map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '12px 14px', background: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
                    <label htmlFor={item.id} style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--gov-navy-950)', cursor: 'pointer' }}>
                      {item.label}
                    </label>
                    <ToggleSwitch checked={item.checked} onChange={item.onChange} id={item.id} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export Section */}
          {activeSection === 'export' && (
            <div className="card">
              <div className="card-header">
                <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={16} color="var(--gov-navy-800)" />
                  Export & Report Configuration
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="label">Default Export Format</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['pdf', 'docx', 'xlsx', 'csv'].map(fmt => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setExportFormat(fmt)}
                        className={`btn btn-sm ${exportFormat === fmt ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
                {[
                  { id: 'evidence', label: 'Include Evidence Citations in Exported Specifications', checked: includeEvidence, onChange: setIncludeEvidence },
                  { id: 'clauses', label: 'Include IS Clause References for Each Requirement', checked: includeClauseRef, onChange: setIncludeClauseRef },
                  { id: 'watermark', label: 'Embed "SolveX Demonstration" Watermark on Exports', checked: watermark, onChange: setWatermark }
                ].map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '12px 14px', background: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
                    <label htmlFor={item.id} style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--gov-navy-950)', cursor: 'pointer' }}>
                      {item.label}
                    </label>
                    <ToggleSwitch checked={item.checked} onChange={item.onChange} id={item.id} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="card">
              <div className="card-header">
                <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={16} color="var(--gov-navy-800)" />
                  Security & Access Control
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: 'var(--warning-50)', border: '1px solid var(--warning-100)', borderRadius: '8px', padding: '14px', display: 'flex', gap: '10px' }}>
                  <AlertTriangle size={18} color="var(--warning-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--warning-800)', marginBottom: '4px' }}>
                      Demonstration Mode — Security Features Simulated
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--warning-800)', margin: 0 }}>
                      In production, authentication is integrated with government identity systems. Two-factor authentication (OTP via official mobile) and role-based access control (RBAC) are enforced.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button type="button" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                    <Key size={16} /> Change Password
                  </button>
                  <button type="button" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                    <Database size={16} /> Export Audit Log
                  </button>
                  <button type="button" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '10px', color: 'var(--danger-700)', borderColor: 'var(--danger-100)' }}>
                    <Trash2 size={16} /> Clear All Workspace Data
                  </button>
                  <button type="button" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                    <Eye size={16} /> View Active Sessions
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => {}}>
              Reset to Defaults
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
