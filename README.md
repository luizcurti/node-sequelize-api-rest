# 🚀 REST API with Sequelize

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](https://github.com/luizcurti/node-sequelize-api-rest)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/luizcurti/node-sequelize-api-rest)
[![Node](https://img.shields.io/badge/node-v23.11.0-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-blue)](LICENSE)

Complete REST API built with Node.js, Express, and Sequelize ORM to manage users and students. Demonstrates RESTful API functionality with CRUD operations, JWT authentication, file upload, and 100% test coverage.

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
- **MySQL2 v3.11.6** - MySQL driver

### Security & Authentication
- **JWT (jsonwebtoken v9.0.2)** - Token-based authentication
- **Bcryptjs v3.0.2** - Password hashing

### Upload & Validation
- **Multer v1.4.4** - File upload management
- **Dotenv v16.4.7** - Environment variables management
- **Helmet v8.0.0** - HTTP headers protection
- **Express Rate Limit v7.5.0** - Request rate limiting

### Testing & Quality
- **Jest v29.7.0** - Testing framework (100% coverage)
- **Supertest v7.1.4** - HTTP integration testing
- **ESLint v9.17.0** - Code analysis
- **Nodemon v3.1.9** - Hot reload in development

## ✨ Features

- ✅ **User Management** - Complete CRUD with password hashing
- ✅ **Student Management** - CRUD with robust validations
- ✅ **JWT Authentication** - Secure login with tokens
- ✅ **Authorization** - Middleware-protected routes
- ✅ **Photo Upload** - Upload and associate images with students
- ✅ **Validations** - Data validation on all endpoints
- ✅ **Configured CORS** - Allowed origins control
- ✅ **Rate Limiting** - API abuse protection
- ✅ **100% Test Coverage** - Unit and integration tests

## 📦 Requirements

- **Node.js** v23.11.0 or higher
- **MySQL** 8.0 or higher (can use Docker)
- **npm** or **yarn**

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

### 3. Configure MySQL database (using Docker)

```bash
docker-compose up -d
```

Or manually configure your MySQL and adjust credentials in `.env`.

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
# Database
DATABASE=school
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=senha123

# Application
APP_URL=http://localhost:3001
APP_PORT=3001

# JWT
TOKEN_SECRET=sua_chave_secreta_super_segura_aqui
TOKEN_EXPIRATION=7d
```

### 5. Run migrations

```bash
npx sequelize db:migrate
```

### 6. (Optional) Run seeds

```bash
npx sequelize db:seed:all
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

The API will be running at `http://localhost:3001`

## ⚙️ Configuration

### Docker Compose

The project includes a `docker-compose.yml` configured for MySQL:

```yaml
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: senha123
      MYSQL_DATABASE: school
    ports:
      - "3306:3306"
    volumes:
      - ./db/mysql:/var/lib/mysql
```

## 📜 Available Scripts

```bash
npm run dev          # Start in development mode with nodemon
npm start            # Start in production mode
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run build        # Build project with Sucrase
npm run lint         # Analyze code with ESLint
npm run lint:fix     # Automatically fix ESLint issues
```

## 🧪 Testing

The project has **100% test coverage** with Jest and Supertest.

### Run tests

```bash
# All tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test structure

```
__tests__/
├── setup.js                    # Global test configuration
├── integration/                # Integration tests
│   ├── home.test.js
│   ├── student.test.js
│   ├── token.test.js
│   ├── user.test.js
│   ├── photo.test.js
│   └── app.test.js
└── unit/                       # Unit tests
    ├── config/
    ├── controllers/
    ├── middlewares/
    ├── models/
    └── routes/
```

### Coverage Report

```
All files              |     100 |      100 |     100 |     100 |
 config                |     100 |      100 |     100 |     100 |
 controllers           |     100 |      100 |     100 |     100 |
 database              |     100 |      100 |     100 |     100 |
 middlewares           |     100 |      100 |     100 |     100 |
 models                |     100 |      100 |     100 |     100 |
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
  "email": "admin@email.com",
  "password": "123456"
}
```

**Success response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "Admin",
    "id": 1,
    "email": "admin@email.com"
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
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

#### Update user (requires authentication)
```http
PUT /user/
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva Updated",
  "email": "joao.updated@example.com"
}
```

#### Delete user (requires authentication)
```http
DELETE /user/
Authorization: Bearer {token}
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
    "name": "Maria",
    "lastname": "Santos",
    "email": "maria@example.com",
    "age": 22,
    "weight": 65.5,
    "height": 1.70,
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
  "name": "Maria",
  "lastname": "Santos",
  "email": "maria@example.com",
  "age": 22,
  "weight": 65.5,
  "height": 1.70
}
```

#### Update student (requires authentication)
```http
PUT /students/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Maria Updated",
  "age": 23
}
```

#### Delete student (requires authentication)
```http
DELETE /students/:id
Authorization: Bearer {token}
```

---

### 📸 Photos

#### Upload student photo (requires authentication)
```http
POST /photos/
Authorization: Bearer {token}
Content-Type: multipart/form-data

