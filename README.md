# API REST with Sequelize
This project is an API built using Node.js and Sequelize ORM to manage a basic set of resources (e.g., users, students). It demonstrates the functionality of a RESTful API with CRUD operations.

## Technologies Used
* Node.js: A JavaScript runtime built on Chrome's V8 engine.
* Express: A web framework for Node.js used to build the API.
* Sequelize: A promise-based ORM for Node.js, used for interacting with databases.
* PostgreSQL: A powerful, open-source relational database system.
* JWT: JSON Web Token for secure authentication.
* Bcrypt.js: A library to hash and compare passwords.
* dotenv: A zero-dependency module that loads environment variables from a .env file into process.env.

## Features
* User Management: Create, read, update, and delete users.
* Student Management: CRUD operations for managing students' data.
* Authentication: User login and token-based authentication using JWT.
* Authorization: Protect routes using role-based access control (admin and regular users).
* File Upload: Handle file uploads for user profiles or student photos.

## Requirements
* Node.js (v14 or higher)
* PostgreSQL: A running instance of PostgreSQL database.

## Installation
Follow the steps below to set up the project:

1. Clone the repository:
* git clone https://github.com/luizcurti/apiRestSequelize.git
* cd apiRestSequelize

2. Install dependencies:
* npm install

3. Create a .env file in the root directory and configure your environment variables. Here’s an example:
* DB_HOST=localhost
* DB_USER=your_database_user
* DB_PASSWORD=your_database_password
* DB_NAME=your_database_name
* JWT_SECRET=your_jwt_secret
* PORT=3000

4. Run the migrations to create the necessary tables in the PostgreSQL database:
* npx sequelize-cli db:migrate

5. Seed the database with some initial data (optional):
* npx sequelize-cli db:seed:all

6. Start the application:
* npm start

The API should now be running on http://localhost:3000.

## API Endpoints
### Authentication
* POST /login: Login with email and password to receive a JWT token.

Request body:
{
  "email": "user@example.com",
  "password": "your_password"
}

### Users
GET /users: Get a list of all users.

GET /users/:id: Get details of a specific user by ID.

POST /users: Create a new user.

Request body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

PUT /users/:id: Update an existing user.

Request body:
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}

DELETE /users/:id: Delete a user by ID.

### Students
GET /students: Get a list of all students.

GET /students/:id: Get details of a specific student.

POST /students: Create a new student.

Request body:

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "age": 22,
  "weight": 65,
  "height": 170
}

PUT /students/:id: Update an existing student.

DELETE /students/:id: Delete a student.

### File Upload
POST /upload: Upload a file (e.g., image or document).

Request body: Form data with a photo field.

### Authentication & Authorization
JWT Authentication: A valid JWT token must be included in the Authorization header for protected routes. Example:

Authorization: Bearer <JWT_TOKEN>
Role-based Authorization: Users can have different roles (e.g., admin, user). Some routes are protected by role-based access control.

### Testing the API
You can use tools like Postman or Insomnia to test the API endpoints.