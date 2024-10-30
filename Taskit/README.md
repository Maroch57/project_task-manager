Authentication System with Secure Access and Todo Page
This project implements a secure authentication system using JavaScript, ensuring token-based access using localStorage and cookies. Users are redirected to todo.html after a successful signup or login, and only authenticated users can access the todo page. Unauthorized users attempting access will be redirected to the login page.

Technologies Used
Frontend:
HTML5 & CSS3 – UI and styling
JavaScript (ES6) – API interactions and dynamic behavior
Backend:
Node.js with Express.js – Server-side logic
PostgreSQL – Database for user management
JWT (jsonwebtoken) – Authentication tokens for secure access
bcryptjs – Password hashing
dotenv – Managing environment variables
express-validator – Request validation
Getting Started
Prerequisites
Ensure the following tools are installed on your machine:

Node.js
PostgreSQL
Postman (optional, for testing APIs)
Installation
Clone the repository:
# bash
git clone https://github.com/Maroch57/project_task-manager.git
cd Taskit!

Install dependencies:
# bash
npm install

Set up the environment:
Create a .env file in the root directory with the following content:
# bash
PORT=3000
DATABASE_URL=postgres://<username>:<password>@localhost:5432/tododb
JWT_SECRET=your_jwt_secret

Create the PostgreSQL database:
# bash
psql -U <username>
CREATE DATABASE tododb;

Run database migrations (if using a migration tool like Sequelize or Knex):
# bash
npx sequelize-cli db:migrate

Start the server:
# bash
npm start


Project Structure
project-folder
│
├── backend
│   ├── controllers
│   │   └── authController.js
│   │   └── todoController.js
│   ├── middleware
│   │   └── auth.js
│   ├── routes
│       └── authRoutes.js
│       └── todoRoutes.js
│   └── models
│       └── user.js
│
├── frontend
│   ├── loginForm.html
│   ├── signupForm.html
│   ├── todo.html
│   └── js
│       └── api.js
│
└── .env
└── server.js


API Routes

[POST] /signup
Registers a new user.

Request

Method: POST
Endpoint: /signup
Compulsory request parameters: None (Expected fields: email, password, etc.)
Browser-based endpoint: False
[POST] /login
Authenticates a user and provides a token.

Request

Method: POST
Endpoint: /login
Compulsory request parameters: None (Expected fields: email, password)
Browser-based endpoint: False
[POST] /forgot-password
Sends password reset instructions to the user's email.

Request

Method: POST
Endpoint: /forgot-password
Compulsory request parameters: None (Expected field: email)
Browser-based endpoint: False
[POST] /reset-password/

Resets the password using a token.

Request

Method: POST
Endpoint: /reset-password/:token
Compulsory request parameters: Token (URL parameter)
Browser-based endpoint: False
[PUT] /profile
Updates user profile details.

Request

Method: PUT
Endpoint: /profile
Compulsory request parameters: None (Expected fields: user profile data)
Browser-based endpoint: False
[POST] /logout
Logs the user out by invalidating the session token.

Request

Method: POST
Endpoint: /logout
Compulsory request parameters: None
Browser-based endpoint: False
[POST] /todos
Creates a new to-do item for the user.

Request

Method: POST
Endpoint: /todos
Compulsory request parameters: None (Expected fields: todo details)
Browser-based endpoint: False
[GET] /todos
Retrieves all to-do items for the authenticated user.

Request

Method: GET
Endpoint: /todos
Compulsory request parameters: None
Browser-based endpoint: False
[PUT] /todos/

Updates a specific to-do item.

Request

Method: PUT
Endpoint: /todos/:id
Compulsory request parameters: ID (URL parameter)
Browser-based endpoint: False
[DELETE] /todos/

Deletes a specific to-do item.

Request

Method: DELETE
Endpoint: /todos/:id
Compulsory request parameters: ID (URL parameter)
Browser-based endpoint: False
[GET] /status
Returns the status of the API.

Request

Method: GET
Endpoint: /status
Compulsory request parameters: None
Browser-based endpoint: True

Authentication Routes (/auth)
POST /signup: Register a new user
POST /login: Authenticate and log in the user
GET /logout: Log out the user by clearing tokens

Todo Routes (/todos)
GET /todos: Retrieve the user's tasks
POST /todos: Add a new task
DELETE /todos/
: Delete a task

Frontend Code Overview

Signup Form (signupForm.html)
# html
<form id="signupForm">
  <h2>Sign Up</h2>
  <input type="text" name="username" placeholder="Username" required />
  <input type="email" name="email" placeholder="Email" required />
  <input type="password" name="password" placeholder="Password" required />
  <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
  <button type="submit">Sign Up</button>
  <p>Already have an account? <a href="loginForm.html">Login</a></p>
</form>

<script src="./js/api.js"></script>


Login Form (loginForm.html)
# html
<form id="loginForm">
  <h2>Login</h2>
  <input type="email" name="email" placeholder="Email" required />
  <input type="password" name="password" placeholder="Password" required />
  <button type="submit">Login</button>
  <p>Don't have an account? <a href="signupForm.html">Sign Up</a></p>
</form>

<script src="./js/api.js"></script>


JavaScript: Handling API Requests (api.js)
# javascript
const apiUrl = 'http://localhost:3000';

async function signup(e) {
  e.preventDefault();
  const formData = new FormData(document.getElementById('signupForm'));
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch(`${apiUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('token', result.token);
      window.location.href = 'todo.html';
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function login(e) {
  e.preventDefault();
  const formData = new FormData(document.getElementById('loginForm'));
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('token', result.token);
      window.location.href = 'todo.html';
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

document.getElementById('signupForm')?.addEventListener('submit', signup);
document.getElementById('loginForm')?.addEventListener('submit', login);


Backend Authentication Controller (authController.js)
# javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token });
};


Todo Controller (todoController.js)
# javascript
exports.getTodos = async (req, res) => {
  const todos = await Todo.findAll({ where: { userId: req.user.id } });
  res.json(todos);
};


List of Contributors
Edwin Waweru - Backend
Jahath Mwarori - Backend
David Edem - Frontend
