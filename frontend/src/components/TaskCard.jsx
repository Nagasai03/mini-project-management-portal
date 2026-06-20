import React from 'react';
import { Calendar, CheckCircle, Trash2, ArrowRight } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, onDelete }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'badge-pending';
      case 'In Progress':
        return 'badge-progress';
      case 'Completed':
        return 'badge-completed';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span className={`badge ${getStatusBadgeClass(task.status)}`}>
          {task.status}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <Calendar size={12} />
          {formatDate(task.createdAt)}
        </span>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
        {task.title}
      </h3>

      <p style={{ 
        fontSize: '14px', 
        color: 'var(--text-secondary)', 
        marginBottom: '20px',
        lineHeight: '1.5',
        minHeight: '60px',
        whiteSpace: 'pre-line'
      }}>
        {task.description}
      </p>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderTop: '1px solid var(--panel-border)',
        paddingTop: '16px',
        marginTop: 'auto'
      }}>
        {/* Status quick changer or selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
          <select 
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="form-control"
            style={{ padding: '4px 8px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {task.status !== 'Completed' && (
            <button
              onClick={() => onStatusChange(task.id, 'Completed')}
              className="btn btn-primary btn-sm"
              title="Mark as Completed"
              style={{ padding: '6px 8px' }}
            >
              <CheckCircle size={14} />
              <span>Complete</span>
            </button>
          )}

          <button
            onClick={() => onDelete(task.id)}
            className="btn btn-danger btn-sm"
            title="Delete Task"
            style={{ padding: '6px 8px' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
