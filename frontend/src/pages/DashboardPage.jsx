import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Hourglass, 
  Activity, 
  CheckCircle, 
  Search, 
  Plus, 
  AlertCircle 
} from 'lucide-react';
import { getTasks, updateTaskStatus, deleteTask, getTaskStats } from '../services/api';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination & Filters State
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0
  });
  
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const limit = 6; // Number of tasks per page

  // Fetch Stats
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
      const params = {
        status: filterStatus,
        search: searchQuery || undefined,
        sortBy,
        order: sortOrder,
        page,
        limit
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
  }, [filterStatus, searchQuery, sortBy, sortOrder, page]);

  // Initial and reactive data loading
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks]);

  // Reset pagination to page 1 on filter/search change
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

  // Change Task Status (e.g., Complete Task or change to In Progress)
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      // Refresh tasks and stats
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        // Refresh tasks and stats
        fetchTasks();
        fetchStats();
      } catch (err) {
        console.error('Error deleting task:', err);
        alert(err.response?.data?.message || 'Failed to delete task.');
      }
    }
  };

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '50px' }}>
      
      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>
            Overview of your project tasks and statistics
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/add-task')}>
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Stats Cards Row */}
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

      {/* Filter and Search controls */}
      <div className="dashboard-controls">
        <div className="controls-left">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-control search-input"
            />
          </div>
          
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
        </div>

        <div className="controls-right">
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Sort By:</span>
          <select 
            value={sortBy} 
            onChange={handleSortByChange}
            className="form-control"
          >
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>

          <select 
            value={sortOrder} 
            onChange={handleSortOrderChange}
            className="form-control"
          >
            <option value="DESC">Newest First</option>
            <option value="ASC">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div 
          style={{ 
            backgroundColor: 'var(--danger-bg)', 
            color: 'var(--danger-color)', 
            padding: '16px', 
            borderRadius: 'var(--radius-md)', 
            fontSize: '14px', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 500
          }}
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Main tasks display container */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Fetching your tasks...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ClipboardList size={48} />
          </div>
          <h2 className="empty-state-title" style={{ color: 'var(--text-primary)' }}>No Tasks Found</h2>
          <p className="empty-state-desc">
            {searchQuery || filterStatus !== 'All' 
              ? "We couldn't find any tasks matching your filters. Try adjusting your query."
              : "You don't have any tasks registered yet. Start by creating your first task!"
            }
          </p>
          {!(searchQuery || filterStatus !== 'All') && (
            <button className="btn btn-primary" onClick={() => navigate('/add-task')}>
              <Plus size={18} />
              <span>Create First Task</span>
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid-tasks">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onStatusChange={handleStatusChange} 
                onDelete={handleDeleteTask} 
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {page} of {totalPages} ({totalCount} total)
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
        </>
      )}

    </div>
  );
};

export default DashboardPage;
