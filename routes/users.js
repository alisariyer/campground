const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req, res, next) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect(302, '/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect(302, '/register');
    }
});

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    // delete req.session.returnTo;
    res.redirect(302, redirectUrl);
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