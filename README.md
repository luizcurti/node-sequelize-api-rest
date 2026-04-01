# 🚀 REST API with Sequelize

[![Unit Tests](https://img.shields.io/badge/unit%20tests-82%20passing-brightgreen)](https://github.com/luizcurti/node-sequelize-api-rest)
[![E2E Tests](https://img.shields.io/badge/e2e%20tests-47%20passing-brightgreen)](https://github.com/luizcurti/node-sequelize-api-rest)
[![Node](https://img.shields.io/badge/node-v23.11.0-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-blue)](LICENSE)

Complete REST API built with Node.js, Express, and Sequelize ORM to manage users and students. Demonstrates RESTful API functionality with full CRUD operations, JWT authentication, file upload, comprehensive unit tests, and end-to-end integration tests running against a real MySQL database via Docker.

## 📋 Table of Contents

- [Technologies Used](#-technologies-used)
- [Features](#-features)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Available Scripts](#-available-scripts)
- [Testing](#-testing)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)

## 🛠 Technologies Used

### Core
- **Node.js v23.11.0** - JavaScript runtime
- **Express v5.1.0** - Web framework
- **Sequelize v6.37.7** - ORM for relational databases
- **MySQL2 v3.14.0** - MySQL driver

### Security & Authentication
- **JWT (jsonwebtoken v9.0.2)** - Token-based authentication
- **Bcryptjs v3.0.2** - Password hashing
- **Helmet v8.1.0** - HTTP security headers
- **CORS** - Configurable allowed origins

### Upload & Files
- **Multer v1.4.4** - Multipart file upload handling
- **crypto.randomBytes** - Collision-safe filename generation

### Configuration
- **Dotenv v16.4.7** - Environment variable management

### Testing & Quality
- **Jest v29.7.0** - Testing framework
- **Supertest v7.1.4** - HTTP integration testing
- **ESLint v9.23.0** - Static code analysis
- **Nodemon v3.1.9** - Hot reload in development

## ✨ Features

- ✅ **User Management** - Full CRUD with password hashing (bcrypt)
- ✅ **Student Management** - Full CRUD with field validations
- ✅ **JWT Authentication** - Secure login with configurable token expiration
- ✅ **Authorization Middleware** - Protected routes via `loginRequired`
- ✅ **Photo Upload** - Upload and associate images with students
- ✅ **Input Validation** - Sequelize-level validation on all models
- ✅ **CORS Configured** - Whitelist-based origin control
- ✅ **HTTP Security Headers** - Helmet integration
- ✅ **82 Unit Tests** - Controllers, models, middleware fully covered
- ✅ **47 E2E Tests** - All routes tested against a real MySQL database (Docker)

## 📦 Requirements

- **Node.js** v23.11.0 or higher
- **Docker** (for MySQL via Docker Compose — recommended)
- **npm**

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/luizcurti/node-sequelize-api-rest.git
cd node-sequelize-api-rest
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start MySQL via Docker

```bash
docker compose up -d
```

Or configure your own MySQL instance and set the credentials in `.env`.

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
# Database
DATABASE=school
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=root

# Application
APP_URL=http://localhost:3000
APP_PORT=3000

# JWT
TOKEN_SECRET=your_super_secret_key_here
TOKEN_EXPIRATION=7d
```

### 5. Run migrations

```bash
npx sequelize-cli db:migrate
```

### 6. (Optional) Run seeds

```bash
npx sequelize-cli db:seed:all
```

### 7. Start the application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## ⚙️ Configuration

### Docker Compose

The project includes a `docker-compose.yml` pre-configured for MySQL 8.0:

```yaml
services:
  mysql_database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: school
    ports:
      - "3306:3306"
    volumes:
      - ./db/mysql:/var/lib/mysql
```

## 📜 Available Scripts

```bash
npm run dev           # Start in development mode with nodemon
npm start             # Start in production mode
npm test              # Run unit tests (82 tests, no DB required)
npm run test:watch    # Run unit tests in watch mode
npm run test:coverage # Run unit tests with coverage report
npm run test:e2e      # Run E2E tests (requires Docker MySQL running)
npm run build         # Compile project with Sucrase
npm run lint          # Analyse code with ESLint
npm run lint:fix      # Auto-fix ESLint issues
```

## 🧪 Testing

The project has two separate test suites:

### Unit Tests (82 tests — no database required)

```bash
npm test
```

Tests controllers, models, and middleware in isolation using Jest mocks.

### E2E Tests (47 tests — requires Docker MySQL)

```bash
# Start MySQL first
docker compose up -d

# Run all routes against the real database
npm run test:e2e
```

End-to-end tests cover every route, validating real HTTP request/response cycles including authentication, validation errors, 404 responses, file upload, and cascading delete behaviour.

### Test Structure

```
__tests__/
├── setup.js                    # Unit test global configuration
├── unit/                       # Unit tests (mocked dependencies)
│   ├── config/
│   │   └── multerConfig.test.js
│   ├── controllers/
│   │   ├── HomeController.test.js
│   │   ├── PhotoController.test.js
│   │   ├── StudentController.test.js
│   │   ├── TokenController.test.js
│   │   └── UserController.test.js
│   ├── middlewares/
│   │   └── loginRequired.test.js
│   └── models/
│       ├── Photo.test.js
│       ├── Student.test.js
│       └── User.test.js
└── e2e/                        # End-to-end tests (real MySQL via Docker)
    ├── globalSetup.js          # Waits for DB + runs migrations
    ├── globalTeardown.js       # Cleans DB after all tests
    ├── setup.js                # E2E-specific Jest config
    ├── helpers.js              # Shared test utilities
    ├── home.test.js            # GET /
    ├── token.test.js           # POST /tokens/
    ├── user.test.js            # CRUD /user/
    ├── student.test.js         # CRUD /students/
    └── photo.test.js           # POST /photos/
```

## 📡 API Endpoints

### 🏠 Home

```http
GET /
```

Returns a welcome message.

---

### 🔐 Authentication

#### Login
```http
POST /tokens/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "John Doe",
    "id": 1,
    "email": "user@example.com"
  }
}
```

---

### 👤 Users

#### List all users
```http
GET /user/
```

#### Get specific user
```http
GET /user/:id
```

#### Create new user
```http
POST /user/
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Update user (requires authentication)
```http
PUT /user/
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe Updated"
}
```

#### Delete user (requires authentication)
```http
DELETE /user/
Authorization: Bearer {token}
```

**Success response:**
```json
{ "deleted": true }
```

---

### 🎓 Students

#### List all students
```http
GET /students/
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Jane",
    "lastname": "Smith",
    "email": "jane@example.com",
    "age": 22,
    "weight": 65.5,
    "height": 170.0,
    "Photos": []
  }
]
```

#### Get specific student
```http
GET /students/:id
```

#### Create new student (requires authentication)
```http
POST /students/
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane",
  "lastname": "Smith",
  "email": "jane@example.com",
  "age": 22,
  "weight": 65.5,
  "height": 170.0
}
```

#### Update student (requires authentication)
```http
PUT /students/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Updated",
  "age": 23
}
```

#### Delete student (requires authentication)
```http
DELETE /students/:id
Authorization: Bearer {token}
```

**Success response:**
```json
{ "deleted": true }
```

---

### 📸 Photos

#### Upload student photo (requires authentication)
```http
POST /photos/
Authorization: Bearer {token}
Content-Type: multipart/form-data

student_id: 1
photo: [file — PNG or JPG only]
```

**Success response (200):**
```json
{
  "id": 1,
  "originalname": "photo.jpg",
  "filename": "1712345678_a1b2c3d4e5f6g7h8.jpg",
  "student_id": 1,
  "url": "http://localhost:3000/images/1712345678_a1b2c3d4e5f6g7h8.jpg"
}
```

---

## 🔒 Authentication & Authorization

### JWT Token

Protected routes require a valid JWT token in the `Authorization` header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Protected Routes

Require authentication (`loginRequired` middleware):
- `POST /students/`
- `PUT /students/:id`
- `DELETE /students/:id`
- `PUT /user/`
- `DELETE /user/`
- `POST /photos/`

### Public Routes

No authentication required:
- `GET /`
- `POST /tokens/`
- `GET /students/`
- `GET /students/:id`
- `POST /user/`
- `GET /user/`
- `GET /user/:id`

---

## 📁 Project Structure

```
node-sequelize-api-rest/
├── __tests__/              # Unit and E2E tests
│   ├── e2e/               # End-to-end integration tests
│   ├── unit/              # Unit tests (mocked)
│   └── setup.js           # Unit test configuration
├── db/                    # MySQL data (Docker volume)
├── src/
│   ├── config/
│   │   ├── appConfig.js   # App URL config
│   │   ├── database.cjs   # Sequelize config (migrations)
│   │   ├── database.js    # Sequelize config (app)
│   │   └── multerConfig.js
│   ├── controllers/
│   │   ├── HomeController.js
│   │   ├── PhotoController.js
│   │   ├── StudentController.js
│   │   ├── TokenController.js
│   │   └── UserController.js
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── index.js
│   ├── middlewares/
│   │   └── loginRequired.js
│   ├── models/
│   │   ├── Photo.js
│   │   ├── Student.js
│   │   └── User.js
│   ├── routes/
│   │   ├── homeRoutes.js
│   │   ├── photoRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── tokenRoutes.js
│   │   └── userRoutes.js
│   ├── app.js
│   └── server.js
├── uploads/
│   └── images/
├── .env
├── babel.config.json
├── docker-compose.yml
├── eslint.config.js
├── jest.config.json       # Unit test config
├── jest.e2e.config.json   # E2E test config
├── nodemon.json
├── postman.json           # Postman collection (all routes)
└── package.json
```

---

## 🧰 Testing Tools

You can use the included Postman collection (`postman.json`) to manually test all routes, or any HTTP client:

- **Postman** - [Download](https://www.postman.com/downloads/)
- **Insomnia** - [Download](https://insomnia.rest/download)
- **Thunder Client** (VS Code extension)
- **cURL**

### Example with cURL

```bash
# Login
curl -X POST http://localhost:3000/tokens/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Create student (with token)
curl -X POST http://localhost:3000/students/ \
  -H "Authorization: Bearer {your_token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","lastname":"Smith","email":"jane@example.com","age":22,"weight":65.5,"height":170.0}'
```

---

## 📝 License

This project is under the ISC license.

---
