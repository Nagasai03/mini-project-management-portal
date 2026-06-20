import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { createTask } from '../services/api';

const AddTaskPage = () => {
  const navigate = useNavigate();
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  
  // Validation / Loading States
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  // Client-Side Validation
  const validateForm = () => {
    const tempErrors = {};
    
    if (!title.trim()) {
      tempErrors.title = 'Task Title is required.';
    }
    
    if (!description.trim()) {
      tempErrors.description = 'Description is required.';
    } else if (description.trim().length < 20) {
      tempErrors.description = 'Description must be at least 20 characters long.';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        status
      });
      // Redirect to dashboard on success
      navigate('/');
    } catch (err) {
      console.error('Error creating task:', err);
      setApiError(
        err.response?.data?.message || 'Failed to create task. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      
      {/* Back to Dashboard Link */}
      <button 
        onClick={() => navigate('/')} 
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '24px' }}
      >
        <ArrowLeft size={14} />
        <span>Back to Dashboard</span>
      </button>

      {/* Form Container */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ width: '100%', maxWidth: '640px', padding: '36px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <PlusCircle size={28} style={{ color: 'var(--primary)' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Create New Task</h1>
          </div>

          {/* API error alert */}
          {apiError && (
            <div 
              style={{ 
                backgroundColor: 'var(--danger-bg)', 
                color: 'var(--danger-color)', 
                padding: '12px 16px', 
                borderRadius: 'var(--radius-md)', 
                fontSize: '14px', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 500
              }}
            >
              <AlertCircle size={16} />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Title Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="title">Task Title <span style={{ color: 'var(--danger-color)' }}>*</span></label>
              <input
                type="text"
                id="title"
                placeholder="e.g. Build Login Page"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                style={{ 
                  width: '100%',
                  borderColor: errors.title ? 'var(--danger-color)' : undefined
                }}
                required
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            {/* Description Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="description">Description <span style={{ color: 'var(--danger-color)' }}>*</span></label>
              <textarea
                id="description"
                placeholder="Provide a detailed description of the task (minimum 20 characters)..."
                rows="6"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
                className="form-control"
                style={{ 
                  width: '100%', 
                  resize: 'vertical',
                  borderColor: errors.description ? 'var(--danger-color)' : undefined
                }}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <span className="form-error">{errors.description}</span>
                <span style={{ fontSize: '11px', color: description.length < 20 ? 'var(--danger-color)' : 'var(--text-muted)' }}>
                  {description.length} / 20 chars min
                </span>
              </div>
            </div>

            {/* Status Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="status">Initial Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-control"
                style={{ width: '100%' }}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>

            {/* Form actions */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '12px', 
              borderTop: '1px solid var(--panel-border)',
              paddingTop: '24px',
              marginTop: '12px'
            }}>
              <button 
                type="button" 
                onClick={() => navigate('/')} 
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default AddTaskPage;
