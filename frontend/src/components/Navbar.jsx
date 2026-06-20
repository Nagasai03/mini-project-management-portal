import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, LayoutDashboard, Plus, CheckSquare, User } from 'lucide-react';
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

  if (!user) return null; // Don't show sidebar if user is not logged in

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <CheckSquare size={28} strokeWidth={2.5} />
          <span>ProjectPortal</span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <ul className="sidebar-menu">
        <li>
          <Link
            to="/"
            className={`sidebar-item-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            to="/add-task"
            className={`sidebar-item-link ${location.pathname === '/add-task' ? 'active' : ''}`}
          >
            <Plus size={20} />
            <span>Add Task</span>
          </Link>
        </li>
      </ul>

      {/* User Section at Bottom */}
      <div className="sidebar-user">
        <div className="user-profile">
          <div className="user-avatar">
            {userInitial}
          </div>
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
        </div>

        <div className="sidebar-footer-actions">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)' }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Logout */}
          <button 
            onClick={handleLogout} 
            className="btn btn-secondary btn-sm"
            style={{ padding: '8px 12px', display: 'flex', gap: '6px' }}
            title="Log Out"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
