const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');  
// Register - show form
router.get('/signup', (req, res) => {
  res.render('users/signup.ejs');
});
// Register - handle sign up
router.post('/signup', wrapAsync(async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.redirect('/listings');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/signup');
  }
}));
// Login - show form
router.get('/login', (req, res) => {
  res.render('users/login.ejs');
});
// Login - handle login
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
  res.redirect('/listings');
});
// Logout - handle logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/listings');
  });
});
module.exports = router;