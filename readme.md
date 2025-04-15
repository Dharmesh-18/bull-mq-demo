TaskManager - BullMQ Demo

A CRUD app with Express.js, MongoDB, Mongoose, and BullMQ to learn job queue management.

Prerequisites





Node.js (v18+)



MongoDB (running on mongodb://localhost:27017)



Redis (running on localhost:6379)

Setup





Clone the repository:

git clone <your-repo-url>
cd TaskManager



Install dependencies:

npm install



Create a .env file:

MONGODB_URI=mongodb://localhost:27017/taskmanager
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000



Ensure MongoDB and Redis are running locally.

Running the App





Development (with nodemon):

npm run dev



Production:

npm start

API Endpoints





POST /api/tasks: Create a task (e.g., { "title": "Test Task", "description": "Do something", "priority": 1 })



GET /api/tasks: List all tasks



GET /api/tasks/:id: Get a task by ID



PUT /api/tasks/:id: Update a task



DELETE /api/tasks/:id: Delete a task

BullMQ Features Demonstrated





Queues: notificationQueue and taskQueue for different job types.



Jobs: Add jobs with delays, priorities, and retries.



Workers: Process jobs with rate limiting and concurrency.



Events: Monitor job completion, failure, and progress.



Retries: Automatically retry failed jobs with exponential backoff.

Testing

Use Postman or curl to test endpoints. Example:

curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"Test Task","description":"Learn BullMQ","priority":1}'

Learning BullMQ





Check console logs for job processing, events, and errors.



Modify workers/taskWorker.js to experiment with job logic.



Adjust queue options in config/queue.js (e.g., retries, backoff).



Try failing jobs (e.g., throw an error in taskWorker) to see retries.