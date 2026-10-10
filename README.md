# Task Manager API

A RESTful backend API for managing personal tasks, built with **Node.js, Express.js, and MongoDB**. It features JWT-based authentication, user-specific task management, request validation, filtering, pagination, and centralized error handling.

## Features

- **User Authentication** — Register and log in using email and password.
- **Password Security** — Hash passwords using bcrypt before storing them.
- **JWT Authentication** — Protect endpoints using JSON Web Tokens.
- **Task CRUD** — Create, retrieve, update, and delete tasks.
- **User-Specific Access** — Restrict task operations to the authenticated user.
- **Request Validation** — Validate task fields and task IDs before processing requests.
- **Filtering and Search** — Filter tasks by status, priority, and subject; search task titles.
- **Pagination and Sorting** — Retrieve tasks in pages and sort by supported fields.
- **Task Statistics** — Retrieve task counts by status.
- **Centralized Error Handling** — Handle unexpected errors consistently.
- **Environment Configuration** — Keep database credentials and JWT secrets outside the source code.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API and routing |
| MongoDB | NoSQL database |
| Mongoose | Data modeling and database operations |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT generation and verification |
| dotenv | Environment variable management |
| Nodemon | Automatic server restart during development |

## Project Structure

```text
task-manager-api/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── validators/
│   │   └── taskValidators.js
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database, such as MongoDB Atlas
- An API client such as Postman or Thunder Client

### 1. Clone the repository

```bash
git clone https://github.com/the-himanshu-m/task-manager-api.git
cd task-manager-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Replace the placeholder values with your own configuration. Never commit your `.env` file or expose your database credentials and JWT secret.

### 4. Start the development server

```bash
npm run dev
```

To start the server without Nodemon:

```bash
npm start
```

The API runs at:

`http://localhost:3000`

The root endpoint returns a message confirming that the API is running.

## API Documentation

All task endpoints require a valid JWT. Include the following header in authenticated requests:

```http
Authorization: Bearer <your_jwt_token>
```

For JSON request bodies, use:

```http
Content-Type: application/json
```

### Authentication Endpoints

Base path: `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user and receive a JWT |

#### Register a user

**Request:** `POST /api/auth/register`

```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "password": "your_password"
}
```

#### Log in

**Request:** `POST /api/auth/login`

```json
{
  "email": "alex@example.com",
  "password": "your_password"
}
```

A successful login returns a JWT to use when accessing protected endpoints.

### Task Endpoints

Base path: `/api/tasks`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks` | Retrieve tasks with filtering and pagination |
| GET | `/api/tasks/stats` | Retrieve task statistics |
| GET | `/api/tasks/:id` | Retrieve a specific task |
| PATCH | `/api/tasks/:id` | Update selected task fields |
| DELETE | `/api/tasks/:id` | Delete a task |

#### Create a task

**Request:** `POST /api/tasks`

```json
{
  "title": "Complete backend project",
  "description": "Finish the Task Manager API",
  "subject": "Backend Development",
  "priority": "high",
  "status": "pending",
  "dueDate": "2026-10-20"
}
```

The authenticated user's ID is assigned by the server.

#### Filter, search, sort, and paginate tasks

**Request:** `GET /api/tasks?status=pending&priority=high&page=1&limit=5`

Supported query parameters:

| Parameter | Description |
|---|---|
| `status` | Filter by `pending`, `in-progress`, or `completed` |
| `priority` | Filter by `low`, `medium`, or `high` |
| `subject` | Filter by subject |
| `search` | Search task titles |
| `page` | Page number; defaults to `1` |
| `limit` | Results per page; defaults to `10`, maximum `100` |
| `sortBy` | Sort by `createdAt`, `dueDate`, `title`, `priority`, or `status` |
| `order` | `asc` or `desc`; defaults to `desc` |

Query parameters can be combined.

#### Update a task

**Request:** `PATCH /api/tasks/:id`

```json
{
  "status": "completed",
  "priority": "medium"
}
```

Only supported fields are accepted, and omitted fields remain unchanged.

#### Delete a task

**Request:** `DELETE /api/tasks/:id`

Provide the task ID in the URL and a valid JWT in the request headers.

#### Retrieve task statistics

**Request:** `GET /api/tasks/stats`

Returns the total number of tasks and counts for pending, in-progress, and completed tasks belonging to the authenticated user.

## Task Data Model

Each task contains the following fields:

| Field | Description |
|---|---|
| `title` | Required task title |
| `description` | Optional task description |
| `subject` | Task category or subject |
| `priority` | `low`, `medium`, or `high` |
| `status` | `pending`, `in-progress`, or `completed` |
| `dueDate` | Optional due date |
| `user` | Reference to the owning user |
| `createdAt` | Creation timestamp |
| `updatedAt` | Last update timestamp |

Timestamps are managed automatically by Mongoose.

## Error Handling

The API uses standard HTTP status codes to communicate request outcomes.

| Status | Meaning |
|---|---|
| `200 OK` | Request completed successfully |
| `201 Created` | Resource created successfully |
| `400 Bad Request` | Invalid input or malformed request |
| `401 Unauthorized` | Missing or invalid authentication |
| `404 Not Found` | Requested resource not found |
| `409 Conflict` | Duplicate record or conflicting value |
| `500 Internal Server Error` | Unexpected server-side error |

## Security and Design

- Passwords are hashed rather than stored in plaintext.
- JWTs are verified by authentication middleware.
- Task queries are scoped to the authenticated user.
- Task updates accept only explicitly supported fields.
- Mongoose schema validation provides additional data integrity checks.
- Environment variables are used for sensitive configuration.
- Error responses avoid exposing internal details in production.

## Future Improvements

- Automated API testing
- API documentation using Swagger/OpenAPI
- Rate limiting and additional security hardening
- Improved request validation and error handling
- Deployment and live API documentation

## Author

**Himanshu Mishra**

GitHub: [@the-himanshu-m](https://github.com/the-himanshu-m)

Project repository: [Task Manager API](https://github.com/the-himanshu-m/task-manager-api)
