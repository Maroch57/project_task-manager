const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');

const jwtAuth = expressjwt({
       secret: process.env.JWT_SECRET,  // Shared secret for both signing and verifying
       algorithms: ['HS256'],  // HMAC-SHA256
   });
   
// Create a new task
router.post('/', jwtAuth, async (req, res) => {
    // Only taking userId and title
    const { title } = req.body;
    const userId = req.auth.id; // Accessing the user ID from the JWT
    console.log('userId:', userId); // Log the userId for debugging
    console.log('Task title:', title);
    try {
        const task = await prisma.task.create({
            data: { userId, title }, // Save task with userId and title
        });
        res.status(201).json(task);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Get all tasks for a user
router.get('/:userId', jwtAuth, async (req, res) => {
    const { userId } = req.params;
    try {
        const tasks = await prisma.task.findMany({
            where: { userId: parseInt(userId) },
        });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Update a task (e.g., mark as completed)
router.put('/:taskId', jwtAuth, async (req, res) => {
    const { taskId } = req.params;
    const { title, completed } = req.body; // Only taking title and completed status
    try {
        const updatedTask = await prisma.task.update({
            where: { id: parseInt(taskId) },
            data: { title, completed }, // Update title and completed status
        });
        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a task
router.delete('/:taskId', jwtAuth, async (req, res) => {
    const { taskId } = req.params;
    try {
        await prisma.task.delete({
            where: { id: parseInt(taskId) },
        });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;


/* // Create a new task
router.post('/', async (req, res) => {
    const { userId, title, description } = req.body;
    try {
        const task = await prisma.task.create({
            data: { userId, title, description },
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Get all tasks for a user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const tasks = await prisma.task.findMany({
            where: { userId: parseInt(userId) },
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Update a task (e.g., mark as completed)
router.put('/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { title, description, completed } = req.body;
    try {
        const updatedTask = await prisma.task.update({
            where: { id: parseInt(taskId) },
            data: { title, description, completed },
        });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a task
router.delete('/:taskId', async (req, res) => {
    const { taskId } = req.params;
    try {
        await prisma.task.delete({
            where: { id: parseInt(taskId) },
        });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});
*/
module.exports = router;
