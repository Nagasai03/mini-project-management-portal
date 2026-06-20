import React from 'react';

const StatsCard = ({ count, label, icon: Icon, color }) => {
  const getColorStyles = (colorName) => {
    switch (colorName) {
      case 'primary':
        return {
          bg: 'var(--primary-glow)',
          color: 'var(--primary)'
        };
      case 'pending':
        return {
          bg: 'var(--pending-bg)',
          color: 'var(--pending-color)'
        };
      case 'progress':
        return {
          bg: 'var(--progress-bg)',
          color: 'var(--progress-color)'
        };
      case 'completed':
        return {
          bg: 'var(--completed-bg)',
          color: 'var(--completed-color)'
        };
      default:
        return {
          bg: 'var(--panel-border)',
          color: 'var(--text-primary)'
        };
    }
  };

  const styles = getColorStyles(color);

  return (
    <div className="card stats-card">
      <div 
        className="stats-icon-wrapper"
        style={{ backgroundColor: styles.bg, color: styles.color }}
      >
        <Icon size={24} />
      </div>
      <div className="stats-info">
        <span className="stats-count" style={{ color: 'var(--text-primary)' }}>{count}</span>
        <span className="stats-label">{label}</span>
      </div>
    </div>
  );
};

export default StatsCard;
