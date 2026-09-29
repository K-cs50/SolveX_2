import React, { useState } from 'react';
import { LogIn, Lock, Mail, Shield, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLoginSuccess, onSwitchToRegister, onBackToHome }) {
  const [email, setEmail] = useState('officer.chaitanya@procurement.gov.in');
  const [password, setPassword] = useState('GovStandards2026!');
  const [role, setRole] = useState('Technical Reviewer');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your registered procurement email and password.');
      return;
    }
    setError('');
    onLoginSuccess({
      email,
      name: "K. Chaitanya",
      role,
      organization: "State Public Health & Water Supply Mission"
    });
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'var(--slate-50)'
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--slate-300)',
        borderRadius: '8px',
        padding: '36px 32px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Brand Header - Section 19 */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: 'var(--gov-navy-950)',
            color: '#fff',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '1.25rem',
            margin: '0 auto 12px',
            border: '1px solid var(--gov-navy-700)'
          }}>
            SX
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--gov-navy-950)', fontWeight: '700', letterSpacing: '-0.02em' }}>
            Solve<span style={{ color: 'var(--saffron-600)' }}>X</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '4px', fontWeight: '500' }}>
            Indian Standards Intelligence for Procurement
          </p>
          <div style={{
            fontSize: '0.72rem',
            color: 'var(--slate-500)',
            background: 'var(--slate-100)',
            padding: '4px 8px',
            borderRadius: '4px',
            marginTop: '8px',
            display: 'inline-block'
          }}>
            Institutional Procurement Officer Login
          </div>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-50)',
            border: '1px solid var(--danger-100)',
            color: 'var(--danger-800)',
            padding: '10px 12px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="label">Official Email / Username</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input
                type="email"
                className="input"
                style={{ paddingLeft: '34px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="label" style={{ margin: 0 }}>Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Demo Mode: Use pre-filled credentials to sign in."); }} style={{ fontSize: '0.75rem', color: 'var(--gov-navy-600)', textDecoration: 'none' }}>
                Forgot Password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input
                type="password"
                className="input"
                style={{ paddingLeft: '34px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Evaluation Role</label>
            <select
              className="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Technical Reviewer">Technical Reviewer / Evaluator</option>
              <option value="Procurement Official">Procurement Official / Tender Drafter</option>
              <option value="Organization Administrator">Organization Administrator</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', marginTop: '6px' }}>
            <LogIn size={16} />
            Sign In to Workspace
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid var(--slate-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem'
        }}>
          <button
            onClick={onBackToHome}
            style={{ background: 'none', border: 'none', color: 'var(--slate-500)', cursor: 'pointer', fontSize: '0.78rem' }}
          >
            ← Back to Public Portal
          </button>
          <button
            onClick={onSwitchToRegister}
            style={{ background: 'none', border: 'none', color: 'var(--gov-navy-700)', fontWeight: '600', cursor: 'pointer', fontSize: '0.78rem' }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
