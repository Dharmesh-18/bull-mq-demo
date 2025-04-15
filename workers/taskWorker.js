const { Worker, QueueEvents } = require('bullmq');
const Task = require('../models/Task.js');
const { notificationQueue, taskQueue } = require('../config/queue');

// Worker for notification queue
const notificationWorker = new Worker('notificationQueue', async (job) => {
    console.log(`Processing notification job ${job.id} for task ${job.data.taskId}`);
    // Simulate sending a notification (e.g., email)
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Notification sent for task ${job.data.taskId}`);
}, { connection: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT } });

// Worker for task queue
const taskWorker = new Worker('taskQueue', async (job) => {
    const { taskId, priority } = job.data;
    console.log(`Processing task job ${job.id} for task ${taskId} with priority ${priority}`);

    try {
        // Update task status to processing
        await Task.findByIdAndUpdate(taskId, { status: 'processing' });

        // Simulate a time-consuming task (e.g., data processing)
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log(`Finished task job ${job.id} at ${new Date().toISOString()}`);

        // Update task status to completed
        await Task.findByIdAndUpdate(taskId, { status: 'completed' });
        console.log(`Task ${taskId} completed`);

        // Update job progress
        await job.updateProgress(100);
    } catch (error) {
        console.error(`Task ${taskId} failed:`, error);
        await Task.findByIdAndUpdate(taskId, { status: 'failed' });
        throw error; // Trigger retry
    }
}, {
    connection: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
    limiter: { max: 10, duration: 1000 }, // Rate limit: 10 jobs/sec
    concurrency: 5 // Process up to 5 jobs concurrently
});

// Event listeners for task queue
const taskQueueEvents = new QueueEvents('taskQueue', {
    connection: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }
});

taskQueueEvents.on('completed', ({ jobId }) => {
    console.log(`Job ${jobId} in taskQueue completed`);
});

taskQueueEvents.on('failed', ({ jobId, failedReason }) => {
    console.error(`Job ${jobId} in taskQueue failed: ${failedReason}`);
});

taskQueueEvents.on('progress', ({ jobId, data }) => {
    console.log(`Job ${jobId} progress: ${data}%`);
});

module.exports = { notificationWorker, taskWorker };