# Webstack - Portfolio Project

This is a capstone project that is collaborated by three members namely:
1. Jahath Mwarori - (MySQL) database setup, schema design, ORM integration, DB optimization  &  DB maintenance
2. Edwin Waweru - (node.js) server-side logic & controllers design, API Design & integration, API Routing.
3. Edem Dufe - (HTML, CSS, JS) User Interface Design, UI styling, API calls(ajax/fetch), Form Handling, Dynamic Handling

## Tasks
### 0. The presentation

You will present your project individually or as a team on a zoom call.

Your presentation, inclusive of the demo, should not exceed 16 minutes. You are expected to provide the following:

A public GitHub repository for your project.
A Google Slides presentation including:
A brief description of the project and your team.
A breakdown of the architecture and the technologies or third-party services used.
A report of your developments, highlighting your successes, challenges, areas for improvement, lessons learned, and next steps for your project.
A conclusion summarizing your experience.
Remember, the presentation is a vital part of your project completion, so be sure to include it in your planning to avoid any delays in submission.


### 1. Video Demo of your project

Alongside your project presentation, we require a short video demo, no longer than 3 minutes, that showcases the essential features of your project, illustrating how they all work together. This could take the form of a user walkthrough.

We’ve created a tutorial video to inspire you with our expectations. Think of it as an inspirational tool, not a strict template, designed to help you effectively showcase your brilliant work. Your creativity and individual touch will make your demo even more engaging.


A few points to consider while preparing your video:

Maximum Video Duration: The video should not exceed 3 minutes, ensuring it is concise and engaging.

Background Music: If you include background music, ensure it’s copyright-free to avoid potential legal issues.

Voice-Overs: Feel free to use your voice to guide us through your project. Ensure your voice is clear, audible, and not overshadowed by the background music.

Recommended Tools: We suggest using

Recording: Zoom(record + screenshare), Loom, Camtasia, etc
Editing tools such as: Filmora Wondershare, Camtasia for your video creation.
How to share: YouTube (or, if blocked in your country, use a similar site), or a cloud storage service (G-drive, One-drive, etc). Submit the URL of your video. Make sure your video is accessible to the public - On YouTube, it’s fine to flag it as “unlisted,” but don’t flag it as “private”
Please note that your project will not be considered complete without this video submission. It forms an integral part of your final project assessment.

So, let’s see your creativity in action.

We are eagerly awaiting your presentations and demo videos.

Happy building,


### 3. Good use of Version Control

You must demonstrate a good understanding of version control through effective use in your portfolio project. This include:

Committing as often as possible
using descriptive and professional commit messages
collaboration through the use of branches and pull requests

# project mvc structure
Taskit/
│
├── public/                     # Frontend (static files)
│   ├── css/
│   │   └── styles.css          # Global CSS styling for frontend
│   ├── js/
│   │   ├── main.js             # Logic for landing page interactions
│   │   └── todo.js             # JavaScript logic for the todo app UI
│   ├── index.html              # Landing page (welcome, login, sign-up buttons)
│   └── todo.html               # Todo App UI (user dashboard)
│                           # backend 
├── views/                      # EJS templates (server-side views)
│   ├── loginForm.ejs           # Login form for Google or email
│   ├── signupForm.ejs          # Signup form for Google or email
│   ├── error.ejs               # Error view for server-side issues
│   └── profile.ejs             # User profile page (optional)
│
├── src/                        # Backend logic
│   ├── controllers/            # Controllers handle logic for each route
│   │   ├── authController.js   # Logic for login, signup, and logout
│   │   ├── userController.js    # Logic for user profile and management
│   │   └── taskController.js    # Logic for CRUD operations on tasks
│   │
│   ├── routes/                 # Routes for backend APIs
│   │   ├── authRoutes.js       # Auth routes for login, signup, logout
│   │   ├── userRoutes.js       # User management routes
│   │   └── taskRoutes.js       # Routes for managing tasks
│   │
│   ├── middleware/             # Middleware functions
│   │   ├── passportConfig.js   # Passport strategies (Google, Local, MagicLink)
│   │   └── jwtAuth.js          # JWT authentication middleware
│   │
│   ├── models/                 # Prisma ORM and database schema
│   │   └── prisma.schema       # MySQL schema (Prisma)
│   │
│   ├── prisma/                 # Prisma migrations
│   │   └── migrations/         # Database migrations folder
│   │
│   ├── tests/                  # Backend unit tests
│   │   ├── auth.test.js        # Tests for authentication
│   │   ├── user.test.js        # Tests for user management
│   │   └── task.test.js        # Tests for task management
│   │
│   ├── utils/                  # Helper functions
│   │   ├── sendEmail.js        # Sends MagicLink emails
│   │   └── logger.js           # Logger utility (optional)
│   │
│   ├── app.js                  # Express app initialization
│   └── server.js               # Server entry point
│
├── .env                        # Environment variables (JWT secret, DB credentials)
├── package.json                # Project dependencies
├── package-lock.json           # Lock file for dependencies
├── README.md                   # Documentation
└── api-docs/                   # API documentation (Swagger)
    └── taskit-api.yaml         # OpenAPI (Swagger) file
