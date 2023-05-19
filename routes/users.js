const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req, res) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        await User.register(user, password);
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect(302, '/campgrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect(302, '/register');
    }
});

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect(302, '/campgrounds');
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            req.flash('error', err.message);
            return next(err);
        }
        req.flash('success', 'Goodbye');
        res.redirect('/campgrounds');
    });
})

module.exports = router;