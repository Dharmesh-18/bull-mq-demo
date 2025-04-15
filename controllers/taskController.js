const Task = require('../models/Task.js');
const { notificationQueue, taskQueue } = require('../config/queue.js');

// Create a task
exports.createTask = async (req, res) => {
    try {
        const { title, description, priority = 1 } = req.body;
        const task = new Task({ title, description });
        await task.save();

        // Add notification job
        await notificationQueue.add('notifyTaskCreated', {
            taskId: task._id,
            title
        }, { delay: 2000 }); // Delay 2s

        // Add task processing job with priority
        await taskQueue.add('processTask', {
            taskId: task._id,
            priority
        }, { priority }); // Higher priority = processed sooner

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a task by ID
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, status },
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};