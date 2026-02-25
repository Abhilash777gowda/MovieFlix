const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    watchlist: {
        type: Array,
        default: [],
    },
    likes: {
        type: Array, // Array of movie IDs
        default: [],
    },
});

module.exports = mongoose.model('User', userSchema);
