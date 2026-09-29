import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { Toast } from './components/common/Modal';
import LandingPage from './components/public/LandingPage';
import AboutPage from './components/public/AboutPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import AppShell from './components/app/AppShell';
import StandardsRepository from './components/app/StandardsRepository';
import StandardDetailModal from './components/app/StandardDetailModal';
import StandardCompareModal from './components/app/StandardCompareModal';
import GlobalSearchModal from './components/app/GlobalSearchModal';
import { STANDARDS_DATABASE } from './services/standardsDatabase';
import { MOCK_TENDERS } from './data/mockTenders';

export default function App() {
  // Navigation State
  // public routes: 'home', 'standards', 'procurement', 'recommendations', 'documents', 'about', 'login', 'register'
  // app route: 'app'
  const [currentRoute, setCurrentRoute] = useState('home');
  const [appTab, setAppTab] = useState('overview');

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Global Language
  const [language, setLanguage] = useState('en');

  // Interactive Procurement State
  const [specificationStandards, setSpecificationStandards] = useState([
    STANDARDS_DATABASE[0] // Default with IS 4984 HDPE
  ]);
  const [savedStandards, setSavedStandards] = useState([
    STANDARDS_DATABASE[0],
    STANDARDS_DATABASE[1]
  ]);
  const [comparedStandards, setComparedStandards] = useState([]);

  // Modals State
  const [selectedStandardForModal, setSelectedStandardForModal] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Toast Feedback State
  const [toast, setToast] = useState({ message: null, type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Keyboard shortcut listener for Global Search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Standard Detail View Handler
  const handleViewStandardDetails = (standard) => {
    setSelectedStandardForModal(standard);
    setIsDetailModalOpen(true);
  };

  // Toggle Standard in Specification Builder
  const handleToggleSpecification = (standard) => {
    const exists = specificationStandards.some(s => s.standard_id === standard.standard_id);
    if (exists) {
      setSpecificationStandards(specificationStandards.filter(s => s.standard_id !== standard.standard_id));
      showToast(`Removed ${standard.standard_number} from Specification Builder.`, 'info');
    } else {
      setSpecificationStandards([...specificationStandards, standard]);
      showToast(`Added ${standard.standard_number} to Specification Builder.`, 'success');
    }
  };

  // Remove specific standard from specification
  const handleRemoveSpecificationStandard = (standardId) => {
    setSpecificationStandards(specificationStandards.filter(s => s.standard_id !== standardId));
    showToast("Standard removed from specification schedule.", 'info');
  };

  // Toggle Standard in Saved List
  const handleToggleSaveStandard = (standard) => {
    const exists = savedStandards.some(s => s.standard_id === standard.standard_id);
    if (exists) {
      setSavedStandards(savedStandards.filter(s => s.standard_id !== standard.standard_id));
      showToast(`Removed ${standard.standard_number} from saved list.`, 'info');
    } else {
      setSavedStandards([...savedStandards, standard]);
      showToast(`Saved ${standard.standard_number} to workspace repository.`, 'success');
    }
  };

  // Add standard to comparison matrix
  const handleCompareStandard = (standard) => {
    const exists = comparedStandards.some(s => s.standard_id === standard.standard_id);
    if (exists) {
      setIsCompareModalOpen(true);
      return;
    }
    if (comparedStandards.length >= 3) {
      showToast("Comparison limit reached (max 3 standards). Remove one to add another.", 'warning');
      setIsCompareModalOpen(true);
      return;
    }
    setComparedStandards([...comparedStandards, standard]);
    setIsCompareModalOpen(true);
    showToast(`Added ${standard.standard_number} to comparison matrix.`, 'info');
  };

  const handleRemoveFromCompare = (standardId) => {
    setComparedStandards(comparedStandards.filter(s => s.standard_id !== standardId));
  };

  // Login & Registration
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentRoute('app');
    setAppTab('overview');
    showToast(`Welcome, ${userData.name}. Signed into ${userData.organization}.`, 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentRoute('home');
    showToast("Signed out of procurement session.", 'info');
  };

  // Direct trigger to start analysis from landing page
  const handleStartAnalysis = (preset = null) => {
    setIsLoggedIn(true);
    setUser(user || { name: "K. Chaitanya", organization: "Public Procurement Department", role: "Technical Reviewer" });
    setCurrentRoute('app');
    setAppTab('analyze');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Show Public Header on Public Pages */}
      {currentRoute !== 'app' && (
        <Header
          activeNav={currentRoute}
          onNavChange={(route) => {
            if (route === 'app' && !isLoggedIn) {
              setCurrentRoute('login');
            } else {
              setCurrentRoute(route);
            }
          }}
          isLoggedIn={isLoggedIn}
          onOpenLogin={() => setCurrentRoute('login')}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          language={language}
          onLanguageChange={setLanguage}
        />
      )}

      {/* Main Routing Views */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* PUBLIC: Home / Landing Page */}
        {currentRoute === 'home' && (
          <LandingPage
            onAnalyzeClick={() => handleStartAnalysis()}
            onExploreStandardsClick={() => setCurrentRoute('standards')}
            onOpenTenderPreset={(tender) => handleStartAnalysis(tender)}
            language={language}
          />
        )}

        {/* PUBLIC: Standards Catalog */}
        {currentRoute === 'standards' && (
          <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%', padding: '36px 24px' }}>
            <StandardsRepository
              onViewStandardDetails={handleViewStandardDetails}
              onToggleSpecification={handleToggleSpecification}
              specificationStandards={specificationStandards}
              onToggleSaveStandard={handleToggleSaveStandard}
              savedStandards={savedStandards}
              onCompareStandard={handleCompareStandard}
              comparedStandards={comparedStandards}
            />
          </div>
        )}

        {/* PUBLIC: Procurement Workflow Showcase */}
        {currentRoute === 'procurement' && (
          <LandingPage
            onAnalyzeClick={() => handleStartAnalysis()}
            onExploreStandardsClick={() => setCurrentRoute('standards')}
            onOpenTenderPreset={(tender) => handleStartAnalysis(tender)}
            language={language}
          />
        )}

        {/* PUBLIC: Recommendations Overview */}
        {currentRoute === 'recommendations' && (
          <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%', padding: '36px 24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '1.6rem', color: 'var(--gov-navy-950)', fontWeight: '700' }}>
                Recommendation & Evidence Architecture
              </h1>
              <p style={{ color: 'var(--slate-600)', marginTop: '4px' }}>
                SolveX implements deterministic hybrid ranking combined with clause-level citations to eliminate generative hallucinations in public procurement.
              </p>
            </div>
            <StandardsRepository
              onViewStandardDetails={handleViewStandardDetails}
              onToggleSpecification={handleToggleSpecification}
              specificationStandards={specificationStandards}
              onToggleSaveStandard={handleToggleSaveStandard}
              savedStandards={savedStandards}
              onCompareStandard={handleCompareStandard}
              comparedStandards={comparedStandards}
            />
          </div>
        )}

        {/* PUBLIC: Documents Vault */}
        {currentRoute === 'documents' && (
          <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%', padding: '36px 24px' }}>
            <div className="card" style={{ padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--gov-navy-950)', marginBottom: '8px' }}>
                Procurement Document Parsing & Analysis
              </h2>
              <p style={{ color: 'var(--slate-600)', maxWidth: '600px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
                Upload tender schedules, RFPs, or technical parameter tables to automatically identify and extract applicable Indian Standards.
              </p>
              <button onClick={() => handleStartAnalysis()} className="btn btn-primary">
                Open Analysis Console
              </button>
            </div>
          </div>
        )}

        {/* PUBLIC: About Page */}
        {currentRoute === 'about' && (
          <AboutPage
            onAnalyzeClick={() => handleStartAnalysis()}
            onExploreStandardsClick={() => setCurrentRoute('standards')}
          />
        )}

        {/* AUTH: Login */}
        {currentRoute === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setCurrentRoute('register')}
            onBackToHome={() => setCurrentRoute('home')}
          />
        )}

        {/* AUTH: Register */}
        {currentRoute === 'register' && (
          <RegisterPage
            onRegisterSuccess={handleLoginSuccess}
            onSwitchToLogin={() => setCurrentRoute('login')}
            onBackToHome={() => setCurrentRoute('home')}
          />
        )}

        {/* AUTHENTICATED APPLICATION WORKSPACE (AppShell) */}
        {currentRoute === 'app' && (
          <AppShell
            activeTab={appTab}
            onTabChange={setAppTab}
            onLogout={handleLogout}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            language={language}
            onLanguageChange={setLanguage}
            onViewStandardDetails={handleViewStandardDetails}
            onToggleSpecification={handleToggleSpecification}
            specificationStandards={specificationStandards}
            onRemoveSpecificationStandard={handleRemoveSpecificationStandard}
            onToggleSaveStandard={handleToggleSaveStandard}
            savedStandards={savedStandards}
            onCompareStandard={handleCompareStandard}
            comparedStandards={comparedStandards}
            onShowToast={showToast}
          />
        )}
      </div>

      {/* Show Public Footer on Public Pages */}
      {currentRoute !== 'app' && (
        <Footer onNavChange={setCurrentRoute} />
      )}

      {/* Standard Detail Modal */}
      <StandardDetailModal
        standard={selectedStandardForModal}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onToggleSpecification={handleToggleSpecification}
        isInSpecification={selectedStandardForModal && specificationStandards.some(s => s.standard_id === selectedStandardForModal.standard_id)}
        onToggleSave={handleToggleSaveStandard}
        isSaved={selectedStandardForModal && savedStandards.some(s => s.standard_id === selectedStandardForModal.standard_id)}
        onCompare={handleCompareStandard}
        isCompared={selectedStandardForModal && comparedStandards.some(s => s.standard_id === selectedStandardForModal.standard_id)}
      />

      {/* Standards Side-by-Side Comparison Modal */}
      <StandardCompareModal
        standards={comparedStandards}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onRemoveFromCompare={handleRemoveFromCompare}
        onToggleSpecification={handleToggleSpecification}
        specificationStandards={specificationStandards}
      />

      {/* Omnisearch Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectStandard={handleViewStandardDetails}
        onSelectTender={(tender) => {
          handleStartAnalysis(tender);
          setIsSearchModalOpen(false);
        }}
        onNavigate={(tab) => {
          setCurrentRoute('app');
          setAppTab(tab);
          setIsSearchModalOpen(false);
        }}
      />

      {/* Global Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: null, type: 'info' })}
      />
    </div>
  );
}
