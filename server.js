const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/database.js");
const taskRoutes = require("./routes/taskRoutes.js");
require("./workers/taskWorker.js"); // Start workers
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());

const { taskQueue } = require('./config/queue');
app.get('/api/clear-queue', async (req, res) => {
    await taskQueue.obliterate({ force: true });
    res.json({ message: 'Queue cleared' });
});

// Routes
app.use("/api", taskRoutes);

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
