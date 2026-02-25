/**
 * app.js
 * Exports the Express app WITHOUT calling app.listen() so that
 * Supertest can import it cleanly in test files.
 */
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('MovieFlix API is running...');
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

module.exports = app;
