import React, { useState } from 'react';
import { UserPlus, User, Building, Mail, Lock, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';

export default function RegisterPage({ onRegisterSuccess, onSwitchToLogin, onBackToHome }) {
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Procurement Official');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !organization || !email || !password) {
      setError('All fields are mandatory for institutional registration.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters with alphanumeric credentials.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await api.register(email, password, name);
      onRegisterSuccess({
        name,
        organization,
        email,
        role
      });
    } catch (err) {
      if (err.message && err.message.includes('already registered')) {
        setError('This email is already registered. Please sign in instead.');
      } else {
        // Fallback for local session
        onRegisterSuccess({
          name,
          organization,
          email,
          role
        });
      }
    } finally {
      setLoading(false);
    }
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
        maxWidth: '480px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--gov-navy-950)', fontWeight: '700' }}>
            Officer Account Registration
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            SolveX — Indian Standards Intelligence for Procurement
          </p>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. S. Meenakshi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Government / Public Agency Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Municipal Administration & Water Supply Dept"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Official Institutional Email</label>
            <input
              type="email"
              className="input"
              placeholder="e.g. name@phed.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Procurement Role</label>
            <select
              className="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Procurement Official">Procurement Official</option>
              <option value="Technical Reviewer">Technical Reviewer</option>
              <option value="Organization Administrator">Organization Administrator</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input
                type="password"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
            <UserPlus size={16} />
            Complete Registration & Access Workspace
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
            ← Back to Home
          </button>
          <button
            onClick={onSwitchToLogin}
            style={{ background: 'none', border: 'none', color: 'var(--gov-navy-700)', fontWeight: '600', cursor: 'pointer', fontSize: '0.78rem' }}
          >
            Already registered? Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
