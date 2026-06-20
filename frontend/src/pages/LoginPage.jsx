import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckSquare, Mail, Lock } from 'lucide-react';
import { login } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card" style={{ padding: '40px' }}>
        <div className="auth-header">
          <div style={{ display: 'inline-flex', color: 'var(--primary)', marginBottom: '12px' }}>
            <CheckSquare size={40} />
          </div>
          <h1 className="auth-title">ProjectPortal</h1>
          <p className="auth-subtitle">Sign in to manage your tasks efficiently</p>
        </div>

        {error && (
          <div 
            style={{ 
              backgroundColor: 'var(--danger-bg)', 
              color: 'var(--danger-color)', 
              padding: '12px', 
              borderRadius: 'var(--radius-md)', 
              fontSize: '14px', 
              marginBottom: '20px',
              textAlign: 'center',
              fontWeight: 500
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
                style={{ width: '100%', paddingLeft: '38px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="search-input-wrapper">
              <Lock className="search-icon" size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={{ width: '100%', paddingLeft: '38px' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
