const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type:String,
    trim: true,
    minlength: 1,
    required: true,
    unique: true,
    validate: {
      isAsync: false,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  tokens : [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});
//instance methods

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email'])
}

// generate a x-auth token that comes over in the header.
UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});
  return user.save()
    .then(() => {
      return token;
    })
};

//model methods
UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch(e) {
    return Promise.reject('test fail');
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
};

UserSchema.pre('save', function(next) {
  var user = this;  // this corresponds to the original document in mongoose
  // in order to avoid re hashing the password...
  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err,salt) => {
      //console.log(err)
      bcrypt.hash(user.password, salt, (err, hash) => {
        //console.log(err)
        user.password = hash;
        next();
      })
    })

  } else {
    next()
  }
})

var User = mongoose.model('User',UserSchema);

module.exports = { User }
