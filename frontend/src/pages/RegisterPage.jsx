import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckSquare, User, Mail, Lock } from 'lucide-react';
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

    // Basic Validation
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
    <div className="auth-wrapper">
      <div className="card auth-card" style={{ padding: '40px' }}>
        <div className="auth-header">
          <div style={{ display: 'inline-flex', color: 'var(--primary)', marginBottom: '12px' }}>
            <CheckSquare size={40} />
          </div>
          <h1 className="auth-title">Register</h1>
          <p className="auth-subtitle">Create an account to manage your projects</p>
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
            <label className="form-label">Full Name</label>
            <div className="search-input-wrapper">
              <User className="search-icon" size={16} />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                style={{ width: '100%', paddingLeft: '38px' }}
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
                placeholder="At least 6 characters"
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