student_id: 1
photo: [file]
```

**Success response (200):**
```json
{
  "originalname": "foto.jpg",
  "filename": "1234567890_foto.jpg",
  "student_id": 1,
  "url": "http://localhost:3001/images/1234567890_foto.jpg"
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

Don't require authentication:
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
├── __tests__/              # Unit and integration tests
│   ├── integration/        # Integration tests
│   ├── unit/              # Unit tests
│   └── setup.js           # Test configuration
├── coverage/              # Coverage reports
├── db/                    # MySQL data (Docker volume)
├── src/
│   ├── config/           # Configurations
│   │   ├── appConfig.js  # Application config
│   │   ├── database.js   # Sequelize config
│   │   └── multerConfig.js # Upload config
│   ├── controllers/      # API controllers
│   │   ├── HomeController.js
│   │   ├── PhotoController.js
│   │   ├── StudentController.js
│   │   ├── TokenController.js
│   │   └── UserController.js
│   ├── database/         # Database
│   │   ├── migrations/   # Sequelize migrations
│   │   ├── seeds/        # Sequelize seeds
│   │   └── index.js      # DB connection
│   ├── middlewares/      # Custom middlewares
│   │   └── loginRequired.js
│   ├── models/           # Sequelize models
│   │   ├── Photo.js
│   │   ├── Student.js
│   │   └── User.js
│   ├── routes/           # API routes
│   │   ├── homeRoutes.js
│   │   ├── photoRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── tokenRoutes.js
│   │   └── userRoutes.js
│   ├── app.js           # Express configuration
│   └── server.js        # HTTP server
├── uploads/             # Uploaded files
│   └── images/         # Student images
├── .env                # Environment variables
├── .eslintrc.json      # ESLint config
├── babel.config.json   # Babel config
├── docker-compose.yml  # Docker config
├── jest.config.json    # Jest config
├── nodemon.json        # Nodemon config
└── package.json        # Dependencies and scripts
```

---

## 🧰 Testing Tools

You can use tools like:
- **Postman** - [Download](https://www.postman.com/downloads/)
- **Insomnia** - [Download](https://insomnia.rest/download)
- **Thunder Client** (VS Code extension)
- **cURL** (command line)

### Example with cURL

```bash
# Login
curl -X POST http://localhost:3001/tokens/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@email.com","password":"123456"}'

# Create student (with token)
curl -X POST http://localhost:3001/students/ \
  -H "Authorization: Bearer {your_token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"João","lastname":"Silva","email":"joao@example.com","age":25,"weight":75,"height":1.80}'
```

---

## 📝 License

This project is under the ISC license.

---

## 👨‍💻 Author

**Luiz Curti**
- GitHub: [@luizcurti](https://github.com/luizcurti)

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

If you encounter any issues or have questions, open an [issue](https://github.com/luizcurti/node-sequelize-api-rest/issues) on GitHub.