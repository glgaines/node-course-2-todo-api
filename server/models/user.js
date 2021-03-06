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
//remove any object from the array that has a token of the current user
//$pull - mongo operator that removes any objects in the database that match a criteria
UserSchema.methods.removeToken = function(token) {
  var user = this;
  //return to allow chaining
  return user.update({
    $pull: {
      tokens: {  // which array to look in
        token: token  //what to match - passed in token
      }
    }
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

UserSchema.statics.findByCredentials = function(email, password){
  var User = this;

  return User.findOne({email})
    .then((user) =>{
      if(!user) {
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, result) => {
          if(result) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    });
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
