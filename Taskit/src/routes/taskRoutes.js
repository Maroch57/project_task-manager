const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Create a new task
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

module.exports = router;
