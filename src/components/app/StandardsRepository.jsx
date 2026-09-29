import React, { useState, useMemo } from 'react';
import { Search, Grid, List, Filter, SlidersHorizontal, X, BookOpen, TrendingUp } from 'lucide-react';
import { STANDARDS_DATABASE } from '../../services/standardsDatabase';
import { RetrievalService } from '../../services/retrievalService';
import StandardCard from './StandardCard';

export default function StandardsRepository({
  onViewStandardDetails,
  onToggleSpecification,
  specificationStandards = [],
  onToggleSaveStandard,
  savedStandards = [],
  onCompareStandard,
  comparedStandards = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [showFilters, setShowFilters] = useState(false);

  // Distinct domains and categories from database
  const domains = useMemo(() => {
    const set = new Set();
    STANDARDS_DATABASE.forEach(s => s.technical_domains?.forEach(d => set.add(d)));
    return Array.from(set).sort();
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    STANDARDS_DATABASE.forEach(s => s.product_categories?.forEach(c => set.add(c)));
    return Array.from(set).sort();
  }, []);

  const activeFiltersCount = [
    selectedDomain !== 'all',
    selectedCategory !== 'all',
    selectedStatus !== 'all'
  ].filter(Boolean).length;

  // Filter & Search
  const searchResults = useMemo(() => {
    return RetrievalService.search(searchQuery, {
      domain: selectedDomain,
      category: selectedCategory,
      status: selectedStatus
    });
  }, [searchQuery, selectedDomain, selectedCategory, selectedStatus]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDomain('all');
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  // Domain statistics for quick filter chips
  const domainStats = useMemo(() => {
    const stats = {};
    STANDARDS_DATABASE.forEach(s => {
      s.technical_domains?.forEach(d => {
        stats[d] = (stats[d] || 0) + 1;
      });
    });
    return stats;
  }, []);

  const topDomains = Object.entries(domainStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([domain]) => domain);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

      {/* Header */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--slate-200)',
        borderRadius: '10px',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <BookOpen size={20} color="var(--gov-navy-800)" />
            <h1 style={{ fontSize: '1.35rem', color: 'var(--gov-navy-950)', fontWeight: '700' }}>
              Indian Standards Repository
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '2px' }}>
            BIS Knowledge Base — Search Indian Standards across civil, electrotechnical, metallurgical, and electronics divisions.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', background: 'var(--slate-100)', padding: '5px 12px', borderRadius: '6px', border: '1px solid var(--slate-200)' }}>
            <strong style={{ color: 'var(--gov-navy-950)' }}>{STANDARDS_DATABASE.length}</strong> Curated Standards Indexed
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>
            Curated Demonstration Knowledge Base
          </div>
        </div>
      </div>

      {/* Quick Domain Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick:</span>
        <button
          onClick={() => setSelectedDomain('all')}
          className={`chip ${selectedDomain === 'all' ? 'chip-navy' : 'chip-slate'}`}
          style={{ cursor: 'pointer', border: 'none' }}
        >
          All Domains
        </button>
        {topDomains.map(domain => (
          <button
            key={domain}
            onClick={() => setSelectedDomain(selectedDomain === domain ? 'all' : domain)}
            className={`chip ${selectedDomain === domain ? 'chip-navy' : 'chip-slate'}`}
            style={{ cursor: 'pointer', border: 'none' }}
          >
            {domain} <span style={{ opacity: 0.6 }}>({domainStats[domain]})</span>
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

          {/* Main Search Input */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input
              type="text"
              className="input"
              style={{ paddingLeft: '34px', paddingRight: searchQuery ? '32px' : '12px' }}
              placeholder="Search by standard code (IS 4984), title, test parameter, product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search Indian Standards"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Toggle Filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '6px', whiteSpace: 'nowrap' }}
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFiltersCount > 0 && (
              <span style={{ background: 'var(--saffron-500)', color: '#fff', fontSize: '0.65rem', fontWeight: '700', padding: '0 5px', borderRadius: '8px' }}>
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* View Toggle */}
          <div style={{ display: 'flex', border: '1px solid var(--slate-300)', borderRadius: '6px', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? 'var(--gov-navy-900)' : '#fff',
                color: viewMode === 'list' ? '#fff' : 'var(--slate-600)',
                border: 'none', cursor: 'pointer', padding: '6px 10px',
                display: 'flex', alignItems: 'center'
              }}
              title="List view"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? 'var(--gov-navy-900)' : '#fff',
                color: viewMode === 'grid' ? '#fff' : 'var(--slate-600)',
                border: 'none', cursor: 'pointer', padding: '6px 10px',
                display: 'flex', alignItems: 'center'
              }}
              title="Grid view"
            >
              <Grid size={15} />
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--slate-100)' }}>
            <div>
              <label className="label" style={{ fontSize: '0.72rem' }}>Technical Domain</label>
              <select
                className="select"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
              >
                <option value="all">All Domains</option>
                {domains.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" style={{ fontSize: '0.72rem' }}>Product Category</label>
              <select
                className="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" style={{ fontSize: '0.72rem' }}>Verification Status</label>
              <select
                className="select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="current">Current (Active)</option>
                <option value="superseded">Superseded / Withdrawn</option>
                <option value="amended">Amended</option>
              </select>
            </div>

            {activeFiltersCount > 0 && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>
                  <X size={12} />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
          <strong style={{ color: 'var(--gov-navy-950)' }}>{searchResults.length}</strong> Indian Standard records matched
          {searchQuery && <span> for <em>"{searchQuery}"</em></span>}
        </span>
        {(searchQuery || activeFiltersCount > 0) && (
          <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>
            Clear Search
          </button>
        )}
      </div>

      {/* Results Display */}
      {searchResults.length > 0 ? (
        <div style={viewMode === 'grid' ? {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
          gap: '14px'
        } : {
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {searchResults.map(standard => (
            <StandardCard
              key={standard.standard_id}
              standard={standard}
              onViewDetails={onViewStandardDetails}
              onToggleSpecification={onToggleSpecification}
              isInSpecification={specificationStandards.some(s => s.standard_id === standard.standard_id)}
              onToggleSave={onToggleSaveStandard}
              isSaved={savedStandards.some(s => s.standard_id === standard.standard_id)}
              onCompare={onCompareStandard}
              isCompared={comparedStandards.some(s => s.standard_id === standard.standard_id)}
            />
          ))}
        </div>
      ) : (
        <div style={{
          padding: '64px 24px',
          textAlign: 'center',
          background: '#ffffff',
          border: '1px dashed var(--slate-300)',
          borderRadius: '10px'
        }}>
          <Search size={32} color="var(--slate-300)" style={{ marginBottom: '14px' }} />
          <h3 style={{ color: 'var(--gov-navy-950)', fontSize: '1.1rem', marginBottom: '8px' }}>
            No Indian Standards matched your query
          </h3>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto 16px' }}>
            Try broadening your search terms, clearing domain filters, or using a standard code like "IS 4984".
          </p>
          <button onClick={clearFilters} className="btn btn-secondary">
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
