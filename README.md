# Mini Project Management Portal

A modern, responsive, full-stack project task management portal designed with rich aesthetics. Built using **React (Vite)** for the frontend, **Node.js (Express)** for the backend, **MySQL** with **Sequelize ORM** for the database, and styled using modern custom **Vanilla CSS** (supporting light/dark modes, glassmorphism, and responsive layouts).

---

## Key Features

- **User Authentication**: Secure register and login system using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Task Management**: Full CRUD operations for tasks (Create, Read, Update, Delete).
- **Dashboard Statistics**: Dynamic count metrics for *Total Tasks*, *Pending Tasks*, *In Progress Tasks*, and *Completed Tasks*.
- **Search & Filtering**: Real-time searching of tasks by title/description, and filtering by status (Pending, In Progress, Completed).
- **Sorting**: Sort tasks by Created Date, Title, or Status (Ascending/Descending).
- **Pagination**: Supports server-side paginated loading of tasks.
- **Dark Mode**: Sleek dark mode toggle in the navigation bar with state persisted in local storage.
- **Unit Tests**: Full API endpoint testing using Jest and Supertest.

---

## Expected Folder Structure

```text
project-root/
├── backend/
│   ├── config/       # Database & Sequelize connection configuration
│   ├── controllers/  # Auth & Task controller logic
│   ├── middleware/   # JWT Authentication route protection middleware
│   ├── models/       # Sequelize database models (User, Task)
│   ├── routes/       # Auth & Task express endpoints
│   ├── tests/        # Integration unit tests (Jest & Supertest)
│   ├── .env.example  # Sample environment configuration file
│   └── server.js     # Entry point for backend Express app
├── frontend/
│   ├── public/       # Static assets
│   └── src/
│       ├── components/ # Reusable UI components (Navbar, StatsCard, TaskCard)
│       ├── pages/      # Route pages (DashboardPage, AddTaskPage, LoginPage, RegisterPage)
│       ├── services/   # Axios API service configurations
│       ├── App.jsx     # App router configuration
│       ├── index.css   # Main stylesheet (Color systems & responsiveness)
│       └── main.jsx    # Vite react application mounting
└── README.md
```

---

## API Documentation

### Authentication Endpoints

#### 1. Register User
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Response** (Status 201):
  ```json
  {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### 2. Authenticate / Login User
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Response** (Status 200):
  ```json
  {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### 3. Get Current User Info
- **Endpoint**: `GET /api/auth/me`
- **Access**: Private (Requires `Authorization: Bearer <token>`)
- **Response** (Status 200):
  ```json
  {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2026-06-20T11:00:00.000Z",
    "updatedAt": "2026-06-20T11:00:00.000Z"
  }
  ```

---

### Task Endpoints

*Note: All task endpoints are protected and require a header field: `Authorization: Bearer <JWT_TOKEN>`.*

#### 1. Create a Task
- **Endpoint**: `POST /tasks` or `POST /api/tasks`
- **Request Body**:
  ```json
  {
    "title": "Build Login Page",
    "description": "Create a responsive login page with validation.",
    "status": "Pending"
  }
  ```
- **Response** (Status 201):
  ```json
  {
    "id": 1,
    "title": "Build Login Page",
    "description": "Create a responsive login page with validation.",
    "status": "Pending",
    "userId": 1,
    "updatedAt": "2026-06-20T11:15:00.000Z",
    "createdAt": "2026-06-20T11:15:00.000Z"
  }
  ```

#### 2. Get All Tasks (Supports Filtering, Search, Sort & Pagination)
- **Endpoint**: `GET /tasks` or `GET /api/tasks`
- **Query Parameters (Optional)**:
  - `status`: Filter by status (`Pending`, `In Progress`, `Completed`).
  - `search`: Search query string matching title/description.
  - `sortBy`: Database field to sort by (default: `createdAt`).
  - `order`: Sorting order (`ASC` or `DESC`, default: `DESC`).
  - `page`: Page index (default: `1`).
  - `limit`: Tasks per page (default: `10`).
- **Response** (Status 200):
  ```json
  {
    "success": true,
    "count": 2,
    "totalPages": 1,
    "currentPage": 1,
    "tasks": [
      {
        "id": 1,
        "title": "Build Login Page",
        "description": "Create a responsive login page with validation.",
        "status": "Pending",
        "userId": 1,
        "createdAt": "2026-06-20T11:15:00.000Z",
        "updatedAt": "2026-06-20T11:15:00.000Z"
      }
    ]
  }
  ```

#### 3. Update Task Status
- **Endpoint**: `PUT /tasks/:id` or `PUT /api/tasks/:id`
- **Request Body**:
  ```json
  {
    "status": "Completed"
  }
  ```
- **Response** (Status 200):
  ```json
  {
    "id": 1,
    "title": "Build Login Page",
    "description": "Create a responsive login page with validation.",
    "status": "Completed",
    "userId": 1,
    "createdAt": "2026-06-20T11:15:00.000Z",
    "updatedAt": "2026-06-20T11:20:00.000Z"
  }
  ```

#### 4. Delete a Task
- **Endpoint**: `DELETE /tasks/:id` or `DELETE /api/tasks/:id`
- **Response** (Status 200):
  ```json
  {
    "message": "Task deleted successfully",
    "id": "1"
  }
  ```

#### 5. Get Dashboard Statistics
- **Endpoint**: `GET /tasks/stats` or `GET /api/tasks/stats`
- **Response** (Status 200):
  ```json
  {
    "totalTasks": 2,
    "pendingTasks": 1,
    "inProgressTasks": 0,
    "completedTasks": 1
  }
  ```

---

## Setup & Running Guide

### Prerequisites
- Node.js (v18 or above recommended)
- MySQL Server (usually available via XAMPP)

### Step 1: Database Setup
1. Start your local MySQL server.
2. Create a new database named `project_management_db` and a test database named `project_management_test_db`.
   ```sql
   CREATE DATABASE project_management_db;
   CREATE DATABASE project_management_test_db;
   ```

### Step 2: Clone the Project
```bash
git clone <repository-url>
cd project-management-portal
```

### Step 3: Backend Configuration & Start
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Verify/update your database credentials in the `.env` file.
5. Start the backend server:
   ```bash
   npm start
   ```
   *The server runs on http://localhost:5000.*

### Step 4: Frontend Configuration & Start
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the React Vite development server:
   ```bash
   npm run dev
   ```
   *The client runs on http://localhost:5173.*

---

## Running Unit Tests

To run the automated endpoint integration tests:
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Execute the tests:
   ```bash
   npm test
   ```

---

## Development Assumptions

1. **Local MySQL**: Assumed a local MySQL database server is running on `127.0.0.1:3306` with `root` user and no password (default configurations for local developers using XAMPP/WAMP).
2. **Auth Integration**: Tasks are strictly linked to users (`userId`). A user can only view, filter, search, update, or delete tasks they created.
3. **Database Fallback for Testing**: During testing (`NODE_ENV=test`), Sequelize connects to a separate database (`project_management_test_db`) and synchronizes with `{ force: true }` to avoid polluting development data.
4. **Environment Variables**: Port defaults to `5000` for the backend server and `5173` for the Vite React server.
