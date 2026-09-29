import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 size={16} color="var(--success-700)" />,
    warning: <AlertTriangle size={16} color="var(--warning-700)" />,
    error: <AlertCircle size={16} color="var(--danger-700)" />,
    info: <CheckCircle2 size={16} color="var(--gov-navy-600)" />
  };

  const bgStyles = {
    success: { background: 'var(--success-50)', border: '1px solid var(--success-100)', color: 'var(--success-800)' },
    warning: { background: 'var(--warning-50)', border: '1px solid var(--warning-100)', color: 'var(--warning-800)' },
    error: { background: 'var(--danger-50)', border: '1px solid var(--danger-100)', color: 'var(--danger-800)' },
    info: { background: '#ffffff', border: '1px solid var(--slate-300)', color: 'var(--slate-800)' }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 18px',
        borderRadius: '6px',
        boxShadow: 'var(--shadow-md)',
        fontSize: '0.85rem',
        fontWeight: '500',
        maxWidth: '420px',
        ...bgStyles[type]
      }}
    >
      {icons[type]}
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'inherit' }}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = "720px" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 30, 54, 0.65)',
        backdropFilter: 'blur(2px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid var(--slate-300)',
          boxShadow: 'var(--shadow-lg)',
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--slate-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--slate-50)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--gov-navy-950)', fontWeight: '600' }}>
              {title}
            </h3>
            {subtitle && (
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--slate-400)',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex'
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
