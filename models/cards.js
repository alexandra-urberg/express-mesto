const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true
    },

    link: {
        type: String,
        required: true
    },

    owner: {
        type: ObjectId,
        required: true
    },

    likes: {
        default:[]
    },

    createdAt: {
        type: Date.now,
        default: Date.now
    }
});

module.exports = mongoose.model('card', cardSchema); 