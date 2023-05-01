const passport = require('passport');

const User = require('../db/user');

const LocalStrategy = require('passport-local');
passport.use('login', new LocalStrategy(function (username, password, done) {
    User.findOne({username: username}).then((user) => {
        if (!user) {
            return done(null, false, { message: "No user has that username!" });
        }
        user.checkPassword(password, (err, isMatch) => {
            if (err) return done(err);
            if (isMatch) return done(null, user);
            return done(null,false, { message: "Invalid password."})
        });
    }).catch((err) => {
        return done(err);
    });
}));

module.exports = function() {
    passport.serializeUser(function (user, done){
       done(null, user._id);
    });
    passport.deserializeUser(function (id, done){
        User.findById(id).then((user) => {
           done(null, user);
        }).catch(err => {
            done(err, null);
        });
    });
};