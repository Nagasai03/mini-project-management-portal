const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, sequelize } = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging (Optional, helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
// Mount task routes on both /api/tasks and /tasks to support flexible endpoint configurations
app.use('/api/tasks', taskRoutes);
app.use('/tasks', taskRoutes);

// Base route for sanity check
app.get('/', (req, res) => {
  res.send('Mini Project Management Portal API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MySQL
    await connectDB();

    // Sync database tables
    // In production/testing, set force: false to avoid dropping existing data
    await sequelize.sync({ force: false });
    console.log('Database synchronized.');

    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

// Export app and server starter for testing
module.exports = { app, startServer };

// Run server only if this file is executed directly (not imported by tests)
if (require.main === module) {
  startServer();
}
