process.env.NODE_ENV = 'test';

const request = require('supertest');
const { app } = require('../server');
const { sequelize } = require('../config/db');
const User = require('../models/User');
const Task = require('../models/Task');

let token;
let taskId;

beforeAll(async () => {
  // Sync the test database (force: true drops and recreates tables)
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection after tests
  await sequelize.close();
});

describe('Authentication API Endpoints', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.name).toEqual('Test User');
    expect(res.body.email).toEqual('test@example.com');
  });

  it('should not register a user with an existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User 2',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
  });

  it('should login the user successfully and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token; // Save token for protected routes
  });

  it('should fail to login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toEqual(401);
  });
});

describe('Tasks API Endpoints', () => {
  it('should create a new task when authenticated', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Build Login Page',
        description: 'Create a responsive login page with form validations',
        status: 'Pending'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toEqual('Build Login Page');
    expect(res.body.status).toEqual('Pending');
    taskId = res.body.id; // Save taskId for later tests
  });

  it('should fail to create a task if description is less than 20 chars', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Short Task',
        description: 'Too short',
        status: 'Pending'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toContain('at least 20 characters');
  });

  it('should fail to create a task when unauthenticated', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: 'Unauth Task',
        description: 'This is a description that is long enough.',
        status: 'Pending'
      });

    expect(res.statusCode).toEqual(401);
  });

  it('should retrieve all tasks for the logged in user', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(res.body.tasks.length).toBe(1);
  });

  it('should get task stats for dashboard', async () => {
    const res = await request(app)
      .get('/tasks/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('totalTasks');
    expect(res.body.totalTasks).toBe(1);
    expect(res.body.pendingTasks).toBe(1);
    expect(res.body.completedTasks).toBe(0);
  });

  it('should update task status', async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'Completed'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('Completed');
  });

  it('should delete task', async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('deleted successfully');
  });

  it('should confirm task is deleted', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.tasks.length).toBe(0);
  });
});
