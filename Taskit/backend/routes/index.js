const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const todoController = require('../controllers/todoController');
const profileController = require('../controllers/profileController');
const authenticateToken = require('../middleware/auth');

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Profile route
router.put('/profile', authenticateToken, profileController.updateProfile);

// Todo routes
router.post('/todos', authenticateToken, todoController.createTodo); // Create task
router.get('/todos', authenticateToken, todoController.getTodos); // Get all task for a specific user
router.put('/todos/:id', authenticateToken, todoController.updateTodo); // Update task
router.delete('/todos/:id', authenticateToken, todoController.deleteTodo);

// Initial Route status
router.get("/status", (req, res) => {
       res.status(200).json({ message: 'Welcome to Taskit' });
})

module.exports = router;
