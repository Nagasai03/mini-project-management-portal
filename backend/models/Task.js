const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Task title is required' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Task description is required' },
      len: {
        args: [20, 2000],
        msg: 'Description must be at least 20 characters long'
      }
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending',
    validate: {
      isIn: {
        args: [['Pending', 'In Progress', 'Completed']],
        msg: 'Status must be Pending, In Progress, or Completed'
      }
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
});

// Setup relationships
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Task;
