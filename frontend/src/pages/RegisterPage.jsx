import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckSquare, User, Mail, Lock, ShieldCheck, Zap, BarChart2 } from 'lucide-react';
import { register } from '../services/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Registration failed. Email may already be in use.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-container">
      {/* Brand panel (Left Side) */}
      <div className="auth-sidebar-panel">
        <div className="sidebar-logo" style={{ color: '#ffffff' }}>
          <CheckSquare size={32} strokeWidth={2.5} />
          <span style={{ color: '#ffffff', background: 'none', WebkitTextFillColor: 'initial' }}>ProjectPortal</span>
        </div>

        <div style={{ margin: '60px 0' }}>
          <h2 style={{ fontSize: '38px', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px' }}>
            Start managing in minutes.
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px', lineHeight: 1.6, marginBottom: '40px' }}>
            Create an account to experience our dynamic project views, detailed statistics, and custom interfaces.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '10px' }}>
                <Zap size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '15px' }}>Kanban Column Boards</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>Simulate real-time status transitions easily</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '10px' }}>
                <BarChart2 size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '15px' }}>Visual Dashboard Stats</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>Track task counts, status completions, and pagination</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '10px' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '15px' }}>JWT Secure Authentication</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>Encrypted credentials with secure backend sessions</p>
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>
          © 2026 ProjectPortal Inc. All rights reserved.
        </p>
      </div>

      {/* Form panel (Right Side) */}
      <div className="auth-form-panel">
        <div className="auth-card-clean">
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Get Started
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Create a free account to coordinate your projects
            </p>
          </div>

          {error && (
            <div 
              style={{ 
                backgroundColor: 'var(--danger-bg)', 
                color: 'var(--danger)', 
                padding: '12px 16px', 
                borderRadius: 'var(--radius-md)', 
                fontSize: '14px', 
                marginBottom: '24px',
                fontWeight: 500,
                border: '1px solid rgba(220, 38, 38, 0.1)'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="search-input-wrapper">
                <User className="search-icon" size={16} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="search-input-wrapper">
                <Mail className="search-icon" size={16} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label className="form-label">Password</label>
              <div className="search-input-wrapper">
                <Lock className="search-icon" size={16} />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-footer" style={{ marginTop: '24px' }}>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
