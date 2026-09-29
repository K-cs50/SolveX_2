import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/Badge';
import { X, Check, Plus, Layers, ShieldCheck, Wrench } from 'lucide-react';

export default function StandardCompareModal({
  standards = [],
  isOpen,
  onClose,
  onRemoveFromCompare,
  onToggleSpecification,
  specificationStandards = []
}) {
  if (!isOpen || standards.length === 0) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Standards Comparison Matrix"
      subtitle={`Comparing ${standards.length} Indian Standard${standards.length > 1 ? 's' : ''} across technical scope, test methods, and compliance status`}
      maxWidth="1020px"
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ background: 'var(--slate-100)', borderBottom: '2px solid var(--slate-300)' }}>
              <th style={{ padding: '12px', textAlign: 'left', width: '180px', color: 'var(--gov-navy-950)' }}>
                Parameter
              </th>
              {standards.map(std => (
                <th key={std.standard_id} style={{ padding: '12px', textAlign: 'left', minWidth: '260px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div>
                      <span className="standard-code">{std.standard_number}</span>
                      <div style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--slate-600)', marginTop: '4px' }}>
                        {std.title}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveFromCompare(std.standard_id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}
                      title="Remove from comparison"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Status & Version */}
            <tr style={{ borderBottom: '1px solid var(--slate-200)' }}>
              <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--slate-700)', background: 'var(--slate-50)' }}>
                Status & Version
              </td>
              {standards.map(std => (
                <td key={std.standard_id} style={{ padding: '10px 12px' }}>
                  <StatusBadge status={std.status} />
                  <div className="mono" style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--slate-600)' }}>
                    {std.current_version}
                  </div>
                </td>
              ))}
            </tr>

            {/* Scope */}
            <tr style={{ borderBottom: '1px solid var(--slate-200)' }}>
              <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--slate-700)', background: 'var(--slate-50)' }}>
                Scope & Coverage
              </td>
              {standards.map(std => (
                <td key={std.standard_id} style={{ padding: '10px 12px', color: 'var(--slate-700)', lineHeight: '1.4' }}>
                  {std.scope}
                </td>
              ))}
            </tr>

            {/* Key Test Methods */}
            <tr style={{ borderBottom: '1px solid var(--slate-200)' }}>
              <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--slate-700)', background: 'var(--slate-50)' }}>
                Key Test Methods
              </td>
              {standards.map(std => (
                <td key={std.standard_id} style={{ padding: '10px 12px' }}>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {std.test_methods?.slice(0, 3).map((tm, idx) => (
                      <li key={idx} style={{ fontSize: '0.75rem' }}>
                        <span className="mono" style={{ color: 'var(--gov-navy-800)', fontWeight: '600' }}>{tm.clause}: </span>
                        <span>{tm.title}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Certification Scheme */}
            <tr style={{ borderBottom: '1px solid var(--slate-200)' }}>
              <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--slate-700)', background: 'var(--slate-50)' }}>
                Certification Scheme
              </td>
              {standards.map(std => (
                <td key={std.standard_id} style={{ padding: '10px 12px', fontSize: '0.75rem' }}>
                  <div style={{ fontWeight: '600', color: 'var(--gov-navy-950)' }}>
                    {std.certification_information?.scheme || "BIS Certification"}
                  </div>
                  <div style={{ color: 'var(--slate-600)', marginTop: '2px' }}>
                    {std.certification_information?.mandatory_status}
                  </div>
                </td>
              ))}
            </tr>

            {/* Normative References */}
            <tr style={{ borderBottom: '1px solid var(--slate-200)' }}>
              <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--slate-700)', background: 'var(--slate-50)' }}>
                Normative Dependencies
              </td>
              {standards.map(std => (
                <td key={std.standard_id} style={{ padding: '10px 12px', fontSize: '0.75rem' }}>
                  {std.normative_references?.map(nr => nr.standard_number).join(', ') || "None"}
                </td>
              ))}
            </tr>

            {/* Procurement Action */}
            <tr>
              <td style={{ padding: '12px', background: 'var(--slate-50)' }}>
                Specification Action
              </td>
              {standards.map(std => {
                const inSpec = specificationStandards.some(s => s.standard_id === std.standard_id);
                return (
                  <td key={std.standard_id} style={{ padding: '12px' }}>
                    <button
                      onClick={() => onToggleSpecification(std)}
                      className={`btn btn-sm ${inSpec ? 'btn-accent' : 'btn-primary'}`}
                      style={{ width: '100%' }}
                    >
                      {inSpec ? <Check size={13} /> : <Plus size={13} />}
                      {inSpec ? "In Specification" : "Add to Specification"}
                    </button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
