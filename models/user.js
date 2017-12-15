var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});
UserSchema.pre('save', function(next){
  var user = this;
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(user.password, salt, function(err, hash){
      if(err){
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});
var User = mongoose.model('User', UserSchema);
module.exports = User;