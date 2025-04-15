const { Queue } = require("bullmq");
require("dotenv").config();

const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

// Notification queue for sending task creation notifications
const notificationQueue = new Queue("notificationQueue", { connection });

// Task processing queue for status updates
const taskQueue = new Queue("taskQueue", {
  connection,
  defaultJobOptions: {
    attempts: 3, // Retry failed jobs up to 3 times
    backoff: { type: "exponential", delay: 1000 }, // Exponential backoff
  },
});

module.exports = { notificationQueue, taskQueue };
