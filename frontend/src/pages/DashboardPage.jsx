import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Hourglass, 
  Activity, 
  CheckCircle, 
  Search, 
  Plus, 
  AlertCircle,
  Kanban,
  List,
  Calendar,
  Trash2,
  Check
} from 'lucide-react';
import { getTasks, updateTaskStatus, deleteTask, getTaskStats } from '../services/api';
import StatsCard from '../components/StatsCard';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  // UI states
  const [viewMode, setViewMode] = useState('Board'); // 'Board' or 'List'
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dashboard Metrics State
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0
  });
  
  // Filters/Queries State
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch Dashboard Stats
  const fetchStats = async () => {
    try {
      const statsData = await getTaskStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch Tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // In Board View, we retrieve a larger list (e.g. limit=100) to group them all into Kanban columns.
      // In List View, we retrieve a paginated size of 6.
      const isBoard = viewMode === 'Board';
      const params = {
        status: isBoard ? 'All' : (filterStatus !== 'All' ? filterStatus : undefined),
        search: searchQuery || undefined,
        sortBy,
        order: sortOrder,
        page: isBoard ? 1 : page,
        limit: isBoard ? 100 : 6
      };
      
      const data = await getTasks(params);
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setTotalCount(data.count);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Could not fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [viewMode, filterStatus, searchQuery, sortBy, sortOrder, page]);

  // Initial and reactive data loading
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks]);

  // Reset pagination page on filter/search changes
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setPage(1);
  };

  // Status Change trigger
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  // Delete task trigger
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        fetchTasks();
        fetchStats();
      } catch (err) {
        console.error('Error deleting task:', err);
        alert(err.response?.data?.message || 'Failed to delete task.');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Group tasks for Board View
  const pendingBoardTasks = tasks.filter(t => t.status === 'Pending');
  const progressBoardTasks = tasks.filter(t => t.status === 'In Progress');
  const completedBoardTasks = tasks.filter(t => t.status === 'Completed');

  return (
    <div style={{ width: '100%' }}>
      {/* Dashboard Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Workspace</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Coordinate tasks, monitor status, and manage project deliverables.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* View Toggler */}
          <div className="view-toggle-group">
            <button 
              className={`view-toggle-btn ${viewMode === 'Board' ? 'active' : ''}`}
              onClick={() => setViewMode('Board')}
            >
              <Kanban size={15} />
              <span>Board</span>
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === 'List' ? 'active' : ''}`}
              onClick={() => setViewMode('List')}
            >
              <List size={15} />
              <span>List</span>
            </button>
          </div>

          <button className="btn btn-primary" onClick={() => navigate('/add-task')}>
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-stats">
        <StatsCard 
          count={stats.totalTasks} 
          label="Total Tasks" 
          icon={ClipboardList} 
          color="primary" 
        />
        <StatsCard 
          count={stats.pendingTasks} 
          label="Pending" 
          icon={Hourglass} 
          color="pending" 
        />
        <StatsCard 
          count={stats.inProgressTasks} 
          label="In Progress" 
          icon={Activity} 
          color="progress" 
        />
        <StatsCard 
          count={stats.completedTasks} 
          label="Completed" 
          icon={CheckCircle} 
          color="completed" 
        />
      </div>

      {/* Toolbar / Search panel */}
      <div className="dashboard-controls glass-panel" style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--panel-border)' }}>
        <div className="controls-left">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search tasks by title..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-control search-input"
            />
          </div>
          
          {/* Only show status filter in list view, as board naturally shows all columns */}
          {viewMode === 'List' && (
            <select 
              value={filterStatus} 
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          )}
        </div>

        <div className="controls-right">
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Sort By:</span>
          <select 
            value={sortBy} 
            onChange={handleSortByChange}
            className="form-control"
          >
            <option value="createdAt">Date Created</option>
            <option value="title">Alphabetical</option>
            <option value="status">Status Priority</option>
          </select>

          <select 
            value={sortOrder} 
            onChange={handleSortOrderChange}
            className="form-control"
          >
            <option value="DESC">Newest</option>
            <option value="ASC">Oldest</option>
          </select>
        </div>
      </div>

      {error && (
        <div 
          style={{ 
            backgroundColor: 'var(--danger-bg)', 
            color: 'var(--danger)', 
            padding: '16px', 
            borderRadius: 'var(--radius-md)', 
            fontSize: '14px', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 500,
            border: '1px solid rgba(220, 38, 38, 0.1)'
          }}
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Main Task Contents */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Syncing workspace...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', borderStyle: 'dashed', borderWidth: '2px' }}>
          <ClipboardList size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>No tasks found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 20px auto' }}>
            {searchQuery || filterStatus !== 'All' 
              ? 'No tasks match your current queries. Try clearing the search bar or filters.' 
              : 'Your workspace is empty! Get started by adding a task.'}
          </p>
          {!(searchQuery || filterStatus !== 'All') && (
            <button className="btn btn-primary" onClick={() => navigate('/add-task')}>
              <Plus size={16} />
              <span>Create Task</span>
            </button>
          )}
        </div>
      ) : viewMode === 'Board' ? (
        /* KANBAN BOARD VIEW */
        <div className="kanban-board">
          
          {/* Column 1: Pending */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <div className="kanban-column-title-group">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--pending)' }}></div>
                <h3 className="kanban-column-title">Pending</h3>
              </div>
              <span className="kanban-column-count">{pendingBoardTasks.length}</span>
            </div>
            
            <div className="kanban-column-content custom-scrollbar">
              {pendingBoardTasks.map(task => (
                <div key={task.id} className="kanban-task-card Pending">
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{task.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--panel-border)', paddingTop: '12px', marginTop: '12px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={11} />
                      {formatDate(task.createdAt)}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <select 
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="form-control"
                        style={{ padding: '2px 6px', fontSize: '11px', borderRadius: 'var(--radius-sm)' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button onClick={() => handleStatusChange(task.id, 'Completed')} className="btn btn-secondary btn-sm" style={{ padding: '4px' }} title="Quick Complete">
                        <Check size={12} />
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)} className="btn btn-danger btn-sm" style={{ padding: '4px', background: 'transparent' }} title="Delete Task">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <div className="kanban-column-title-group">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--progress)' }}></div>
                <h3 className="kanban-column-title">In Progress</h3>
              </div>
              <span className="kanban-column-count">{progressBoardTasks.length}</span>
            </div>
            
            <div className="kanban-column-content custom-scrollbar">
              {progressBoardTasks.map(task => (
                <div key={task.id} className="kanban-task-card In-Progress">
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{task.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--panel-border)', paddingTop: '12px', marginTop: '12px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={11} />
                      {formatDate(task.createdAt)}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <select 
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="form-control"
                        style={{ padding: '2px 6px', fontSize: '11px', borderRadius: 'var(--radius-sm)' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button onClick={() => handleStatusChange(task.id, 'Completed')} className="btn btn-secondary btn-sm" style={{ padding: '4px' }} title="Quick Complete">
                        <Check size={12} />
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)} className="btn btn-danger btn-sm" style={{ padding: '4px', background: 'transparent' }} title="Delete Task">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <div className="kanban-column-title-group">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--completed)' }}></div>
                <h3 className="kanban-column-title">Completed</h3>
              </div>
              <span className="kanban-column-count">{completedBoardTasks.length}</span>
            </div>
            
            <div className="kanban-column-content custom-scrollbar">
              {completedBoardTasks.map(task => (
                <div key={task.id} className="kanban-task-card Completed">
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{task.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--panel-border)', paddingTop: '12px', marginTop: '12px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={11} />
                      {formatDate(task.createdAt)}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <select 
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="form-control"
                        style={{ padding: '2px 6px', fontSize: '11px', borderRadius: 'var(--radius-sm)' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button onClick={() => handleDeleteTask(task.id)} className="btn btn-danger btn-sm" style={{ padding: '4px', background: 'transparent' }} title="Delete Task">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* LIST VIEW TABLE */
        <div className="card glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="list-view-table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date Created</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="list-view-row">
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {task.title}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {task.description}
                    </td>
                    <td>
                      <span className={`badge ${
                        task.status === 'Completed' ? 'badge-completed' :
                        task.status === 'In Progress' ? 'badge-progress' : 'badge-pending'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      {formatDate(task.createdAt)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <select 
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className="form-control"
                          style={{ padding: '4px 8px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        
                        {task.status !== 'Completed' && (
                          <button 
                            onClick={() => handleStatusChange(task.id, 'Completed')} 
                            className="btn btn-secondary btn-sm"
                            title="Complete Task"
                          >
                            <Check size={13} />
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleDeleteTask(task.id)} 
                          className="btn btn-danger btn-sm"
                          title="Delete Task"
                          style={{ display: 'flex', padding: '6px' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (Only in List View) */}
          {totalPages > 1 && (
            <div className="pagination" style={{ padding: '16px 24px', borderTop: '1px solid var(--panel-border)' }}>
              <button 
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Page {page} of {totalPages}
              </span>

              <button 
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
