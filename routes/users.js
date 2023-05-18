const router = require('express').Router();
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
})


module.exports = router;