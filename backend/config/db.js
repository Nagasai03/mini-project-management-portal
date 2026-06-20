const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbName = process.env.NODE_ENV === 'test' ? 'project_management_test_db' : process.env.DB_NAME;

const sequelize = new Sequelize(
  dbName,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true, // adds createdAt and updatedAt
      underscored: true // converts camelCase columns to snake_case (created_at)
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the MySQL database:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
