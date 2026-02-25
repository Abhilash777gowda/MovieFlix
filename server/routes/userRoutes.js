const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get watchlist
router.get('/watchlist/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (user) {
            res.status(200).json(user.watchlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// Add to watchlist
router.post('/add-watchlist', async (req, res) => {
    const { email, movie } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            if (!user.watchlist.some(m => m.id === movie.id)) {
                user.watchlist.push(movie);
                await user.save();
                res.status(200).json(user.watchlist);
            } else {
                res.status(400).json({ message: 'Movie already in watchlist' });
            }
        } else {
            const newUser = new User({ email, watchlist: [movie] });
            await newUser.save();
            res.status(201).json(newUser.watchlist);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// Remove from watchlist
router.post('/remove-watchlist', async (req, res) => {
    const { email, movieId } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            // Convert both to string to avoid id type mismatch (number vs string)
            user.watchlist = user.watchlist.filter(m => String(m.id) !== String(movieId));
            await user.save();
            res.status(200).json(user.watchlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// Toggle Like
router.post('/toggle-like', async (req, res) => {
    const { email, movieId } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const isLiked = user.likes.includes(movieId);
            if (isLiked) {
                user.likes = user.likes.filter(id => id !== movieId);
            } else {
                user.likes.push(movieId);
            }
            await user.save();
            res.status(200).json(user.likes);
        } else {
            const newUser = new User({ email, likes: [movieId] });
            await newUser.save();
            res.status(201).json(newUser.likes);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get likes
router.get('/likes/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (user) {
            res.status(200).json(user.likes);
        } else {
            res.status(200).json([]);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
