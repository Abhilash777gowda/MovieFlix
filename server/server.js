const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",                  // local dev
        "https://movieflix.vercel.app",           // old Vercel URL
        "https://movie-flix-eight-taupe.vercel.app" // NEW Vercel URL
    ],
    credentials: true,
}));

app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/movieflix';
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes placeholder
app.get('/', (req, res) => {
    res.send('MovieFlix API is running...');
});

// Import and use routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
