const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes below
router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/stats', getTaskStats);
router.put('/:id', updateTaskStatus);
router.delete('/:id', deleteTask);

module.exports = router;
