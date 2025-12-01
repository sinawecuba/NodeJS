const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true 
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.plugin(uniqueValidator);

// Add password hashing before saving
UserSchema.pre('save', function(next) {
  const user = this;
  
  // Only hash if password is modified
  if (!user.isModified('password')) return next();
  
  bcrypt.hash(user.password, 10, (error, hash) => {
    if (error) return next(error);
    user.password = hash;
    next();
  });
});

// Create and export the model - THIS WAS MISSING!
const User = mongoose.model('User', UserSchema);
module.exports = User;