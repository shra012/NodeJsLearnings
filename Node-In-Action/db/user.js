const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_FACTOR = 11;

const user = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: Date,
    displayName: String,
    bio: String
});

user.methods.name = function() {
  return this.displayName || this.username;
};

user.methods.checkPassword = function(password, next) {
    bcrypt.compare(password, this.password, function (err, isCorrect){
       next(err, isCorrect);
    });
}

user.pre('save', function(next) {
    const user = this;
    if(!user.isModified('password')) {
        return next();
    }
    bcrypt.hash(user.password, SALT_FACTOR, function(err, hash) {
        if(err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});
const User = mongoose.model('User', user);
module.exports = User;