# 🚀 REST API with Sequelize

[![CI/CD Pipeline](https://github.com/luizcurti/node-sequelize-api-rest/actions/workflows/ci.yml/badge.svg)](https://github.com/luizcurti/node-sequelize-api-rest/actions/workflows/ci.yml)
[![Unit Tests](https://img.shields.io/badge/unit%20tests-62%20passing-brightgreen)](https://github.com/luizcurti/node-sequelize-api-rest)
[![E2E Tests](https://img.shields.io/badge/e2e%20tests-47%20passing-brightgreen)](https://github.com/luizcurti/node-sequelize-api-rest)
[![Postman Collection](https://img.shields.io/badge/postman%20collection-31%20requests-brightgreen)](https://github.com/luizcurti/node-sequelize-api-rest)
[![TypeScript](https://img.shields.io/badge/typescript-strict-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-ISC-blue)](LICENSE)

Multipart file upload (Multer, collision-safe filenames via `crypto.randomBytes`) on a
Sequelize/MySQL REST API, tested three independent ways — unit, end-to-end against a real
MySQL database, and a Postman/Newman collection — covering both the happy path and the
corresponding error paths. Layered / clean architecture: routes → controllers → services →
repository interfaces → Sequelize implementations, with JWT authentication.

## 📋 Table of Contents

- [Technologies Used](#-technologies-used)
- [Architecture](#-architecture)
- [Features](#-features)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Available Scripts](#-available-scripts)
- [Testing](#-testing)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Diagrams](#-diagrams)

## 🛠 Technologies Used

### Core
- **TypeScript** (strict mode) — compiled for dev/prod with [Sucrase](https://github.com/alangpierce/sucrase)
- **Node.js** — JavaScript runtime
- **Express 5** — web framework
- **Sequelize 6** — ORM for relational databases
- **MySQL2** — MySQL driver

### Security & Authentication
- **jsonwebtoken** — token-based authentication
- **bcryptjs** — password hashing
- **Helmet** — HTTP security headers
- **CORS** — origin allow-list, sourced from `APP_URL`

### Upload & Files
- **Multer** — multipart file upload handling
- **crypto.randomBytes** — collision-safe filename generation

### Configuration
- **dotenv** — environment variable management

### Testing & Quality
- **Jest** + **Supertest** — unit and end-to-end HTTP testing
- **Newman** — runs the Postman collection headlessly
- **ESLint** (`typescript-eslint`) — static analysis
- **Nodemon** — hot reload in development

## 🏛 Architecture

The codebase favors a small set of clear responsibilities over a heavier DDD structure —
just enough layering to keep business logic testable and swappable from the ORM, without
over-engineering a project this size:

- **Routes** (`src/routes/`) wire URLs to controllers and apply `loginRequired` where a
  route needs authentication.
- **Controllers** (`src/controllers/`) are thin: parse the request, call a service, shape
  the response. No business logic lives here.
- **Services** (`src/services/`) hold the business rules (e.g. "a student must exist before
  a photo can be attached to it") and depend only on repository **interfaces**, not on
  Sequelize directly.
- **Repositories** (`src/repositories/`) implement those interfaces on top of Sequelize
  models — swapping persistence technology later would only mean writing a new
  implementation, not touching services or controllers.
- **`container.ts`** wires concrete repositories into services once, at startup — a plain
  factory instead of a DI framework, which would be more machinery than this project needs.
- **Errors** (`src/errors/`) are a small typed hierarchy (`AppError` →
  `NotFoundError` / `UnauthorizedError` / `ValidationAppError`) caught by a single
  `errorHandler` middleware, so every failure — including raw Sequelize validation errors —
  turns into a consistent `{ errors: string[] }` response.

See [Diagrams](#-diagrams) below for a visual walkthrough.

## ✨ Features

- ✅ **User Management** — full CRUD with password hashing (bcrypt)
- ✅ **Student Management** — full CRUD with field validations
- ✅ **JWT Authentication** — secure login with configurable token expiration
- ✅ **Authorization Middleware** — protected routes via `loginRequired`
- ✅ **Photo Upload** — upload and associate images with students
- ✅ **Input Validation** — Sequelize-level validation on all models
- ✅ **CORS Configured** — allow-list driven by `APP_URL`
- ✅ **HTTP Security Headers** — Helmet integration
- ✅ **62 Unit Tests** — controllers, services, repositories, models and middleware, fully mocked
- ✅ **47 E2E Tests** — every route tested against a real MySQL database (Docker)
- ✅ **31-request Postman Collection** — happy + sad paths for every route, runnable via Newman

## 📦 Requirements

- **Node.js** 20+ (CI runs on 20.x)
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

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp .env.example .env
```

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
TOKEN_SECRET=replace_with_a_long_random_secret
TOKEN_EXPIRATION=7d
```

`.env` is git-ignored — never commit real secrets.

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
npm run dev             # Start in development mode with nodemon (runs .ts directly)
npm start               # Start in production mode (runs compiled dist/)
npm run build           # Compile TypeScript with Sucrase into dist/
npm run typecheck       # Type-check the project with tsc (no emit)
npm run lint             # Analyse code with ESLint
npm run lint:fix         # Auto-fix ESLint issues
npm test                 # Run unit tests (no database required)
npm run test:watch       # Run unit tests in watch mode
npm run test:coverage    # Run unit tests with coverage report
npm run test:e2e         # Run E2E tests (requires Docker MySQL running)
npm run test:collection  # Run the Postman collection via Newman (requires the app running)
npm run docs:diagrams    # Render docs/mmd/*.mmd Mermaid sources into docs/img/*.png
```

## 🧪 Testing

The project has three independent layers of testing, each covering happy paths and the
corresponding error paths (validation errors, missing auth, not found):

### 1. Unit Tests (62 tests — no database required)

```bash
npm test
```

Controllers, services, repositories, models and middleware tested in isolation with Jest
mocks — services are tested against mocked repository interfaces, so business rules are
verified independently of Sequelize.

### 2. E2E Tests (47 tests — requires Docker MySQL)

```bash
# Start MySQL first
docker compose up -d

# Run all routes against the real database
npm run test:e2e
```

End-to-end tests cover every route, validating real HTTP request/response cycles including
authentication, validation errors, 404 responses, file upload, and cascading delete
behaviour. `__tests__/e2e/globalSetup.ts` waits for MySQL to accept connections (works
identically against a local `docker compose` container or a CI service container) and runs
migrations before the suite starts; `globalTeardown.ts` truncates the tables afterwards.

### 3. Postman Collection (31 requests, 86 assertions — requires the app running)

```bash
# Start MySQL, then the app
docker compose up -d
npm run build && npm start

# In another terminal
npm run test:collection
```

`postman.json` exercises every route end-to-end through real HTTP calls (as opposed to
Supertest's in-process requests), chaining state through collection variables (`token`,
`userId`, `studentId`, ...) so it runs unattended from a clean database. It can also be
opened directly in Postman/Insomnia for manual exploration — see
[Testing Tools](#-testing-tools) below.

All three layers run automatically in CI on every push and pull request — see
[`.github/workflows/ci.yml`](.github/workflows/ci.yml).

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

Updates the account tied to the bearer token — there's no `:id` in the path.

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
├── __tests__/
│   ├── e2e/                     # End-to-end tests (real MySQL via Docker)
│   ├── unit/                    # Unit tests (mocked dependencies)
│   ├── fixtures/                # Shared test fixtures (e.g. test.png)
│   └── setup.ts                 # Unit test global configuration
├── docs/
│   ├── mmd/                     # Mermaid diagram sources
│   └── img/                     # Rendered diagram PNGs
├── db/                          # MySQL data (Docker volume, git-ignored)
├── src/
│   ├── config/                  # appConfig, database (Sequelize connection + CLI config)
│   ├── container.ts             # DI wiring: repositories -> services
│   ├── controllers/             # Thin HTTP controllers
│   ├── database/                # Sequelize bootstrap, migrations, seeds
│   ├── errors/                  # AppError hierarchy
│   ├── middlewares/              # loginRequired, errorHandler
│   ├── models/                  # Sequelize models (User, Student, Photo)
│   ├── repositories/            # Repository interfaces + Sequelize implementations
│   ├── routes/                  # Express routers
│   ├── services/                # Business logic (UserService, StudentService, ...)
│   ├── types/                   # Ambient type declarations
│   ├── app.ts
│   └── server.ts
├── scripts/                     # render-diagrams.mjs, write-dist-package-json.mjs
├── uploads/images/               # Uploaded photos (git-ignored, kept via .gitkeep)
├── .env.example
├── docker-compose.yml
├── postman.json                 # Postman collection (happy + sad paths)
├── postman.environment.json     # Default Postman environment (baseUrl)
└── package.json
```

---

## 🖼 Diagrams

Architecture and request-flow diagrams live as Mermaid sources in [`docs/mmd/`](docs/mmd)
and are rendered to PNG in [`docs/img/`](docs/img) via `npm run docs:diagrams`:

- [`architecture.png`](docs/img/architecture.png) — layered view: routes → controllers →
  services → repository interfaces → Sequelize repositories → models → MySQL, plus the DI
  container and the error-handling cross-cut.
- [`er-diagram.png`](docs/img/er-diagram.png) — entity-relationship diagram for
  `User`, `Student` and `Photo`.
- [`sequence-login.png`](docs/img/sequence-login.png) — `POST /tokens/` login flow.
- [`sequence-protected-request.png`](docs/img/sequence-protected-request.png) — how
  `loginRequired` validates a JWT before a protected route runs.
- [`sequence-photo-upload.png`](docs/img/sequence-photo-upload.png) — `POST /photos/`
  upload flow, including the student-existence check.

---

## 🧰 Testing Tools

You can use the included Postman collection (`postman.json` + `postman.environment.json`)
to explore or manually test all routes, or any HTTP client:

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
