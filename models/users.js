const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Username must be at least 2 characters.'],
    maxlength: [30, 'Username must be less than 20 characters.'],
    required: [true, 'Your username cannot be blank.'],
  },
  about: {
    type: String,
    minlength: [2, 'Username must be at least 2 characters.'],
    maxlength: [30, 'Username must be less than 20 characters.'],
    required: [true, 'Your username cannot be blank.'],
  },
  avatar: {
    type: String,
    required: [true, 'Your username cannot be blank.'],
  },
});

module.exports = mongoose.model('user', userSchema);
