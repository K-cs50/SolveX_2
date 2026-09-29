import React from 'react';
import { Search, Globe, LogIn, LayoutDashboard, Shield, BookOpen, Layers } from 'lucide-react';
import { TRANSLATIONS } from '../../data/translations';

export default function Header({
  activeNav,
  onNavChange,
  isLoggedIn,
  onOpenLogin,
  onOpenSearch,
  language,
  onLanguageChange
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const languagesList = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' }
  ];

  return (
    <header className="main-header-wrapper">
      {/* Top Institutional Bar - Section 10 */}
      <div className="gov-top-bar">
        <div className="gov-top-bar-left">
          <span className="gov-top-bar-badge">Official Repository</span>
          <span>{t.topBarTitle}</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>BIS & Indian Standards Reference Architecture</span>
        </div>
        <div className="gov-top-bar-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={13} />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              style={{
                background: 'transparent',
                color: '#fff',
                border: 'none',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                outline: 'none'
              }}
              aria-label="Select Interface Language"
            >
              {languagesList.map(l => (
                <option key={l.code} value={l.code} style={{ background: '#0b1e36', color: '#fff' }}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ fontSize: '0.72rem' }}>Support: support@solvex.gov.in (Demonstration Desk)</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="main-header" aria-label="Main Navigation">
        <div className="main-header-container">
          {/* Brand Logo & Tagline */}
          <div className="brand-block" onClick={() => onNavChange('home')} role="button" tabIndex={0}>
            <div className="brand-emblem" aria-hidden="true">
              SX
            </div>
            <div className="brand-text">
              <span className="brand-name">
                Solve<span>X</span>
              </span>
              <span className="brand-sub">Standards Intelligence</span>
            </div>
          </div>

          {/* Navigation Links */}
          <ul className="nav-links">
            <li>
              <button
                className={`nav-link-btn ${activeNav === 'home' ? 'active' : ''}`}
                onClick={() => onNavChange('home')}
              >
                {t.navHome}
              </button>
            </li>
            <li>
              <button
                className={`nav-link-btn ${activeNav === 'standards' ? 'active' : ''}`}
                onClick={() => onNavChange('standards')}
              >
                {t.navStandards}
              </button>
            </li>
            <li>
              <button
                className={`nav-link-btn ${activeNav === 'procurement' ? 'active' : ''}`}
                onClick={() => onNavChange('procurement')}
              >
                {t.navProcurement}
              </button>
            </li>
            <li>
              <button
                className={`nav-link-btn ${activeNav === 'recommendations' ? 'active' : ''}`}
                onClick={() => onNavChange('recommendations')}
              >
                {t.navRecommendations}
              </button>
            </li>
            <li>
              <button
                className={`nav-link-btn ${activeNav === 'documents' ? 'active' : ''}`}
                onClick={() => onNavChange('documents')}
              >
                {t.navDocuments}
              </button>
            </li>
            <li>
              <button
                className={`nav-link-btn ${activeNav === 'about' ? 'active' : ''}`}
                onClick={() => onNavChange('about')}
              >
                {t.navAbout}
              </button>
            </li>
          </ul>

          {/* Right Action Buttons */}
          <div className="header-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={onOpenSearch}
              title="Search Indian Standards, Specifications, and Documents"
              aria-label="Search Standards"
            >
              <Search size={14} />
              <span style={{ fontSize: '0.8rem' }}>Search</span>
              <kbd style={{
                background: 'var(--slate-100)',
                border: '1px solid var(--slate-300)',
                borderRadius: '3px',
                padding: '1px 5px',
                fontSize: '0.68rem',
                color: 'var(--slate-500)'
              }}>⌘K</kbd>
            </button>

            {isLoggedIn ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onNavChange('app')}
              >
                <LayoutDashboard size={14} />
                <span>{t.navWorkspace}</span>
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={onOpenLogin}
              >
                <LogIn size={14} />
                <span>{t.navLogin}</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Demonstration Data Banner - Section 12, 58, 69 */}
      <div className="demo-banner">
        <div className="demo-banner-content">
          <span className="demo-pill">Demonstration Mode</span>
          <span>{t.demoNotice}</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
          BIS Act 2016 Conforming Schema v2.4
        </span>
      </div>
    </header>
  );
}
