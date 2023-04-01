const mongoose = require('mongoose');
const user = require('./users')

const gameStateSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    state: [{
        src: String,
        flipped: Boolean,
        id: Number
    }],
    turns: {
        type: Number
    }
});

const GameState = mongoose.model('GameState', gameStateSchema);
exports.GameState = GameState;
