const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../db/user');

router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash('error');
    res.locals.infos = req.flash('info');
    next();
});

router.get('/', (req, res, next) => {
    User.find().sort({createdAt: "descending"})
        .then(user => res.render('users/index', {users: user}))
        .catch(err => next(err));
});

router.get('/register', (req, res, next) => {
    res.render('users/register');
});

router.post('/register', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username}).then((user) => {
        if (user) {
            req.flash('error', 'User already exists');
            return res.redirect('/users/register');
        }
        const newUser = new User({username: username, password: password});
        newUser.save().then(next);
    }).catch((err) => {
        return next(err);
    })
}, passport.authenticate('local', {successRedirect: '/', failureRedirect: '/', failureFlash: true}));

module.exports = router;