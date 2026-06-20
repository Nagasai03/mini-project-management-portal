import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, LayoutDashboard, Plus, CheckSquare } from 'lucide-react';
import { logout, getCurrentUser } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null; // Don't show navbar if user is not logged in

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <CheckSquare size={26} />
          <span>ProjectPortal</span>
        </Link>

        <ul className="navbar-links">
          <li>
            <Link
              to="/"
              className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <LayoutDashboard size={16} />
                Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/add-task"
              className={`navbar-link ${location.pathname === '/add-task' ? 'active' : ''}`}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} />
                Add Task
              </span>
            </Link>
          </li>
        </ul>

        <div className="navbar-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginRight: '8px'
            }}
          >
            Hi, {user.name}
          </span>

          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
