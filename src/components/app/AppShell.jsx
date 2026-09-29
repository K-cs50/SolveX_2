import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileCheck,
  FileText,
  Layers,
  Folder,
  History,
  Settings,
  Search,
  Bell,
  LogOut,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Star,
  BarChart2,
  BookOpen,
  X,
  Info
} from 'lucide-react';
import DashboardOverview from './DashboardOverview';
import AnalyzeSpecification from './AnalyzeSpecification';
import StandardsRepository from './StandardsRepository';
import DocumentsManager from './DocumentsManager';
import WorkspacesManager from './WorkspacesManager';
import AnalysisHistory from './AnalysisHistory';
import SpecificationBuilder from './SpecificationBuilder';
import SettingsPage from './SettingsPage';
import { MOCK_TENDERS } from '../../data/mockTenders';

export default function AppShell({
  activeTab,
  onTabChange,
  onLogout,
  onOpenSearch,
  language,
  onLanguageChange,
  onViewStandardDetails,
  onToggleSpecification,
  specificationStandards,
  onRemoveSpecificationStandard,
  onToggleSaveStandard,
  savedStandards,
  onCompareStandard,
  comparedStandards,
  onShowToast
}) {
  const [activeTenderPreset, setActiveTenderPreset] = useState(MOCK_TENDERS[0]);
  const [analysisText, setAnalysisText] = useState(MOCK_TENDERS[0].raw_text);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpPanel, setShowHelpPanel] = useState(false);

  const notifications = [
    { id: 1, type: 'info', title: 'IS 4984:2016 Edition 2 Verified', body: 'Version status confirmed against BIS database. Specification compliance maintained.', time: '2 min ago', read: false },
    { id: 2, type: 'warning', title: 'IS 1786:2008 — Superseded Notice', body: 'IS 1786 has an amendment circular. Verify clause 4.2 test requirements.', time: '1 hr ago', read: false },
    { id: 3, type: 'success', title: 'Specification Builder Export Ready', body: 'JJM Pipeline Package 04 specification schedule generated successfully.', time: '3 hrs ago', read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Recent analyses state
  const [recentAnalyses, setRecentAnalyses] = useState([
    {
      id: 'an-1',
      title: 'Jal Jeevan Mission Rural Distribution (Pkg 04)',
      tenderNumber: 'PHED/JJM/2026/PKG-04',
      standardsCount: 5,
      date: '2026-03-25',
      preset: MOCK_TENDERS[0]
    },
    {
      id: 'an-2',
      title: '33/11 kV Grid Substation Augmentation',
      tenderNumber: 'DISCOM/TRANS/33KV/2026',
      standardsCount: 4,
      date: '2026-03-24',
      preset: MOCK_TENDERS[1]
    }
  ]);

  const handleReopenAnalysis = (preset) => {
    setActiveTenderPreset(preset);
    setAnalysisText(preset.raw_text);
    onTabChange('analyze');
  };

  const primaryMenuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'analyze', label: 'Analyze Specs', icon: <FileCheck size={16} /> },
    { id: 'specbuilder', label: 'Spec Builder', icon: <FileText size={16} />, badge: specificationStandards.length > 0 ? specificationStandards.length : null },
    { id: 'standards', label: 'Standards Catalog', icon: <Layers size={16} /> }
  ];

  const secondaryMenuItems = [
    { id: 'documents', label: 'Document Vault', icon: <BookOpen size={16} /> },
    { id: 'workspaces', label: 'Workspaces', icon: <Folder size={16} /> },
    { id: 'history', label: 'Audit History', icon: <History size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> }
  ];

  const breadcrumbLabels = {
    overview: 'Overview',
    analyze: 'Analyze Specification',
    specbuilder: 'Specification Builder',
    standards: 'Standards Catalog',
    documents: 'Document Vault',
    workspaces: 'Project Workspaces',
    history: 'Audit History',
    settings: 'Settings'
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="app-sidebar" aria-label="Application Navigation">

        {/* Brand Header */}
        <div className="app-sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-emblem" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
              SX
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--gov-navy-950)', lineHeight: '1.2' }}>
                Solve<span style={{ color: 'var(--saffron-600)' }}>X</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Procurement Portal
              </div>
            </div>
          </div>
        </div>

        {/* Active Project Indicator */}
        <div style={{ padding: '10px 12px', background: 'var(--gov-navy-50)', borderBottom: '1px solid var(--gov-navy-100)', margin: '0' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600', marginBottom: '2px' }}>
            Active Project
          </div>
          <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--gov-navy-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {activeTenderPreset.title?.substring(0, 38) || 'Jal Jeevan Mission Rural Distribution'}
            {activeTenderPreset.title?.length > 38 ? '...' : ''}
          </div>
        </div>

        {/* Primary Nav */}
        <nav className="app-sidebar-nav">
          <div className="app-sidebar-section-label">Analysis</div>
          {primaryMenuItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  background: 'var(--saffron-500)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  minWidth: '18px',
                  textAlign: 'center'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="sidebar-sep" />
          <div className="app-sidebar-section-label">Workspace</div>
          {secondaryMenuItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Compliance Indicator */}
        <div style={{ margin: '12px 12px 0', padding: '12px', borderRadius: '8px', background: 'var(--success-50)', border: '1px solid var(--success-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <ShieldCheck size={14} color="var(--success-700)" />
            <span style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--success-800)' }}>Compliance Active</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--success-800)', lineHeight: '1.4' }}>
            QCO enforcement and normative hierarchy expansion enabled.
          </div>
        </div>

        {/* Sidebar Footer User Info */}
        <div style={{ padding: '12px', marginTop: '12px', borderTop: '1px solid var(--slate-200)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'var(--gov-navy-800)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: '700'
              }}>
                KC
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--gov-navy-950)' }}>K. Chaitanya</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--slate-500)' }}>Technical Reviewer</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)', padding: '4px' }}
              title="Sign out of session"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="app-content">

        {/* Top App Bar */}
        <header className="app-topbar">
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              SolveX
            </span>
            <ChevronRight size={12} color="var(--slate-400)" />
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--gov-navy-950)' }}>
              {breadcrumbLabels[activeTab] || activeTab}
            </span>

            <button
              onClick={onOpenSearch}
              className="btn btn-secondary btn-sm"
              style={{ marginLeft: '12px', minWidth: '220px', justifyContent: 'flex-start', color: 'var(--slate-500)', fontSize: '0.8rem' }}
            >
              <Search size={13} />
              <span>Search standards, tenders...</span>
              <kbd style={{
                marginLeft: 'auto',
                background: 'var(--slate-100)',
                border: '1px solid var(--slate-300)',
                borderRadius: '3px',
                padding: '0 4px',
                fontSize: '0.62rem',
                fontFamily: 'var(--font-mono)'
              }}>⌘K</kbd>
            </button>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Spec Builder shortcut */}
            <button
              onClick={() => onTabChange('specbuilder')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', position: 'relative' }}
            >
              <FileText size={13} />
              Spec Builder
              {specificationStandards.length > 0 && (
                <span style={{
                  background: 'var(--saffron-500)',
                  color: '#fff',
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  padding: '0 5px',
                  borderRadius: '8px',
                  lineHeight: '1.6'
                }}>{specificationStandards.length}</span>
              )}
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '6px', position: 'relative' }}
                aria-label="Notifications"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '3px', right: '3px',
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: 'var(--danger-600)',
                    border: '1.5px solid #fff'
                  }} />
                )}
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '40px', right: 0,
                  width: '340px', background: '#fff',
                  border: '1px solid var(--slate-200)',
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--gov-navy-950)' }}>Notifications</span>
                    <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}>
                      <X size={14} />
                    </button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--slate-50)',
                      background: n.read ? '#fff' : 'var(--gov-navy-50)',
                      display: 'flex', gap: '10px'
                    }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50', flexShrink: 0, marginTop: '5px',
                        background: n.type === 'warning' ? 'var(--saffron-500)' : n.type === 'success' ? 'var(--success-600)' : 'var(--gov-navy-500)'
                      }} />
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--gov-navy-950)', marginBottom: '2px' }}>{n.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)', lineHeight: '1.4' }}>{n.body}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--slate-400)', marginTop: '4px' }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Help */}
            <button
              onClick={() => setShowHelpPanel(!showHelpPanel)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '6px' }}
              aria-label="Help"
            >
              <HelpCircle size={16} />
            </button>

            {/* Exit */}
            <button onClick={onLogout} className="btn btn-secondary btn-sm" style={{ fontSize: '0.78rem' }}>
              <LogOut size={13} />
              Exit Portal
            </button>
          </div>
        </header>

        {/* Main View Switcher */}
        <main className="app-main-view">
          {activeTab === 'overview' && (
            <DashboardOverview
              onStartNewAnalysis={() => onTabChange('analyze')}
              recentAnalyses={recentAnalyses}
              savedStandards={savedStandards}
              recentDocuments={[
                { id: '1', filename: 'JJM_Water_Pipeline_Pkg04_Schedule.pdf', type: 'Tender Schedule', tenderRef: 'PHED/JJM/2026', status: 'Extracted', preset: MOCK_TENDERS[0] },
                { id: '2', filename: '33kV_Substation_Transformer_Specs.docx', type: 'Equipment Specs', tenderRef: 'DISCOM/TRANS/33KV', status: 'Extracted', preset: MOCK_TENDERS[1] }
              ]}
              onSelectStandard={onViewStandardDetails}
              onRemoveSavedStandard={onToggleSaveStandard}
              onReopenAnalysis={handleReopenAnalysis}
              onViewDocument={(doc) => handleReopenAnalysis(doc.preset)}
            />
          )}

          {activeTab === 'analyze' && (
            <AnalyzeSpecification
              initialText={analysisText}
              initialTenderId={activeTenderPreset.id}
              onViewStandardDetails={onViewStandardDetails}
              onToggleSpecification={onToggleSpecification}
              specificationStandards={specificationStandards}
              onToggleSaveStandard={onToggleSaveStandard}
              savedStandards={savedStandards}
              onCompareStandard={onCompareStandard}
              comparedStandards={comparedStandards}
            />
          )}

          {activeTab === 'specbuilder' && (
            <SpecificationBuilder
              selectedStandards={specificationStandards}
              onRemoveStandard={onRemoveSpecificationStandard}
              activeTender={activeTenderPreset}
              onShowToast={onShowToast}
            />
          )}

          {activeTab === 'standards' && (
            <StandardsRepository
              onViewStandardDetails={onViewStandardDetails}
              onToggleSpecification={onToggleSpecification}
              specificationStandards={specificationStandards}
              onToggleSaveStandard={onToggleSaveStandard}
              savedStandards={savedStandards}
              onCompareStandard={onCompareStandard}
              comparedStandards={comparedStandards}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsManager
              onAnalyzeDocument={handleReopenAnalysis}
              onShowToast={onShowToast}
            />
          )}

          {activeTab === 'workspaces' && (
            <WorkspacesManager
              onOpenWorkspaceTender={handleReopenAnalysis}
              onShowToast={onShowToast}
            />
          )}

          {activeTab === 'history' && (
            <AnalysisHistory
              onReopenAnalysis={handleReopenAnalysis}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              onShowToast={onShowToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}
