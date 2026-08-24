const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const authRoute = require('./routes/auth.router');
const taskRoute = require('./routes/task.router');
const errorHandler = require("./middleware/errorHandler")

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/tasks', taskRoute);
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => { res.json({ message: 'Task/Notes API is running', docs: '/api-docs', health: '/health' }); });
app.use((req, res) => res.status(404).json({ error: 'Route Not Found' }));
app.use(errorHandler)
module.exports = app;