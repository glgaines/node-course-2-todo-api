const mongoose = require('mongoose');
const validator = require('validator');

var User = mongoose.model('User', {
  email: {
    type:String,
    trim: true,
    minlength: 1,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  }
});

module.exports = { User }
