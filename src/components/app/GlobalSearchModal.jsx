import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Search, FileText, Layers, Folder, History, ArrowRight, CornerDownLeft } from 'lucide-react';
import { STANDARDS_DATABASE } from '../../services/standardsDatabase';
import { MOCK_TENDERS } from '../../data/mockTenders';

export default function GlobalSearchModal({
  isOpen,
  onClose,
  onSelectStandard,
  onSelectTender,
  onNavigate
}) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // all, standards, documents, workspaces

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { standards: [], tenders: [] };

    const standards = STANDARDS_DATABASE.filter(s =>
      s.standard_number.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.keywords.some(k => k.toLowerCase().includes(q)) ||
      s.applicable_products.some(p => p.toLowerCase().includes(q))
    ).slice(0, 5);

    const tenders = MOCK_TENDERS.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.tender_number.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    ).slice(0, 3);

    return { standards, tenders };
  }, [query]);

  const hasResults = filteredResults.standards.length > 0 || filteredResults.tenders.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Global Procurement Search"
      subtitle="Search across Indian Standards repository, tender specifications, and active workspaces"
      maxWidth="700px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--slate-400)'
            }}
          />
          <input
            type="text"
            className="input"
            style={{ paddingLeft: '38px', height: '44px', fontSize: '0.95rem' }}
            placeholder="Type standard number (e.g. IS 4984), keyword, product, or tender parameter..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--slate-400)',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        {!query && (
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--slate-500)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Common Procurement Queries:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {["IS 4984 HDPE", "IS 1786 TMT Fe 500D", "IS 2026 Transformer", "IS 16844 CCTV Surveillance", "IS 14846 Sluice Valve", "IS 732 Wiring Code"].map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(sample)}
                  style={{
                    background: 'var(--slate-100)',
                    border: '1px solid var(--slate-300)',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    color: 'var(--gov-navy-900)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)'
                  }}
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Container */}
        {query && hasResults && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '420px', overflowY: 'auto' }}>
            {/* Standards Results */}
            {filteredResults.standards.length > 0 && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--slate-500)', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={13} /> Indian Standards Catalog ({filteredResults.standards.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {filteredResults.standards.map(std => (
                    <div
                      key={std.standard_id}
                      onClick={() => {
                        onSelectStandard(std);
                        onClose();
                      }}
                      style={{
                        padding: '10px 12px',
                        background: 'var(--slate-50)',
                        border: '1px solid var(--slate-200)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      className="search-item-hover"
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="standard-code">{std.standard_number}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--success-700)', fontWeight: '600' }}>
                            {std.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--gov-navy-950)', marginTop: '4px' }}>
                          {std.title}
                        </div>
                      </div>
                      <ArrowRight size={14} color="var(--slate-400)" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tenders / Specifications */}
            {filteredResults.tenders.length > 0 && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--slate-500)', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={13} /> Tender Specifications ({filteredResults.tenders.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {filteredResults.tenders.map(tnd => (
                    <div
                      key={tnd.id}
                      onClick={() => {
                        onSelectTender(tnd);
                        onClose();
                      }}
                      style={{
                        padding: '10px 12px',
                        background: 'var(--slate-50)',
                        border: '1px solid var(--slate-200)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontFamily: 'var(--font-mono)' }}>
                          {tnd.tender_number}
                        </div>
                        <div style={{ fontSize: '0.82rem', fontWeight: '500', color: 'var(--gov-navy-950)', marginTop: '2px' }}>
                          {tnd.title}
                        </div>
                      </div>
                      <ArrowRight size={14} color="var(--slate-400)" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State - Section 41 & 42 */}
        {query && !hasResults && (
          <div style={{
            padding: '32px 20px',
            textAlign: 'center',
            background: 'var(--slate-50)',
            borderRadius: '6px',
            border: '1px dashed var(--slate-300)'
          }}>
            <h4 style={{ color: 'var(--gov-navy-900)', fontSize: '0.95rem', marginBottom: '6px' }}>
              No standards found matching "{query}"
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '14px' }}>
              Try searching with:
            </p>
            <ul style={{ listStyle: 'none', display: 'inline-flex', flexDirection: 'column', gap: '4px', textAlign: 'left', fontSize: '0.78rem', color: 'var(--slate-600)' }}>
              <li>• A broader product description (e.g. "pipe", "cable", "transformer")</li>
              <li>• Another technical parameter (e.g. "PN 10", "Fe 500D", "dielectric")</li>
              <li>• A standard number (e.g. "IS 4984" or "IS 2062")</li>
              <li>• A related term from civil, electrical, or IT domains</li>
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}
