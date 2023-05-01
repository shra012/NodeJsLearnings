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

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("info", "You must be logged in to see this page.");
        res.redirect("/users/login");
    }
}

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
}, passport.authenticate('login', {successRedirect: '/users', failureRedirect: '/users/register', failureFlash: true}));

router.get("/login", function (req, res) {
    res.render("users/login");
});

router.post("/login", passport.authenticate("login", {
    successRedirect: "/users",
    failureRedirect: "/users/login",
    failureFlash: true
}));

router.get('/logout',ensureAuthenticated, function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/users');
    });
});

router.get("/edit", ensureAuthenticated, function (req, res) {
    res.render("users/edit");
});

router.post("/edit", ensureAuthenticated, function (req, res, next) {
    req.user.displayName = req.body.displayname;
    req.user.bio = req.body.bio;
    req.user.save().then(() => {
        req.flash("info", "Profile updated!");
        res.redirect("/users/edit");
    }).catch((err) => next(err));
});

router.get('/:username', async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.params.username});
        if (!user) return next(404);
        res.render('users/profile', {user: user});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;