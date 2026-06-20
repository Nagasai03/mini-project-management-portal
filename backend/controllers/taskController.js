const { Op } = require('sequelize');
const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /tasks or GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, search, sortBy, order, page, limit } = req.query;

    // Build query conditions
    const whereCondition = { userId };

    // Filter by status
    if (status && status !== 'All') {
      whereCondition.status = status;
    }

    // Search by title or description
    if (search) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Sorting
    const sortField = sortBy || 'createdAt';
    const sortOrder = order && order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offsetNum = (pageNum - 1) * limitNum;

    // Query database
    const { count, rows: tasks } = await Task.findAndCountAll({
      where: whereCondition,
      order: [[sortField, sortOrder]],
      limit: limitNum,
      offset: offsetNum
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error fetching tasks', error: error.message });
  }
};

// @desc    Create a new task
// @route   POST /tasks or POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, status } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    if (!description || description.length < 20) {
      return res.status(400).json({ message: 'Description must be at least 20 characters long' });
    }

    // Set default status if not provided
    const taskStatus = status || 'Pending';

    // Create task
    const task = await Task.create({
      title,
      description,
      status: taskStatus,
      userId
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error creating task', error: error.message });
  }
};

// @desc    Update task status
// @route   PUT /tasks/:id or PUT /api/tasks/:id
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    // Check status parameter
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Find task
    const task = await Task.findOne({ where: { id, userId } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    // Update status
    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error updating task', error: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /tasks/:id or DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Find task
    const task = await Task.findOne({ where: { id, userId } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    // Delete task
    await task.destroy();

    res.status(200).json({ message: 'Task deleted successfully', id });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error deleting task', error: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /tasks/stats or GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get counts grouped by status
    const totalTasks = await Task.count({ where: { userId } });
    const pendingTasks = await Task.count({ where: { userId, status: 'Pending' } });
    const inProgressTasks = await Task.count({ where: { userId, status: 'In Progress' } });
    const completedTasks = await Task.count({ where: { userId, status: 'Completed' } });

    res.status(200).json({
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks
    });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ message: 'Server error fetching stats', error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
};
