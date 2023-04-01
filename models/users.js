const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        max: 15, min: 2,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    highScore: {
        type: Number,
        default: -1
    }
});

const User = mongoose.model('User', UserSchema);
exports.User = User